type PortableTextBlock = {
  _key?: string;
  _type?: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

type RichTextContentProps = {
  value: unknown;
  className?: string;
};

function blockText(block: PortableTextBlock) {
  return (block.children ?? [])
    .map((child) => child.text ?? "")
    .join("")
    .trim();
}

export function RichTextContent({ value, className }: RichTextContentProps) {
  if (!Array.isArray(value)) {
    return null;
  }

  return (
    <div className={className}>
      {(value as PortableTextBlock[]).map((block) => {
        if (block._type !== "block") {
          return null;
        }

        const text = blockText(block);
        if (!text) {
          return null;
        }

        if (block.style === "h2") {
          return (
            <h2
              key={block._key ?? text}
              className="sadia-heading-subsection mt-10 first:mt-0"
            >
              {text}
            </h2>
          );
        }

        if (block.style === "h3") {
          return (
            <h3
              key={block._key ?? text}
              className="sadia-heading-subsection mt-8 text-heading-sm first:mt-0"
            >
              {text}
            </h3>
          );
        }

        return (
          <p
            key={block._key ?? text}
            className="sadia-lead-md mt-4 first:mt-0"
          >
            {text}
          </p>
        );
      })}
    </div>
  );
}
