const formatSeconds = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  let hours = Math.floor(time / 3600);
  return (hours ? + ':': '') + 
    (minutes < 10 ? '0' : '') + 
    minutes+':' + (seconds < 10 ? '0' : '') + seconds; 
}

const TotalTimer = (props) => {
  const width = props.elapsedTime / props.totalDuration * 100;
  return (
    <div>
      {formatSeconds(props.elapsedTime) +'/'+ formatSeconds(props.totalDuration)}
      <div className="test1">
        <div className="test" style={{width: width + '%'}}></div>
      </div>
    </div>
  )
}

export default TotalTimer;