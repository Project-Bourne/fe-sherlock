import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SummaryPopUp from '../../pages/home/components/summaryPopUp';

interface AnalysisItem {
    name: string;
    summary?: string;
}

/**
 * Props interface for the MarkdownRenderer component
 * @interface MarkdownRendererProps
 * @property {string} content - The markdown content to render
 * @property {string} [className] - Optional CSS class name for styling
 * @property {AnalysisItem[]} [analysisArray] - Array of analysis items with summaries
 */
interface MarkdownRendererProps {
    content: string;
    className?: string;
    analysisArray?: AnalysisItem[];
}

/**
 * A reusable component for rendering markdown content
 * @component
 * @param {MarkdownRendererProps} props - The component props
 * @returns {JSX.Element} Rendered markdown content
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '', analysisArray = [] }) => {
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState('');

    const handleClose = () => {
        setSummary('');
        setImage('');
    };

    const handleSpanClick = (text: string) => {
        // Find the matching analysis item and use its summary
        const analysisItem = analysisArray.find(item => item.name === text);
        if (analysisItem?.summary) {
            setSummary(analysisItem.summary);
        } else {
            setSummary(text); // Fallback to the text itself if no summary found
        }
        setImage('/icons/no_history.svg');
    };

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
                    h4: ({ children }) => (
                        <h4 className="text-lg font-bold mb-4">{children}</h4>
                    ),
                    h5: ({ children }) => (
                        <h5 className="text-base font-bold mb-4">{children}</h5>
                    ),
                    h6: ({ children }) => (
                        <h6 className="text-sm font-bold mb-4">{children}</h6>
                    ),
                    table: ({ children }) => (
                        <table className="w-full border-collapse border border-gray-300">
                            {children}
                        </table>
                    ),
                    em: ({ children }) => {
                        const text = children?.toString() || '';
                        const analysisItem = analysisArray.find(item => item.name === text);
                        return (
                            <span 
                                className={`tags cursor-pointer ${analysisItem ? 'text-sirp-primary underline font-bold hover:text-cyan-700' : 'text-gray-500'}`}
                                onClick={() => handleSpanClick(text)}
                                title={analysisItem ? "Click to view summary" : "No summary available"}
                            >
                                {children}
                            </span>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
            <SummaryPopUp 
                summary={summary}
                handleClose={handleClose}
            />
        </div>
    );
};

export default MarkdownRenderer; 