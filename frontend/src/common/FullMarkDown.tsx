// import 'katex/dist/katex.min.css'

// import a11yEmoji from '@fec/remark-a11y-emoji'
// import React from 'react'
// import ReactMarkdown from 'react-markdown'
// import rehypeKatex from 'rehype-katex'
// import remarkGemoji from 'remark-gemoji'
// import remarkGfm from 'remark-gfm'
// import remarkMath from 'remark-math'

// interface FullMarkDownProps {
//     content: string
// }

// const FullMarkDown: React.FC<FullMarkDownProps> = ({ content }) => {
//     return (
//         <ReactMarkdown
//             className={'prose dark:prose-dark '}
//             remarkPlugins={[remarkMath, remarkGfm, a11yEmoji, remarkGemoji]}
//             rehypePlugins={[rehypeKatex]}
//         >
//             {content}
//         </ReactMarkdown>
//     )
// }

// export default FullMarkDown
import "katex/dist/katex.min.css";

import a11yEmoji from "@fec/remark-a11y-emoji";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface FullMarkDownProps {
  inline?: boolean;
  content: string;
}

const FullMarkDown: React.FC<FullMarkDownProps> = ({
  inline = false,
  content,
}) => {
  return (
    <ReactMarkdown
      className={"  "}
      remarkPlugins={[remarkMath, remarkGfm, a11yEmoji, remarkGemoji]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? "");
          return inline == null && match != null ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag='div'
              {...props}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}>
      {content}
    </ReactMarkdown>
  );
};

export default FullMarkDown;
