import { createSlice } from '@reduxjs/toolkit';

const AnalyzerSlice = createSlice({
  name: 'analyzer',
  initialState: {
    history: null,
    bookmark: [],
    analyzedText: '',
    analyzedTitle: '',
    analysisArray: [],
    analyzedUuid: '',
    assessment: ''
  },

  reducers: {
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setBookmark: (state) => {
      // console.log('State: ', state?.bookmark);
      state.bookmark = state?.history?.summary?.filter(el => el.bookmark) || [];
    },
    setTextandTitle:(state, action) => {
      state.analyzedText = action.payload.text;
      state.analyzedTitle = action.payload.title;
    },
    setTextAnalysis: (state, action) => {
      state.analyzedText = action.payload.text;
      state.analysisArray = action.payload.analysisArray;
      state.analyzedTitle = action.payload.title;
      state.analyzedUuid = action.payload.uuid;
    },
    setAssessment: (state, action) => {
      state.assessment = action.payload;
    },
    updatePagination: (state, action) => {
      state.history = {
        ...state.history,
        ...action.payload,
      };
    },
  }
});

export const {
  setHistory,
  setAssessment,
  setTextAnalysis,
  setBookmark,
  setInputText,
  setTextandTitle, updatePagination
} = AnalyzerSlice.actions;

export default AnalyzerSlice.reducer;
