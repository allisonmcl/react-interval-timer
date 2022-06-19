import Timer from './components/Timer';
import NewTimer from './components/NewTimer';
import {useState} from 'react';
import './App.css';
function App() {
  const [intervals, setIntervals] = useState([
    {
      time: 4,
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
  ]);

  const setIntervalsHandler = (arr) => {
    setIntervals(arr)
  }
  return (
    
    <div className="App">
      <NewTimer setIntervals={setIntervalsHandler} />
      {/* <Timer intervals={intervals}/> */}
    </div>
  );
}

export default App;
