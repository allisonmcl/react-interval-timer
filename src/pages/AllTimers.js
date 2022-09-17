import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { timerActions, getTimers } from '../store/timers';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const AllTimers = (props) => {
  console.log('all Timer Loaded')
  const dispatch = useDispatch();

  const removeItem = (e, i) => {
    dispatch(timerActions.remove(i))
  }

  useEffect(() => {
    dispatch(getTimers())
  }, [dispatch]);

  //dispatch(timerActions.getTimersSync())

  const timers =  useSelector(state => state.timers);
  
  return (
    <div className="container mx-auto">
      {timers ? 
      timers.map((timer, index) =>
       <h2 key={timer.id}> 
         <Link to={`/timer/${timer.id}`}>{timer.title}</Link>
        <button onClick={(e) => removeItem(e, index)}>X</button> 
        <button>edit</button>
       </h2>) : <h1>No Timers yet!</h1>
       }
    </div> 
  ) 
}

export default AllTimers;