import { useState, useEffect } from 'react'
import './Clock.css'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const hoursDeg = (hours % 12) * 30 + minutes * 0.5
  const minutesDeg = minutes * 6 + seconds * 0.1
  const secondsDeg = seconds * 6

  return (
    <div className="clock-container">
      <h3>Time</h3>
      <div className="clock-face">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="clock-marker"
            style={{ transform: `rotate(${i * 30}deg) translateY(-45px)` }}
          >
            {i || 12}
          </div>
        ))}
        <div
          className="clock-hand hours"
          style={{ transform: `rotate(${hoursDeg}deg)` }}
        />
        <div
          className="clock-hand minutes"
          style={{ transform: `rotate(${minutesDeg}deg)` }}
        />
        <div
          className="clock-hand seconds"
          style={{ transform: `rotate(${secondsDeg}deg)` }}
        />
        <div className="clock-center" />
      </div>
      <p className="clock-digital">
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </p>
    </div>
  )
}

export default Clock
