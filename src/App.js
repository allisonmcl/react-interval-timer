import Timer from './pages/Timer';
import NewTimer from './pages/NewTimer';
import AllTimers from './pages/AllTimers';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import EditTimer from './pages/EditTimer';
function App() {
  return (
    
    <div className="App">
       <nav>
        <Link to="/">All Timers</Link>
        <Link to="/new-timer">New Timer</Link>
      </nav>
      <Routes>
        <Route path="/" element={<AllTimers/>} />
        <Route path="/new-timer" element={<NewTimer />} />
        <Route path="timer/:id" element={<Timer  />} /> 
        <Route path="edit/:id" element={<EditTimer  />} /> 
      </Routes> 
     
    </div>
  );
}

export default App;
