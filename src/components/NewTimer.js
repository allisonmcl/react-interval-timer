import { useRef, useState, useEffect }  from 'react';

const NewTimer = (props) => {
  const activeInputRef = useRef();
  const restInputRef = useRef();
  const exercisesInputRef = useRef();
  const setsInputRef = useRef();
  const exerciseTitleRef = useRef();

  const [preview, setPreview] = useState([])

  const createTimerHandler = (e) => {
    e.preventDefault();
    props.setIntervals(preview);
  }

  const updatePreviewHandler = () => {
    const intervals = [];
    const exerciseTitlesArray = exerciseTitleRef.current.value.split('\n');
    for (let i = 0; i < exercisesInputRef.current.value; i++) {
      for (let j = 0; j < setsInputRef.current.value; j++) {
        intervals.push({title: exerciseTitlesArray[i], time: parseInt(activeInputRef.current.value)})
        intervals.push({title: 'rest', time: parseInt(restInputRef.current.value)})
      }
    } 
    setPreview(intervals)
  }

  const removeInterval = (index) => {
    setPreview((prevState => {
      const newArr = prevState.filter((a, i) => i != index);
      return newArr;
    }))
  }

  const updateTimeHandler = (e, i) => {
    const newState = [...preview];
    newState[i].time = parseInt(e.target.value);
    setPreview(newState)
  }

  useEffect(() => {
    updatePreviewHandler()
  }, [])
  return (
    <div className="new-timer" style={{ display: "flex" }}>
      <form onSubmit={createTimerHandler}>
        <label htmlFor="active">Active Interval</label>
        <input onBlur={updatePreviewHandler} ref={activeInputRef} type="number" id="active" defaultValue="40"/>
        <label htmlFor="rest">Rest Interval</label>
        <input onBlur={updatePreviewHandler} ref={restInputRef} type="number" id="rest" defaultValue="20"/>
        <hr />
        <label htmlFor="exercises"># of Exercises</label>
        <input onBlur={updatePreviewHandler} ref={exercisesInputRef} type="number" id="exercises" defaultValue="10"/>
        <label htmlFor="sets">Sets per Exercise</label>
        <input onBlur={updatePreviewHandler} ref={setsInputRef} type="number" id="sets" defaultValue="2"/>
        <input type="submit" value="submit" />
        <hr />
        <label htmlFor="title">Add Exercises</label>
        <p>Add each excerise on it's own line, with a line break between each title</p>
        <textarea onBlur={updatePreviewHandler} defaultValue="Squats&#10;Push Ups&#10;Pull Ups" cols="50" rows="20" ref={exerciseTitleRef}>
      
        </textarea>
      </form>
      <div>
        <h2>Interval Timer Preview</h2>
        <div>
  { preview && 
    preview.map((a, i) => 
      <div key={i}>{a.title} 
        <input 
          aria-label="set custom time" 
          onChange={(e) => {updateTimeHandler(e, i)}} 
          type="number" 
          style={{width: '30px'}} 
          defaultValue={a.time}/>{a.time}s <button onClick={() => {removeInterval(i)}}>X</button></div>) }
        </div>
      </div>
    </div>
  );
}

export default NewTimer;