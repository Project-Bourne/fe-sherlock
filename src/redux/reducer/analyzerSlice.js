import { createSlice } from '@reduxjs/toolkit';

const AnalyzerSlice = createSlice({
  name: 'analyzer',
  initialState: {
    history: [],
    bookmark: [],
    analyzedText: '',
    analyzedTitle: '',
    analysisArray: [],
  },

  reducers: {
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setBookmark: (state) => {
      state.bookmark = state.history.filter(el => el.bookmark);
    },
    setTextandTitle:(state, action) => {
      state.analyzedText = action.payload.text;
      state.analyzedTitle = action.payload.title;
    },
    setTextAnalysis: (state, action) => {
      state.analyzedText = action.payload.text;
      state.analysisArray = action.payload.analysisArray;
      state.analyzedTitle = action.payload.title;
    },
  }
});

export const {
  setHistory,
  setTextAnalysis,
  setBookmark,
  setInputText,
  setTextandTitle
} = AnalyzerSlice.actions;

export default AnalyzerSlice.reducer;
