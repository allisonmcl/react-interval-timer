import { useState, useEffect } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Timer = (props) => {
  let audio = new Audio('/beep-sound-8333.mp3');
  const intervals = props.intervals;
  const totalDuration = intervals.reduce((acc, a) => {
    return acc + a.time
  }, 0)

  const formatSeconds = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    let hours = Math.floor(time / 3600);
    return (hours ? + ':': '') + 
      (minutes < 10 ? '0' : '') + 
      minutes+':' + (seconds < 10 ? '0' : '') + seconds; 
  }

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

  const title = intervals[timerState.currInterval].title;
  const isLastActive = timerState.currInterval === intervals.length - 1 || false;
  const isRunning = timer != null && !timerState.paused;
  const duration = intervals[timerState.currInterval].time;
  const width = timerState.totalElapsedTime / totalDuration * 100;
  return (
    
    <div className="timer">
      <h1>{title}</h1>
      <button disabled={isRunning} onClick={timerStart}>Start</button>
      <button disabled={!isRunning} onClick={timerPause}>Pause</button>
      <button disabled={isLastActive} onClick={nextInt}>Skip to next</button>
      <button onClick={prevInt}>Prev</button>

      <div className="circle">
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
      </div>

      {formatSeconds(timerState.totalElapsedTime) +'/'+ formatSeconds(totalDuration)}
      <div className="test1">
        <div className="test" style={{width: width + '%'}}></div>
      </div>
    </div>
  );
}

export default Timer;