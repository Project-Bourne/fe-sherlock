import React, { useEffect, useState } from 'react';
import HistroyContent from './HistoryContent';
import { useDispatch } from 'react-redux';
import {fetchData} from '@/hooks/FetchHistory'


function Histroy() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch]);

  return (
    <div className="h-[100%] w-[100%]">
      <HistroyContent  />
    </div>
  );
}

export default Histroy;