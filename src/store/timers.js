import { createSlice, current, createAsyncThunk } from '@reduxjs/toolkit';
import localforage from 'localforage';

localforage.setDriver(localforage.LOCALSTORAGE);

const getTotalElapsedTime = (currInterval, intervals) => {
  return intervals.slice(0, currInterval)
    .reduce((prev, curr) => {
      return prev + curr.time; 
  }, 0);
}

const getCurrTimer = (timers, id) => {
  return timers.findIndex(timer => timer.id === parseInt(id))
}

const defaultTimerValues = {
  currInterval: 0,
  paused: true,
  totalElapsedTime: -1, 
}


export const getTimers = createAsyncThunk(
  'timers/getTimers',
  async () => {
    const response = await localforage.getItem('timers');
    console.log(response)
    return response;
  }
)


const defaultTimerState = {
  timers: [
    {
      ...defaultTimerValues,
      title: 'Interval 1',
      totalDuration: 21,
      id: 0,    
      intervals: [
        {
          time: 10,
          title: 'Squats'
        },
        {
          time: 5,
          title: 'Squats 2'
        },
        {
          time: 6,
          title: 'Squats 3'
        }
      ]
    }
  ],
  loaded: false,

};

const timerSlice = createSlice({
  name: 'timers',
  initialState: defaultTimerState,
  reducers: {
    add(state, action) {
      const totalDuration = action.payload.intervals.reduce((acc, a) => {
        return acc + a.time
      }, 0)
      state.timers.push({
        ...defaultTimerValues,
        title: action.payload.title, 
        id: action.payload.id,
        intervals: action.payload.intervals,
        totalDuration
      });

      localforage.setItem('timers', current(state.timers))
    },
    edit(state,action) {
      const timerIndex = getCurrTimer(current(state.timers), action.payload.id);
      const totalDuration = action.payload.intervals.reduce((acc, a) => {
        return acc + a.time
      }, 0);
      state.timers[timerIndex] = {
        ...defaultTimerValues,
        title: action.payload.title, 
        id: action.payload.id,
        intervals: action.payload.intervals,
        totalDuration
      };

      localforage.setItem('timers', current(state.timers))
    },
    remove(state, action) {
      state.timers.splice(action.payload, 1);
      localforage.setItem('timers', current(state.timers))
    },
    start(state, action) {
      const timerIndex = getCurrTimer(state.timers, action.payload)
      state.timers[timerIndex].paused = false;
    },
    pause(state, action) {
      const timerIndex = getCurrTimer(state.timers, action.payload)
      state.timers[timerIndex].paused = true;
    },
    goToNextInt(state, action) {
      const timerIndex = getCurrTimer(current(state.timers), action.payload);
      state.timers[timerIndex].currInterval = state.timers[timerIndex].currInterval + 1;
      const intervals = current( state.timers[timerIndex].intervals);
      const newTotalElapsedTime = getTotalElapsedTime(  state.timers[timerIndex].currInterval, intervals)

      // Update method gets an additional call here since the timer changes
      // causing a double increment to the total duration.
      state.timers[timerIndex].totalElapsedTime = newTotalElapsedTime - 1;
     
    },
    goToPrevInt(state, action) {
      const timerIndex = getCurrTimer(current(state.timers), action.payload);
      state.timers[timerIndex].currInterval =  state.timers[timerIndex].currInterval - 1;
      const intervals = current( state.timers[timerIndex].intervals);
      const newTotalElapsedTime = getTotalElapsedTime( state.timers[timerIndex].currInterval, intervals)

      // Update method gets an additional call here since the timer changes
      // causing a double increment to the total duration.
      state.timers[timerIndex].totalElapsedTime = newTotalElapsedTime - 1;
    },
    setTotalElapsedTime(state, action) {
      const timerIndex = getCurrTimer(current(state.timers), action.payload.index);
      if (action.payload.amount === '+1') {
        state.timers[timerIndex].totalElapsedTime = state.timers[timerIndex].totalElapsedTime + 1
      } else {
        state.timers[timerIndex].totalElapsedTime = action.payload.amount
      }
    }
  },
  extraReducers: {
    [getTimers.fulfilled]: (state, { payload }) => {
      if (payload) {
        state.timers = payload
      }
      state.loaded = true
    },
  }
});

export const timerActions = timerSlice.actions;
export default timerSlice.reducer;