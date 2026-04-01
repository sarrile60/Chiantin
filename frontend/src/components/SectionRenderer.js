import React from 'react';

export function renderSections(sections) {
  return sections.map((section, i) => (
    <section key={i} className="mb-10">
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((p, j) => (
        <p key={j} dangerouslySetInnerHTML={{ __html: p }} />
      ))}
      {section.subsections?.map((sub, k) => (
        <div key={k}>
          <h3>{sub.subheading}</h3>
          {sub.paragraphs?.map((p, j) => (
            <p key={j} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          {sub.list && (
            <ul>
              {sub.list.map((item, l) => (
                <li key={l} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          )}
        </div>
      ))}
      {section.list && (
        <ul>
          {section.list.map((item, l) => (
            <li key={l} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
      {section.afterList && (
        <p dangerouslySetInnerHTML={{ __html: section.afterList }} />
      )}
    </section>
  ));
}
