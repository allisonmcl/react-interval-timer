import { useRef, useState, useEffect, useCallback, useMemo }  from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { timerActions, getTimers } from '../store/timers';
import { useDispatch, useSelector } from 'react-redux';

const formatSeconds = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  let hours = Math.floor(time / 3600);
  return (hours ? + ':': '') + 
    (minutes < 10 ? '0' : '') + 
    minutes+':' + (seconds < 10 ? '0' : '') + seconds; 
}

const EditTimer = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [nameValue, setNameValue] = useState('');
  const [activeValue, setActiveValue] = useState('');
  const [restValue, setRestValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');

  const nameInputRef = useRef();
  const activeInputRef = useRef();
  const restInputRef = useRef();
  const totalIntervalsInputRef = useRef();
  // const setsInputRef = useRef();
  const exerciseTitleRef = useRef();

  const navigate = useNavigate();

  const newTimerId = Math.floor(Math.random() * 400 );

  const [preview, setPreview] = useState([])
  const [totalDuration, setTotalDuration] = useState(0)
  const [exerciseInputRows, setExerciseInputRows] = useState(2);
  const [exerciseInputMethod, setExerciseInputMethod] = useState('automatic')



  useEffect(() => {
    dispatch(getTimers())
  }, [dispatch]);

  const timers =  useSelector(state => state.timers);

  var currTimer = timers.find(timer => {
    return timer.id === parseInt(id)
  });
  const loaded = useSelector(state => state.loaded);


  useMemo(() => {
    if (loaded) {
      setNameValue(currTimer.title);
      setActiveValue(currTimer.intervals[0].time);
      setRestValue(currTimer.intervals[1].time);
      setExerciseInputMethod('manual');

      const exerciseTextareaArr =  currTimer.intervals.reduce((acc, item) => {
        if (item.title !== 'rest') {
          acc.push(item.title)
        }

        return acc;
      }, []);
      const exerciseTextareaValue = exerciseTextareaArr.join('\n');
      setExerciseInputRows(exerciseTextareaArr.length);
      setTextAreaValue(exerciseTextareaValue);

    }
  }, [setNameValue, nameValue, loaded]);



  const createTimerHandler = (e) => {
    e.preventDefault();
    dispatch(timerActions.add({
      title: nameInputRef.current.value, 
      intervals: preview,
      id: newTimerId,
      type: exerciseInputMethod
    }));
    navigate(`/timer/${newTimerId}`);
  }

  const updatePreviewHandler = useCallback(() => {
    const intervals = [];
    if (exerciseInputMethod === 'automatic') {
      for (let i = 0; i < totalIntervalsInputRef.current.value; i++) {
        // Needs a unique id or re-render of the preview doesn't trigger
        if (i === totalIntervalsInputRef.current.value - 1) {
          intervals.push({
            title: 'active', 
            id: Math.random() * 300, 
            time: parseInt(activeInputRef.current.value)
          })
        } else {
          intervals.push({
            title: 'active', 
            id: Math.random() * 300, 
            time: parseInt(activeInputRef.current.value)
          })
          intervals.push({
            title: 'rest',
            id: Math.random() * 300, 
            time: parseInt(restInputRef.current.value)
          })
        }
      } 
    } else {
      const exerciseTitlesArray = exerciseTitleRef.current.value.split('\n');
      for (let i = 0; i < exerciseTitlesArray.length; i++) {
        // Needs a unique id or re-render of the preview doesn't trigger
        if (i === exerciseTitlesArray.length - 1) {
          intervals.push({
            title: exerciseTitlesArray[i], 
            id: Math.random() * 300,
            time: parseInt(activeInputRef.current.value)
          })
        } else {
          intervals.push({
            title: exerciseTitlesArray[i], 
            id: Math.random() * 300, 
            time: parseInt(activeInputRef.current.value)
          })
          intervals.push({
            title: 'rest', 
            id: Math.random() * 300, 
            time: parseInt(restInputRef.current.value)
          })
        }
      } 
    }
    const totalDuration = intervals.reduce((prev, curr) => {
      return prev + curr.time; 
    }, 0);
    setTotalDuration(totalDuration);
    setPreview(intervals);
  }, [exerciseInputMethod])

  const addRow = (e) => {
    if (e.key === 'Enter') {
      setExerciseInputRows(prevState => {
        return prevState + 1;
      });
      updatePreviewTrigger();
    }
  }


  const removeInterval = (index) => {
    setPreview((prevState => {
      const newArr = prevState.filter((a, i) => i !== index);
      return newArr;
    }))
  }

  const updateTimeHandler = (e, i) => {
    const newState = [...preview];
    newState[i].time = parseInt(e.target.value);
    setPreview(newState)
  }

  const updatePreviewTrigger = () => {
    updatePreviewHandler();
  }

  useEffect(() => {
    updatePreviewHandler()
  }, [updatePreviewHandler])
  console.log('preview', totalDuration);
  return (
    <div className="">
      <div className="new-timer md:flex gap-10">
        
        <form className='bg-white text-black md:w-2/3 p-10' onSubmit={createTimerHandler}>
          <h1 className="text-5xl my-5 font-bold">New Timer</h1>
          <div className="bg-transparentGreen rounded-md p-4 mb-8">
    
            <div className="mb-5">
              <label className="block mb-1 font-semibold" htmlFor="active">Timer Name</label>
              <input defaultValue={nameValue} required className="py-1 px-2 w-40 text-black inline-block align-bottom" ref={nameInputRef} type="text" id="name" />
            </div>
           
          </div>
          <div className="bg-transparentGreen rounded-md p-4 mb-8">
            <h2 className="text-2xl font-bold">Set Timer durations</h2> 
            <p className="text-sm mb-3 italic">This will add a timer for each exercise that lasts as long as the active interval, and adds a rest timer after each active timer. These durations can be manually edited and deleted in the "Timer preview" panel.</p>
            <div className="mb-5">
              <label className="block mb-1 font-semibold" htmlFor="active">Active Interval</label>
              <input defaultValue={activeValue} className="py-1 px-2 w-16 text-black inline-block align-bottom" onChange={updatePreviewHandler} ref={activeInputRef} type="number" id="active" /> seconds
            </div>
            <div className="mb-5">
              <label className="block mb-1 font-semibold" htmlFor="rest">Rest Interval</label>
              <input  defaultValue={restValue}  className="p-1 px-2 w-16 text-black inline-block align-bottom" onChange={updatePreviewHandler} ref={restInputRef} type="number" id="rest"/> seconds
            </div>
          </div>
          <div className="flex bg-transparentGreen rounded-md p-4 mb-8">

            <div>
              <input type="radio" onChange={() => {setExerciseInputMethod('automatic') }} name="exerciseSelection" value="automatically" id="excerise-automatically" checked={exerciseInputMethod === 'automatic'}/><label htmlFor="excerise-automatically">Enter an amount of non-specified exercises</label>
              <div className={exerciseInputMethod === 'manual' ? 'disabled opacity-30' : ''}>
                <div className="mb-5">
                  <label className="block mb-1 font-semibold" htmlFor="exercises"># of Active Intervals</label>
                  <input disabled={exerciseInputMethod === 'manual'} className="p-1 px-2 w-16 text-black inline-block align-bottom" ref={totalIntervalsInputRef} onChange={updatePreviewTrigger}  type="number" id="exercises" defaultValue="10"/>
                </div>
              </div>
            </div>
            <div>
              <input type="radio" onChange={() => {setExerciseInputMethod('manual');}} name="exerciseSelection" value="manually" id="excerise-manually" checked={exerciseInputMethod !== 'automatic'} /><label htmlFor="excerise-manually">Enter Each Exercise Manually</label>
              <div className={exerciseInputMethod === 'automatic' ? 'disabled opacity-30' : ''}>
                <label className="block mb-1 font-semibold" htmlFor="title">Add Exercises</label>
                <p>Add each exercise on it's own line, with a line break between each title</p>
                {/* <div className="mb-5">
                  <label className="block mb-1 font-semibold" htmlFor="sets">Sets per Exercise</label>
                  <input disabled={exerciseInputMethod === 'manual'} className="p-1 px-2 w-16 text-black inline-block align-bottom" onBlur={updatePreviewHandler} ref={setsInputRef} type="number" id="sets" defaultValue="2"/>
                </div> */}
                <textarea onKeyDown={addRow} disabled={exerciseInputMethod === 'automatic'} className="bg-lines bg-sizelines leading-8 mt-4 px-2 text-black" onBlur={updatePreviewHandler} cols="30" rows={exerciseInputRows} ref={exerciseTitleRef} defaultValue={textAreaValue}>
                </textarea>
              </div>
            </div>
          </div>
          <input className="rounded-md px-5 py-3 bg-darkGreen white font-bold" type="submit" value="submit" />
        </form>
        <div className="p-10">
          <h2 className="text-4xl font-bold mb-5">Interval Timer Preview </h2>
          { formatSeconds(totalDuration) }
          <div className="max-h-96 shadow-inner overflow-auto"> 
          { preview && 
            preview.map((a, i) => 
                // Needs a unique id instead of index or re-render of the preview doesn't trigger
                <div className="mb-4 bg-transparentGreen flex place-content-between items-center rounded-md p-4" key={a.id}>
                  <span>{a.title} </span>
                  <span>
                    <input
                      aria-label="set custom time"
                      onChange={(e) => {updateTimeHandler(e, i)}}
                      type="number"
                      className="ml-auto p-1 px-2 w-20 ml-2 mr-1 "
                      defaultValue={a.time}/>seconds <button onClick={() => {removeInterval(i)}}>X</button>
                  </span>
                </div>) }
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTimer;