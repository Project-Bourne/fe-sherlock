const useTruncate = (text: string, breakAt: number) => {
  if (text.length > breakAt) {
    const truncatedText = text?.substr(0, breakAt) + "...";
    return truncatedText;
  } else {
    return text;
  }
};

export default useTruncate;
