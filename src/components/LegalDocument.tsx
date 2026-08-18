import { Container } from "@/components/Container";
import type { LegalDocumentContent } from "@/legal/documents";

type LegalDocumentProps = {
  document: LegalDocumentContent;
  children?: React.ReactNode;
};

export function LegalDocument({ document, children }: LegalDocumentProps) {
  return (
    <article className="bg-sadia-white pb-section-lg pt-16">
      <Container>
        <header className="max-w-3xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-gray">
            {document.law}
          </p>
          <h1 className="mt-5 text-display-md font-medium text-balance text-sadia-navy-black">
            {document.title}
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-sadia-gray">
            {document.description}
          </p>
          <p className="mt-4 text-body-sm text-sadia-gray">
            {document.updated}
          </p>
        </header>

        <div className="mt-14 max-w-3xl space-y-12">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-heading-md font-medium text-sadia-navy-black">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-body-lg leading-relaxed text-sadia-navy-black/75"
                >
                  {paragraph}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-body-lg leading-relaxed text-sadia-navy-black/75">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.table ? (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[40rem] border-collapse text-left text-body-sm">
                    <thead>
                      <tr className="border-b border-sadia-gray-light">
                        {section.table.headers.map((header) => (
                          <th
                            key={header}
                            className="py-3 pr-4 font-medium uppercase tracking-[0.08em] text-sadia-gray"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr
                          key={row.join("-")}
                          className="border-b border-sadia-gray-light/80"
                        >
                          {row.map((cell) => (
                            <td
                              key={cell}
                              className="py-3 pr-4 align-top text-sadia-navy-black/80"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
          {children}
        </div>
      </Container>
    </article>
  );
}
