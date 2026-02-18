"""Support ticket service."""

from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, UploadFile
import uuid

from schemas.tickets import Ticket, TicketCreate, MessageCreate, TicketMessage, TicketStatus, MessageAttachment
from utils.common import serialize_doc
from providers import StorageProvider


# Allowed file types and size limit
ALLOWED_EXTENSIONS = {
    # Images
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp',
    # Documents
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'txt', 'rtf', 'odt', 'ods', 'odp',
    # Other
    'csv', 'zip'
}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB
MAX_FILES_PER_MESSAGE = 5


def validate_file(file: UploadFile) -> tuple[bool, str]:
    """Validate file type and size."""
    # Check file extension
    if file.filename:
        ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
        if ext not in ALLOWED_EXTENSIONS:
            return False, f"File type '.{ext}' is not allowed. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
    
    return True, ""


class TicketService:
    def __init__(self, db: AsyncIOMotorDatabase, storage: Optional[StorageProvider] = None):
        self.db = db
        self.storage = storage
    
    async def create_ticket(self, user_id: str, user_name: str, data: TicketCreate) -> Ticket:
        """Create a new support ticket."""
        ticket = Ticket(
            user_id=user_id,
            subject=data.subject,
            description=data.description
        )
        
        # Add initial message
        initial_message = TicketMessage(
            sender_id=user_id,
            sender_name=user_name,
            is_staff=False,
            content=data.description
        )
        ticket.messages.append(initial_message)
        
        ticket_dict = ticket.model_dump(by_alias=True)
        await self.db.tickets.insert_one(ticket_dict)
        
        return ticket
    
    async def create_ticket_by_admin(
        self,
        user_id: str,
        user_name: str,
        subject: str,
        description: str,
        admin_id: str,
        admin_name: str
    ) -> Ticket:
        """Create a support ticket on behalf of a user (admin action)."""
        ticket = Ticket(
            user_id=user_id,
            subject=subject,
            description=description,
            created_by_admin=True,
            created_by_admin_id=admin_id
        )
        
        # Add initial message from support
        initial_message = TicketMessage(
            sender_id=admin_id,
            sender_name=admin_name,
            is_staff=True,
            content=description
        )
        ticket.messages.append(initial_message)
        
        ticket_dict = ticket.model_dump(by_alias=True)
        await self.db.tickets.insert_one(ticket_dict)
        
        return ticket
    
    async def get_user_tickets(self, user_id: str) -> List[dict]:
        """Get all tickets for a user with unread count (staff messages only)."""
        cursor = self.db.tickets.find({"user_id": user_id}).sort("created_at", -1)
        tickets = []
        async for doc in cursor:
            ticket = Ticket(**serialize_doc(doc))
            ticket_dict = ticket.model_dump()
            
            # Calculate unread messages from staff (messages after user_last_read_at that are from staff)
            user_last_read = doc.get("user_last_read_at")
            unread_count = 0
            messages = doc.get("messages", [])
            
            for msg in messages:
                # Count messages from staff that were created after user last read
                if msg.get("is_staff", False):
                    msg_created = msg.get("created_at")
                    if msg_created:
                        if user_last_read is None or msg_created > user_last_read:
                            unread_count += 1
            
            ticket_dict["unread_count"] = unread_count
            tickets.append(ticket_dict)
        
        return tickets
    
    async def get_all_tickets(self, status_filter: Optional[str] = None, search_query: Optional[str] = None) -> List[dict]:
        """Get all tickets (admin) with user information and unread counts."""
        from bson import ObjectId
        from bson.errors import InvalidId
        
        query = {}
        if status_filter and status_filter != 'all':
            query["status"] = status_filter
        
        cursor = self.db.tickets.find(query).sort("updated_at", -1).limit(100)
        tickets = []
        
        # Get all user IDs from tickets first
        ticket_docs = []
        async for doc in cursor:
            ticket_docs.append(doc)
        
        # Fetch all users - handle both ObjectId and string IDs
        user_ids_str = list(set(doc.get("user_id") for doc in ticket_docs if doc.get("user_id")))
        
        # Convert string IDs to ObjectId for query (MongoDB stores _id as ObjectId)
        user_ids_query = []
        for uid in user_ids_str:
            user_ids_query.append(uid)  # Keep string version
            try:
                user_ids_query.append(ObjectId(uid))  # Also try ObjectId version
            except (InvalidId, TypeError):
                pass
        
        users_map = {}
        
        if user_ids_query:
            # Query with both string and ObjectId versions
            users_cursor = self.db.users.find({"_id": {"$in": user_ids_query}})
            async for user_doc in users_cursor:
                # Map by string version of ID
                user_id = str(user_doc["_id"])
                users_map[user_id] = {
                    "email": user_doc.get("email", ""),
                    "first_name": user_doc.get("first_name", ""),
                    "last_name": user_doc.get("last_name", "")
                }
        
        # Build enriched ticket list
        for doc in ticket_docs:
            ticket = Ticket(**serialize_doc(doc))
            ticket_dict = ticket.model_dump()
            
            # Add user info
            user_id = doc.get("user_id")
            user_email = ""
            user_name = "Unknown User"
            
            if user_id and user_id in users_map:
                user_info = users_map[user_id]
                user_email = user_info["email"]
                user_name = f"{user_info['first_name']} {user_info['last_name']}".strip() or user_info["email"]
            
            ticket_dict["user_email"] = user_email
            ticket_dict["user_name"] = user_name
            
            # Calculate unread messages from client (messages after admin_last_read_at that are not from staff)
            admin_last_read = doc.get("admin_last_read_at")
            unread_count = 0
            messages = doc.get("messages", [])
            
            for msg in messages:
                # Count messages from clients (not staff) that were created after admin last read
                if not msg.get("is_staff", False):
                    msg_created = msg.get("created_at")
                    if msg_created:
                        if admin_last_read is None or msg_created > admin_last_read:
                            unread_count += 1
            
            ticket_dict["unread_count"] = unread_count
            
            # Apply search filter if provided (filter by user email - case insensitive partial match)
            if search_query:
                search_lower = search_query.lower()
                if search_lower not in user_email.lower() and search_lower not in user_name.lower():
                    continue  # Skip this ticket if doesn't match search
            
            tickets.append(ticket_dict)
        
        return tickets
    
    async def add_message(
        self,
        ticket_id: str,
        sender_id: str,
        sender_name: str,
        is_staff: bool,
        data: MessageCreate,
        attachments: List[MessageAttachment] = None
    ) -> Ticket:
        """Add a message to a ticket with optional attachments."""
        ticket_doc = await self.db.tickets.find_one({"_id": ticket_id})
        if not ticket_doc:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        message = TicketMessage(
            sender_id=sender_id,
            sender_name=sender_name,
            is_staff=is_staff,
            content=data.content,
            attachments=attachments or []
        )
        
        await self.db.tickets.update_one(
            {"_id": ticket_id},
            {
                "$push": {"messages": message.model_dump()},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        ticket_doc = await self.db.tickets.find_one({"_id": ticket_id})
        return Ticket(**serialize_doc(ticket_doc))
    
    async def upload_attachment(
        self,
        ticket_id: str,
        user_id: str,
        file: UploadFile
    ) -> MessageAttachment:
        """Upload a file attachment for a ticket message."""
        if not self.storage:
            raise HTTPException(status_code=500, detail="Storage not configured")
        
        # Validate file
        is_valid, error = validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
        
        # Read file to check size
        content = await file.read()
        file_size = len(content)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File size ({file_size / 1024 / 1024:.1f} MB) exceeds limit of {MAX_FILE_SIZE / 1024 / 1024:.0f} MB"
            )
        
        # Reset file pointer
        await file.seek(0)
        
        # Generate unique key for storage
        file_id = str(uuid.uuid4())
        ext = file.filename.rsplit('.', 1)[-1].lower() if file.filename and '.' in file.filename else 'bin'
        key = f"tickets/{ticket_id}/{file_id}_{file.filename}"
        
        # Upload to Cloudinary
        metadata = self.storage.upload_fileobj(
            file.file,
            key,
            content_type=file.content_type
        )
        
        # Create attachment record
        attachment = MessageAttachment(
            file_name=file.filename or "attachment",
            file_size=file_size,
            content_type=file.content_type or "application/octet-stream",
            url=metadata.url
        )
        
        return attachment
    
    async def update_ticket_status(
        self,
        ticket_id: str,
        new_status: TicketStatus,
        assigned_to: Optional[str] = None
    ) -> Ticket:
        """Update ticket status (admin)."""
        update_data = {
            "status": new_status,
            "updated_at": datetime.utcnow()
        }
        
        if new_status == TicketStatus.RESOLVED:
            update_data["resolved_at"] = datetime.utcnow()
        
        if assigned_to:
            update_data["assigned_to"] = assigned_to
        
        await self.db.tickets.update_one(
            {"_id": ticket_id},
            {"$set": update_data}
        )
        
        ticket_doc = await self.db.tickets.find_one({"_id": ticket_id})
        return Ticket(**serialize_doc(ticket_doc))