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
    
    <div className="timer">
      <h1>{title}</h1>
      <div className="circle">
        <Button attributes={{disabled: isFirstInt , onClick: prevInt} }><FontAwesomeIcon size="lg" icon={solid('backward')} /></Button>

        <CountdownCircleTimer
          isPlaying={!timerState.paused}
          duration={duration}
          key={timerState.currInterval}
          trailColor={'#00A77D'}
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
        <Button attributes={{disabled: isLastActive , onClick: nextInt} }><FontAwesomeIcon icon={solid('forward')} /></Button>
      </div>

      <Button attributes={{disabled: isRunning , onClick: timerStart} }><FontAwesomeIcon icon={solid('play')} /></Button>
      <Button attributes={{disabled: !isRunning , onClick: timerPause} }><FontAwesomeIcon icon={solid('pause')} /></Button>

      <TotalTimer elapsedTime={timerState.totalElapsedTime} totalDuration={totalDuration} />
    </div>
  );
}

export default Timer;