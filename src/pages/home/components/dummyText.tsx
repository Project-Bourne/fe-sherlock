import React, { useEffect, useState } from 'react';
import SummaryPopUp from './summaryPopUp';
import { useDispatch, useSelector } from 'react-redux';

function DummyText() {
  const dispatch = useDispatch();
  const { analyzedText, analysisArray } = useSelector((state: any) => state.analyze);
  const [text, setText] = useState('');
  const [selectedSummary, setSelectedSummary] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    let newText = analyzedText;

    analysisArray.forEach(item => {
      const keyword = item.name;
      const colorCode = item.colorCode;
      const coloredKeyword = `<span class='tags' title='${item.summary}' image='${item.imageUrl}' style=" color: #4582C4;  padding: 0px; text-decoration: underline; font-style: italic; margin: 1px; border-radius: 5px; cursor: pointer;">${keyword}</span>`;
      newText = newText.replace(new RegExp(keyword, 'g'), coloredKeyword);
    });
    // style="background-color: ${colorCode};
    setText(newText);
  }, [analyzedText, analysisArray]);

  const handleClick = (event) => {
    const clickedTag = event.target;
    const summary = clickedTag.getAttribute('title');
    const image = clickedTag.getAttribute('image');
    if (summary) {
      setSelectedSummary(summary);
    }
    if (image) {
      setImage(image);
    }
  };

  const handlePopUpClose = () => {
    setSelectedSummary('');
  };

  return (
    <div className="text-justify px-20 leading-10" onClick={handleClick}>
      <p className="text-md text-gray-500 py-5">Content</p>
      <div dangerouslySetInnerHTML={{ __html: text }} />
      <SummaryPopUp summary={selectedSummary} handleClose={handlePopUpClose} image={image}/>
    </div>
  );
}

export default DummyText;
