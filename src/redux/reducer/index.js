import { combineReducers } from "@reduxjs/toolkit";
import AnalyzerSlice from './analyzerSlice';
import TabSlice from './tabSlice'
import authSlice from './authReducer'

const rootReducer = combineReducers({ 
    analyze: AnalyzerSlice,
    tab: TabSlice,
    auth: authSlice
});

export default rootReducer;
