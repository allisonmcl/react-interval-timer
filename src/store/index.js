import { configureStore } from '@reduxjs/toolkit';
import  timerReducer  from './timers';

const store = configureStore({
  reducer: timerReducer
});

export default store;