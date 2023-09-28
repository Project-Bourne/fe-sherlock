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

      const coloredKeyword = `<span class='tags' style=" color: #4582C4; padding: 0px; text-decoration: underline; font-style: italic; margin: 1px; border-radius: 5px; cursor: pointer;">${keyword || ""}</span>`;

      // Replace occurrences of the keyword with the colored keyword
      newText = newText.replace(new RegExp(keyword, 'g'), coloredKeyword);
    });

    setText(newText);
  }, [analyzedText, analysisArray]);

  const handleKeywordClick = (keyword) => {
    const summary = analysisArray.find(item => item.name === keyword)?.summary || "No Summary Available";
    const imageUrl = analysisArray.find(item => item.name === keyword)?.imageUrl || "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
  
    setSelectedSummary(summary);
    setImage(imageUrl); // Set the image URL
    console.log(imageUrl); // Log imageUrl to the console to verify it's correct
  };

  const handlePopUpClose = () => {
    setSelectedSummary('');
  };

  return (
    <div className="text-justify px-20 leading-10">
      <p className="text-md text-gray-500 py-5">Content</p>
      <div dangerouslySetInnerHTML={{ __html: text }} onClick={(e) => {
        if (e.target instanceof HTMLElement && e.target.classList.contains('tags')) {
          const keyword = e.target.innerText;
          handleKeywordClick(keyword);
        }
      }} />
      <SummaryPopUp summary={selectedSummary} handleClose={handlePopUpClose} image={image} />
    </div>
  );
}

export default DummyText;
