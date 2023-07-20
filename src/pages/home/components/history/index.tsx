import React, { useEffect, useState } from 'react';
import Content from '../Content';
import dummy from '../../../../utils/dummy.json';
import Image from 'next/image';

function HomeHistory() {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    console.log('dummy', dummy)
    setHistoryData(dummy);
  }, []);

  const handleCheck = id => {
    const updatedData = historyData.map(item => {
      if (item.id === id) {
        return {
          ...item
        };
      }
      return item;
    });
    setHistoryData(updatedData);
    
  };

  const filterData = data => {
    return data.filter(item => !item.isMarked);
  };

  const filteredData = filterData(historyData);

  return (
    <div>

      {/* the history tab */}
      <div className='flex pl-[2.5rem] gap-2 border-b-2 border-sirp-primary w-[15rem] py-5'>
      <Image
          src={require("../../../../assets/icons/Histroy.svg")}
          alt="documents"
          className="cursor-pointer"
          width={20}
        />
        <h1 className='text-sirp-primary text-xl'>Histroy</h1>
        
      </div> 
      <hr />

      {/* the history page */}
      <Content data={filteredData} onCheck={handleCheck} />
    </div>
  );
}

export default HomeHistory;
