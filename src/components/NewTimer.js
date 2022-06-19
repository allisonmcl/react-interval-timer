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
    <div className="container mx-auto">
      <h1 className="text-5xl my-5 font-bold">New Timer</h1>
      <div className="new-timer flex gap-10">
        <form onSubmit={createTimerHandler}>
          <div className="bg-transparentGreen rounded-md p-4 mb-8">
            <div className="mb-5">
              <label className="block mb-1 font-semibold" htmlFor="active">Active Interval</label>
              <input className="py-1 px-2 w-16 text-black inline-block align-bottom" onBlur={updatePreviewHandler} ref={activeInputRef} type="number" id="active" defaultValue="40"/> seconds
            </div>
            <div className="mb-5">
              <label className="block mb-1 font-semibold" htmlFor="rest">Rest Interval</label>
              <input className="p-1 px-2 w-16 text-black inline-block align-bottom" onBlur={updatePreviewHandler} ref={restInputRef} type="number" id="rest" defaultValue="20"/> seconds
            </div>
          </div>
          <div className="bg-transparentGreen rounded-md p-4 mb-8">
            <div className="mb-5">
              <label className="block mb-1 font-semibold" htmlFor="exercises"># of Exercises</label>
              <input className="p-1 px-2 w-16 text-black inline-block align-bottom" onBlur={updatePreviewHandler} ref={exercisesInputRef} type="number" id="exercises" defaultValue="10"/>
            </div>
            <div className="mb-5">
              <label className="block mb-1 font-semibold" htmlFor="sets">Sets per Exercise</label>
              <input className="p-1 px-2 w-16 text-black inline-block align-bottom" onBlur={updatePreviewHandler} ref={setsInputRef} type="number" id="sets" defaultValue="2"/>
            </div>
            
          </div>
          <div className="bg-transparentGreen rounded-md p-4 mb-8">
            <label className="block mb-1 font-semibold" htmlFor="title">Add Exercises</label>
            <p>Add each exercise on it's own line, with a line break between each title</p>
            <textarea className="mt-4 p-2 text-black" onBlur={updatePreviewHandler} defaultValue="Squats&#10;Push Ups&#10;Pull Ups" cols="30" rows="10" ref={exerciseTitleRef}>
            </textarea>
          </div>
          <input className="px-5 py-2 bg-darkGreen white font-bold" type="submit" value="submit" />
        </form>
        <div>
          <h2 className="text-4xl font-bold mb-5">Interval Timer Preview</h2>
          <div className="max-h-96 shadow-inner overflow-auto">
          { preview && 
            preview.map((a, i) => 
                <div className="mb-4 bg-transparentGreen flex place-content-between items-center rounded-md p-4 mb-8" key={i}>
                  <span>{a.title} </span>
                  <span>
                    <input
                      aria-label="set custom time"
                      onChange={(e) => {updateTimeHandler(e, i)}}
                      type="number"
                      className="ml-auto p-1 px-2 w-20 ml-2 mr-1 text-black"
                      defaultValue={a.time}/>seconds <button onClick={() => {removeInterval(i)}}>X</button>
                  </span>
                </div>) }
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTimer;