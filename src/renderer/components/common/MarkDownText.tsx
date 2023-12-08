import clsx from "clsx";
import ReactMarkdown from "react-markdown";

type MarkDownTextProps = {
  text: string;
  isThumbnail?: boolean;
  containerClassName?: string;
  markDownclassName?: string;
};
const MarkDown = ({
  text,
  isThumbnail,
  containerClassName,
  markDownclassName,
}: MarkDownTextProps) => {
  console.log(text);
  return (
    <div
      className={clsx(
        "prose p-6 max-w-full dark:prose-invert prose-headings:mb-0 prose-headings:mt-2 prose-p:mb-1 prose-p:mt-1 prose-p:first:mt-0 prose-ul:m-0 prose-li:m-0",
        { "h-full overflow-hidden": isThumbnail },
        containerClassName,
      )}
    >
      <ReactMarkdown skipHtml className={markDownclassName}>
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDown;
