import './Gauge.css'

function DustbinGauge({ level }) {
  // level: 0-100, needle rotation: 0% = -90deg (left), 100% = 90deg (right)
  const needleRotation = -90 + (level / 100) * 180

  return (
    <div className="gauge-container dustbin-gauge">
      <h3>Dustbin Fill Level</h3>
      <div className="gauge-wrapper">
        <svg viewBox="0 0 200 120" className="semi-gauge">
          {/* Semi-circle background */}
          <path
            id="dustbin-track"
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Filled portion - semicircle ~251 circumference */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={251 - (level / 100) * 251}
          />
          {/* Segment lines: 20%, 40%, 60%, 80% */}
          {[20, 40, 60, 80].map((p) => {
            const angle = Math.PI * (1 - p / 100)
            const x = 100 + 80 * Math.cos(angle)
            const y = 100 - 80 * Math.sin(angle)
            return (
              <line
                key={p}
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="#94a3b8"
                strokeWidth="1"
              />
            )
          })}
          {/* Needle */}
          <g transform={`translate(100, 100) rotate(${needleRotation})`}>
            <line x1="0" y1="0" x2="0" y2="-70" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="4" fill="#1f2937" />
          </g>
        </svg>
      </div>
      <div className="gauge-labels percent-labels">
        <span>20%</span>
        <span>40%</span>
        <span>60%</span>
        <span>80%</span>
        <span>100%</span>
      </div>
      <p className="gauge-value">
        Dustbin Level: <strong>{level}%</strong>
      </p>
    </div>
  )
}

export default DustbinGauge
