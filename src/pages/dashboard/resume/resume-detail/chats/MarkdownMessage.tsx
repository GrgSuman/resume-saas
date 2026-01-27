import ReactMarkdown from 'react-markdown';
import "./MarkdownStyle.css";


export type Message = {
    role: "assistant" | "user";
    text: string;
}

export default function MarkdownMessage({ message }: { message: Message }) {
  return (
    <div
      className={`flex leading-relaxed ${message.role === "user" ? "justify-end" : "justify-start"
        } mb-2 lg:mb-4`}
    >
      <div
        className={`rounded-xl text-sm ${message.role === "assistant"
            ? "text-gray-800 p-2 lg:p-3"
            : "bg-secondary p-2 px-3 lg:p-3 lg:px-4"
          }`}
      >
        <div className="markdown-body text-[14px] lg:text-[16px]">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
