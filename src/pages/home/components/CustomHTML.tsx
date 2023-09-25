import React from 'react';

interface CustomHTMLProps {
  html: string;
}

const CustomHTML: React.FC<CustomHTMLProps> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default CustomHTML;
