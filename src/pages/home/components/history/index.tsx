import React, { useState } from 'react';
import Content from '../Content';
import dummy from '../../../../utils/dummy.json';

function HomeHistory() {
  const [historyData, setHistoryData] = useState(dummy);

  const handleCheck = (id) => {
    const updatedData = historyData.map((item) =>
      item.id === id ? { ...item, isMarked: !item.isMarked } : item
    );
    setHistoryData(updatedData);
  };

  const filterData = (data) => {
    return data.filter((item) => !item.isMarked);
  };

  const filteredData = filterData(historyData);

  return (
    <div>
      <Content data={filteredData} onCheck={handleCheck} />
    </div>
  );
}

export default HomeHistory;
