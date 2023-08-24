import React, { useEffect, useState } from 'react';
import SummaryPopUp from './summaryPopUp';
import { useDispatch, useSelector } from 'react-redux';

function DummyText() {
  const dispatch = useDispatch();
  const { analyzedText, analysisArray } = useSelector((state: any) => state.analyze);
  const [text, setText] = useState('');
  const [selectedSummary, setSelectedSummary] = useState('');

  useEffect(() => {
    let newText = analyzedText;

    analysisArray.forEach(item => {
      const keyword = item.name;
      const colorCode = item.colorCode;
      const coloredKeyword = `<span class='tags' title='${item.summary}' style="background-color: ${colorCode}; padding: 5px; margin: 5px; border-radius: 5px; color: white; cursor: pointer;">${keyword}</span>`;
      newText = newText.replace(new RegExp(keyword, 'g'), coloredKeyword);
    });

    setText(newText);
  }, [analyzedText, analysisArray]);

  const handleClick = (event) => {
    const clickedTag = event.target;
    const summary = clickedTag.getAttribute('title');
    if (summary) {
      setSelectedSummary(summary);
    }
  };

  const handlePopUpClose = () => {
    setSelectedSummary('');
  };

  return (
    <div className="text-justify px-20 leading-10" onClick={handleClick}>
      <p className="text-md text-gray-500 py-5">Content</p>
      <div dangerouslySetInnerHTML={{ __html: text }} />
      <SummaryPopUp summary={selectedSummary} handleClose={handlePopUpClose} />
    </div>
  );
}

export default DummyText;
