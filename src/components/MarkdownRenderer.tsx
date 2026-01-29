import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
}) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <div className="rounded-lg overflow-hidden my-2 shadow-sm border border-slate-700/50">
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    background: "#1e293b", // slate-900 like
                                }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code
                            className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200`}
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                ul: ({ children }) => (
                    <ul className="list-disc pl-5 my-2 space-y-1">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-5 my-2 space-y-1">
                        {children}
                    </ol>
                ),
                h1: ({ children }) => (
                    <h1 className="text-2xl font-bold my-4 border-b pb-2 border-slate-200">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-xl font-bold my-3">{children}</h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-lg font-bold my-2">{children}</h3>
                ),
                p: ({ children }) => (
                    <p className="my-2 leading-relaxed">{children}</p>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {children}
                    </a>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-slate-300 pl-4 my-2 italic text-slate-500 bg-slate-50 py-1 pr-2 rounded-r">
                        {children}
                    </blockquote>
                ),
                table: ({ children }) => (
                    <div className="overflow-x-auto my-4 border border-slate-200 rounded-lg">
                        <table className="min-w-full divide-y divide-slate-200">
                            {children}
                        </table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-slate-50">{children}</thead>
                ),
                th: ({ children }) => (
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {children}
                    </th>
                ),
                tbody: ({ children }) => (
                    <tbody className="bg-white divide-y divide-slate-200">
                        {children}
                    </tbody>
                ),
                tr: ({ children }) => <tr>{children}</tr>,
                td: ({ children }) => (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                        {children}
                    </td>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};
