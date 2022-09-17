import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import TotalTimer from '../components/TotalTimer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { useSelector } from 'react-redux';
import { timerActions } from '../store/timers';
import { useDispatch } from 'react-redux';
import { getTimers } from '../store/timers';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Button from '../components/UI/Button'; 

const Timer =  () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const audio = new Audio('/beep-sound-8333.mp3');
  useEffect(() => {
    dispatch(getTimers())
  }, [dispatch]);
  var intervalState =  useSelector(state => state.timers);
  var loaded = useSelector(state => state.loaded);
  if (loaded) {
    var currTimer = intervalState.find(timer => {
      return timer.id === parseInt(id)
    });

    var intervals = currTimer.intervals;
    var currIntervalItem =  intervals[currTimer.currInterval];
    var currIntervalIndex =  currTimer.currInterval;
  }
  
  useEffect(() => {
    if (loaded) {
      const amount = intervals.slice(0, currTimer.currInterval).reduce((prev, curr) => {
        return prev + curr.time; 
      }, 0);
      dispatch(timerActions.setTotalElapsedTime( {index: id, amount}));
    }
    
  }, [location, dispatch, id]);


  const timerStart = () => {
    audio.muted = false;
    audio.play();
    dispatch(timerActions.start(id));
  }

  const timerPause = () => {
    dispatch(timerActions.pause(id));
  }

  const nextInt = () => {
    dispatch(timerActions.goToNextInt(id));
    audio.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    audio.src = '/beep-sound-8333.mp3';
    audio.muted = false;
    audio.play();
  }

  const prevInt = () => {
    dispatch(timerActions.goToPrevInt(id));
  }
  if (loaded) {
    var isFirstInt = currIntervalIndex === 0;
    var title = currIntervalItem.title;
    var isLastActive = currIntervalIndex === intervals.length - 1 || false;
    var isRunning = !currTimer.paused; 
    var duration = currIntervalItem.time;
  }

  return (
     loaded && <div className="timer container text-center text-3xl m-auto my-20">
      <p className="text-xl">Interval: {currIntervalIndex + 1} / {intervals.length}</p>
      <h1 className="font-bold text-5xl mb-10">{title}</h1>
      <div className="circle flex items-center mx-auto place-content-around my-5 max-w-sm">

        <CountdownCircleTimer
          isPlaying={!currTimer.paused}
          strokeWidth="6"
          duration={duration}
          key={currIntervalIndex}
          trailColor={'rgba(0,59,44, 0.3)'}
          colors={['#FFF']}
          onComplete={() => {
            if (currIntervalIndex < intervals.length - 1 ) {
              nextInt();
            } else {
              timerPause();
            }
      
          }}
          onUpdate={() => {
            dispatch(timerActions.setTotalElapsedTime(
              {index: id, amount: '+1'}
            ));
          }}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
        
      </div>
      <Button attributes={{disabled: isFirstInt , onClick: prevInt} }>
        <FontAwesomeIcon size="2xs" icon={solid('backward')} />
        { !isFirstInt && <span className='text-sm align-middle	'>{intervals[currIntervalIndex - 1].title}</span>}
      </Button>
      <Button 
        attributes={{hidden: isRunning , onClick: timerStart} }>
          <FontAwesomeIcon 
          size="2xs" 
          icon={solid('play')} /></Button>
      <Button 
        attributes={{hidden: !isRunning , onClick: timerPause} }>
          <FontAwesomeIcon 
          size="2xs" 
          className="align-middle"
          icon={solid('pause')} />
        </Button>
      <Button 
          attributes={{disabled: isLastActive , onClick: nextInt} }>
            <FontAwesomeIcon 
            size="2xs" 
            icon={solid('forward')} />
          {!isLastActive && 
          <span className='text-sm align-middle	mx-2 -mt-1'>
              {intervals[currIntervalIndex + 1].title}</span>
          }
        </Button>

      <TotalTimer elapsedTime={currTimer.totalElapsedTime} totalDuration={currTimer.totalDuration} /> 
      
    </div>
  );
}

export default Timer;