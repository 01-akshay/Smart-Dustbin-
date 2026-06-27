import './Gauge.css'

function GasGauge({ level }) {
  // level: 0-100, maps to Normal (0-33), Mid (34-66), Dangerous (67-100)
  // Needle rotation: 0% = -90deg (left), 100% = 90deg (right)
  const needleRotation = -90 + (level / 100) * 180
  const getLevelLabel = () => {
    if (level <= 33) return 'Normal Level'
    if (level <= 66) return 'Mid Level'
    return 'Dangerous Level'
  }

  return (
    <div className="gauge-container gas-gauge">
      <h3>Gas Sensor</h3>
      <div className="gauge-wrapper">
        <svg viewBox="0 0 200 120" className="semi-gauge">
          {/* Semi-circle background */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored segments - Normal (green), Mid (yellow), Dangerous (red) */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 31"
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 60 31 A 80 80 0 0 1 140 31"
            fill="none"
            stroke="#eab308"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 140 31 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Needle */}
          <g transform={`translate(100, 100) rotate(${needleRotation})`}>
            <line x1="0" y1="0" x2="0" y2="-70" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="4" fill="#1f2937" />
          </g>
        </svg>
      </div>
      <div className="gauge-labels">
        <span>Normal Level</span>
        <span>Mid Level</span>
        <span>Dangerous Level</span>
      </div>
      <p className="gauge-value">
        Gas Warning: <strong>{getLevelLabel()}</strong> ({level}%)
      </p>
    </div>
  )
}

export default GasGauge
