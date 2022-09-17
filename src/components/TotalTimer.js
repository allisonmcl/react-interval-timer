const formatSeconds = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  let hours = Math.floor(time / 3600);
  return (hours ? + ':': '') + 
    (minutes < 10 ? '0' : '') + 
    minutes+':' + (seconds < 10 ? '0' : '') + seconds; 
}

const TotalTimer = (props) => {
  console.log('total Timer Loaded')
  const percentageComplete = props.elapsedTime / props.totalDuration * 100;
  return (
    <div className="mt-10">
      <div className="text-xl text-left">{formatSeconds(props.elapsedTime) +' / '+ formatSeconds(props.totalDuration)}
      <span className="float-right">{Math.floor(percentageComplete)}%</span>
      </div>
      <div className="mt-1 h-3 bg-darkGreen mt-10 mx-auto rounded-md">
        <div className="h-3 bg-white rounded-md transition-width linear duration-300" style={{width: percentageComplete + '%'}}></div>
      </div>
    </div>
  )
}

export default TotalTimer;