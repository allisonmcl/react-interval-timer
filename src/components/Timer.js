import { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import TotalTimer from './TotalTimer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import Button from './UI/Button'; 
const Timer = (props) => {
  let audio = new Audio('/beep-sound-8333.mp3');
  const intervals = props.intervals;
  const totalDuration = intervals.reduce((acc, a) => {
    return acc + a.time
  }, 0)

  const [timerState, setTimerState] = useState({
    currInterval: 0,
    paused: true,
    totalElapsedTime: 0,
  });
  
  const [timer, setTimer] = useState(null);

  const jumpToDuration = (currInterval) => {
    const newTotalElapsedTime = intervals
      .slice(0,currInterval)
      .reduce((prev, curr) => {
        return prev + curr.time; 
      }, 0);
    return newTotalElapsedTime;
  }

  const totalTimerStart = () => {
    setTimer(setInterval(function() {
    
      setTimerState((prevState => {
        if (!prevState.paused) {
          return {
            ...prevState,
            totalElapsedTime: prevState.totalElapsedTime + 1
          }
        }
      }));
    }, 1000));
  }

  useEffect(() => {
    if (timerState.cleared || timerState.paused) {
      clearInterval(timer);
    }
  }, [timerState.cleared, timerState.paused])

  const timerStart = () => {
    totalTimerStart();
    setTimerState({
      ...timerState,
      paused: false
    })
  }

  const timerPause = () => {
    setTimerState({
      ...timerState,
      paused: true
    })
  }

  const nextInt = () => {
    setTimerState(prevState => {
      return {
        ...prevState,
        currInterval: prevState.currInterval + 1,
        totalElapsedTime: jumpToDuration(prevState.currInterval + 1)
      }
    })
  }

  const prevInt = () => {
    setTimerState(prevState => {
      return {
        ...prevState,
        currInterval: prevState.currInterval - 1,
        totalElapsedTime: jumpToDuration(prevState.currInterval - 1)
      }
    })
  }
  const isFirstInt = timerState.currInterval === 0;
  const title = intervals[timerState.currInterval].title;
  const isLastActive = timerState.currInterval === intervals.length - 1 || false;
  const isRunning = timer != null && !timerState.paused;
  const duration = intervals[timerState.currInterval].time;
  return (
    
    <div className="timer container text-center text-3xl m-auto my-20">
      <h1 className="font-bold text-6xl mb-10">{title}</h1>
      <div className="circle flex items-center mx-auto place-content-around my-5 max-w-sm">
        <Button attributes={{disabled: isFirstInt , onClick: prevInt} }><FontAwesomeIcon size="2xs" icon={solid('backward')} /></Button>

        <CountdownCircleTimer
          isPlaying={!timerState.paused}
          duration={duration}
          key={timerState.currInterval}
          trailColor={'rgba(0,59,44, 0.3)'}
          colors={['#FFF']}
          onComplete={() => {
            audio.play();
            if (timerState.currInterval < intervals.length - 1 ) {
              nextInt();
              return {shouldRepeat: true}
            } else {
              timerPause();
            }
      
          }}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
        <Button 
          attributes={{disabled: isLastActive , onClick: nextInt} }>
            <FontAwesomeIcon 
            size="2xs" 
            icon={solid('forward')} />
        </Button>
      </div>

      <Button 
        attributes={{hidden: isRunning , onClick: timerStart} }>
          <FontAwesomeIcon 
          size="2xs" 
          icon={solid('play')} /></Button>
      <Button 
        attributes={{hidden: !isRunning , onClick: timerPause} }>
          <FontAwesomeIcon 
          size="2xs" 
          icon={solid('pause')} />
        </Button>

      <TotalTimer elapsedTime={timerState.totalElapsedTime} totalDuration={totalDuration} />
    </div>
  );
}

export default Timer;