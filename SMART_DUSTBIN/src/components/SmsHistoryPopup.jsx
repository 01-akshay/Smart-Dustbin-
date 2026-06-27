import './SmsHistoryPopup.css'

function SmsHistoryPopup({ isOpen, onClose, history }) {
  if (!isOpen) return null

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>SMS History</h2>
          <button className="popup-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="popup-body">
          {history.length === 0 ? (
            <p className="no-history">No SMS has been sent yet.</p>
          ) : (
            <ul className="sms-list">
              {history.map((item, index) => {
                let label = '🗑️ Dustbin Full'
                if (item.type === 'gas') {
                  label = '🫧 Gas Alert'
                } else if (item.type === 'dustbin_clean' || item.type === 'gas_clean') {
                  label = '✅ Cleaned'
                }
                return (
                  <li key={index} className={`sms-item ${item.type}`}>
                    <span className="sms-type">{label}</span>
                    <span className="sms-message">{item.message}</span>
                    <span className="sms-time">{item.time}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default SmsHistoryPopup
