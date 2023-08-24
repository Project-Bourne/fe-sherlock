import React, { useEffect } from 'react';
import BookmarkContent from './BookmarkContent';
import { useDispatch, useSelector } from 'react-redux';
import { setBookmark } from '@/redux/reducer/analyzerSlice';

function Bookmark() {
  const { history } = useSelector((state:any) => state?.analyze)
  const dispatch = useDispatch();
   
  useEffect(() => {
    dispatch(setBookmark(history));
  }, [history]);


  return (
    <div className="h-[100%] w-[100%]">
      <BookmarkContent />
    </div>
  );
}

export default Bookmark;