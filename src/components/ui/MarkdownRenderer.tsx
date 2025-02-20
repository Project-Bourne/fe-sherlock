import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
/**
 * Props interface for the MarkdownRenderer component
 * @interface MarkdownRendererProps
 * @property {string} content - The markdown content to render
 * @property {string} [className] - Optional CSS class name for styling
 */
interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * A reusable component for rendering markdown content
 * @component
 * @param {MarkdownRendererProps} props - The component props
 * @returns {JSX.Element} Rendered markdown content
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    p: ({ children }) => (
                        <p className="mb-4">{children}</p>
                    ),
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-bold mb-4">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-bold mb-4">{children}</h3>
                    ),
                    
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer; 