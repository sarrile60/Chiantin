"""Drop the unique IBAN index from bank_accounts collection."""

import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, '/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

async def drop_iban_index():
    """Drop the unique IBAN index."""
    print("=" * 60)
    print("DROPPING UNIQUE IBAN INDEX")
    print("=" * 60)
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    
    try:
        # List existing indexes
        print("\nExisting indexes on bank_accounts:")
        indexes = await db.bank_accounts.list_indexes().to_list(length=None)
        for idx in indexes:
            print(f"  - {idx['name']}: {idx.get('key', {})}")
        
        # Drop the iban_1 index
        print("\nDropping iban_1 index...")
        result = await db.bank_accounts.drop_index("iban_1")
        print(f"✅ Index dropped successfully: {result}")
        
        # List indexes after drop
        print("\nIndexes after drop:")
        indexes = await db.bank_accounts.list_indexes().to_list(length=None)
        for idx in indexes:
            print(f"  - {idx['name']}: {idx.get('key', {})}")
        
        print("\n" + "=" * 60)
        print("SUCCESS: Unique IBAN constraint removed")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        if "index not found" in str(e).lower():
            print("ℹ️  Index may have already been dropped")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(drop_iban_index())
