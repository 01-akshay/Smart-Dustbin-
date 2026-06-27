import { useState, useEffect, useRef } from 'react'
import GasGauge from './components/GasGauge'
import DustbinGauge from './components/DustbinGauge'
import Clock from './components/Clock'
import SmsHistoryPopup from './components/SmsHistoryPopup'
import { SMS_CONFIG } from './config'
import './App.css'

// Simulated live data - replace with Arduino/Serial data when connected
const SIMULATE_LIVE = false
const DUSTBIN_SMS_THRESHOLD = 80   // 80%+ hone par auto SMS
const GAS_ALERT_THRESHOLD = 45     // Harmful gas 45%+ hone par auto SMS
const SIM_FAST_MODE = true         // Demo ke liye tez - 65% dustbin, 40% gas pe bhi SMS
const DUSTBIN_CLEAN_THRESHOLD = 5  // kitne % se kam aane par dustbin cleaned mana jayega
const GAS_SAFE_THRESHOLD = 10      // kitne % se kam aane par gas safe mana jayegi
const API_URL = '' // Vite proxy forwards /api to backend

function App() {
  const [dustbinLevel, setDustbinLevel] = useState(70)  // Start higher - faster threshold hit
  const [gasLevel, setGasLevel] = useState(40)
  const [smsHistory, setSmsHistory] = useState([])
  const [showSmsPopup, setShowSmsPopup] = useState(false)
  const [testSmsStatus, setTestSmsStatus] = useState('')
  const lastDustbinAlert = useRef(0)
  const lastGasAlert = useRef(0)
  const lastDustbinClean = useRef(0)
  const lastGasClean = useRef(0)
  const hadDustbinAlert = useRef(false)
  const hadGasAlert = useRef(false)
  const dustbinRef = useRef(70)


  

  // Load SMS history from localStorage on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smsHistory')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setSmsHistory(parsed)
        }
      }
    } catch (e) {
      console.warn('Failed to load SMS history from storage', e)
    }
  }, [])

  useEffect(() => {
    dustbinRef.current = dustbinLevel
  }, [dustbinLevel])

  const sendSmsToNumber = async (type, message, dustbinLevel, gasLevel) => {
    try {
      const res = await fetch(`${API_URL}/api/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message,
          dustbinLevel,
          gasLevel,
          phone: SMS_CONFIG.phoneNumber,
        }),
      })
      const data = await res.json()
      return data
    } catch (err) {
      console.warn('SMS API not reachable - run: npm run server', err)
      return { success: false, error: 'Server not running' }
    }
  }

  const handleTestSms = async () => {
    setTestSmsStatus('Bhej raha hoon...')
    const msg = 'Test: Smart Dustbin working! 9805493783 par SMS aaya?'
    const result = await sendSmsToNumber('test', msg, 0, 0)
    if (result.success) {
      if (result.simulated) {
        setTestSmsStatus('⚠️ Simulated - .env me FAST2SMS_API_KEY set karo')
      } else {
        setTestSmsStatus('✓ SMS bhej diya! Phone check karo')
      }
    } else {
      setTestSmsStatus('✗ Failed - ' + (result.error || 'Server check karo'))
    }
    setTimeout(() => setTestSmsStatus(''), 5000)
  }

  const addSms = (type, message, dustbinVal, gasVal) => {
    const now = new Date()
    const timeStr = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    setSmsHistory((prev) => {
      const nextHistory = [{ type, message, time: timeStr }, ...prev]
      try {
        localStorage.setItem('smsHistory', JSON.stringify(nextHistory))
      } catch (e) {
        console.warn('Failed to save SMS history to storage', e)
      }
      return nextHistory
    })
    // Send real SMS to 9805493783
    sendSmsToNumber(type, message, dustbinVal, gasVal)
  }

  useEffect(() => {
    if (!SIMULATE_LIVE) return
    const interval = setInterval(() => {
      setDustbinLevel((prev) => {
        // Simple, predictable simulation: har step me 10% badhao jab tak 100% na ho
        const step = SIM_FAST_MODE ? 10 : 5
        const next = Math.min(100, prev + step)
        // Dustbin full alert exactly 80%+ par
        const dustbinThreshold = DUSTBIN_SMS_THRESHOLD
        if (next >= dustbinThreshold && Date.now() - lastDustbinAlert.current > 45000) {
          lastDustbinAlert.current = Date.now()
          const rounded = Math.round(next)
          addSms('dustbin', `Your dustbin is ${rounded}% full. Please empty it immediately.`, rounded, null)
          hadDustbinAlert.current = true
        }

        // Agar pehle dustbin full alert gaya tha aur ab dustbin lagbhag khaali (0% ke kareeb) hai,
        // to cleaning complete ka SMS bhejo.
        if (
          hadDustbinAlert.current &&
          next <= DUSTBIN_CLEAN_THRESHOLD &&
          Date.now() - lastDustbinClean.current > 45000
        ) {
          lastDustbinClean.current = Date.now()
          hadDustbinAlert.current = false
          addSms('dustbin_clean', 'The trash has been cleaned.', Math.round(next), null)
        }
        return next
      })
      setGasLevel((prev) => {
        // Simple gas simulation: har step me 8% badhao jab tak 100% na ho
        const step = SIM_FAST_MODE ? 8 : 4
        const next = Math.min(100, prev + step)
        const gasThreshold = SIM_FAST_MODE ? 40 : GAS_ALERT_THRESHOLD
        if (next >= gasThreshold && Date.now() - lastGasAlert.current > 45000) {
          lastGasAlert.current = Date.now()
          const dustVal = Math.round(dustbinRef.current)
          const gasVal = Math.round(next)
          addSms('gas', `ALERT: Harmful gas is forming in the dustbin! Dustbin is ${dustVal}% full, Gas is ${gasVal}%. Please empty it immediately.`, dustVal, gasVal)
          hadGasAlert.current = true
        }

        // Agar pehle gas alert aaya tha aur ab gas level safe ho gaya hai,
        // to cleaning complete ka SMS bhejo.
        if (
          hadGasAlert.current &&
          next <= GAS_SAFE_THRESHOLD &&
          Date.now() - lastGasClean.current > 45000
        ) {
          lastGasClean.current = Date.now()
          hadGasAlert.current = false
          const dustVal = Math.round(dustbinRef.current)
          addSms('gas_clean', 'The trash has been cleaned.', dustVal, Math.round(next))
        }
        return next
      })
    }, 2000)
    

  // LIVE DATA FETCH FROM SERVER
  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const res = await fetch('http://localhost:3001/api/live')

        const data = await res.json()

       if(data.dustbin !== undefined){

  setDustbinLevel(data.dustbin)

  if(
    data.dustbin >= 80 &&
    Date.now() - lastDustbinAlert.current > 30000
  ){

    lastDustbinAlert.current = Date.now()

    addSms(
      "dustbin",
      `Dustbin is ${data.dustbin}% full`,
      data.dustbin,
      data.gas
    )

  }

}


if(data.gas !== undefined){

  setGasLevel(data.gas)

  if(
    data.gas >= 45 &&
    Date.now() - lastGasAlert.current > 30000
  ){

    lastGasAlert.current = Date.now()

    addSms(
      "gas",
      `Gas is ${data.gas}% dangerous`,
      data.dustbin,
      data.gas
    )

  }

}

      } catch(e) {

        console.log("Waiting for Arduino...")

      }

    },1000)

    return () => clearInterval(interval)

  },[])

return () => clearInterval(interval)
  }, [])

  

  // LIVE DATA FETCH FROM SERVER
  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const res = await fetch('http://localhost:3001/api/live')

        const data = await res.json()

        if(data.dustbin !== undefined){

  setDustbinLevel(data.dustbin)

  if(
    data.dustbin >= 80 &&
    Date.now() - lastDustbinAlert.current > 30000
  ){

    lastDustbinAlert.current = Date.now()

    addSms(
      "dustbin",
      `⚠ ALERT: The dustbin is ${data.dustbin}% full and needs attention. Gas level is ${data.gas}%. Please empty the dustbin.`,
      data.dustbin,
      data.gas
    )

  }

}


if(data.gas !== undefined){

  setGasLevel(data.gas)

  if(
    data.gas >= 45 &&
    Date.now() - lastGasAlert.current > 30000
  ){

    lastGasAlert.current = Date.now()

    addSms(
      "gas",
      `⚠ SMART ALERT:
Gas Level: ${data.gas}%
Dustbin Level: ${data.dustbin}%

Harmful gas detected. Please empty the dustbin to ensure safety.`,
      data.dustbin,
      data.gas
    )

  }

}

      } catch(e) {

        console.log("Waiting for Arduino...")

      }

    },1000)

    return () => clearInterval(interval)

  },[])

return (
  <div className="app">

    <header className="header">
      <p className="tagline">Keep Your City Clean</p>
      <h1 className="title">Smart Dustbin Solution</h1>
      <button className="sms-history-btn" onClick={() => setShowSmsPopup(true)}>
        <span className="sms-icon">●</span>
        SMS History
      </button>
    </header>

    <main className="main">
      <div className="gauge-section left">
        <GasGauge level={Math.round(gasLevel)} />
      </div>
      <div className="gauge-section right">
        <DustbinGauge level={Math.round(dustbinLevel)} />
      </div>
    </main>

    <SmsHistoryPopup
      isOpen={showSmsPopup}
      onClose={() => setShowSmsPopup(false)}
      history={smsHistory}
    />


    {/* ✅ FOOTER HERE */}
    <div style={{
      position: "fixed",
      bottom: "10px",
      width: "100%",
      textAlign: "center",
      color: "#a2a2a8"
    }}>

      <div style={{
        display: "inline-block",
        padding: "2px 5px",
      
      }}>
        Design by @ Team Noe
      </div>

      <br/>

      <div style={{
        color: "#a2a2a8",
        display: "inline-block",
        padding: "5px 5px"
      }}>
        Akshay, Amana, Ananya, Muskan
      </div>

    </div>


  </div>
)
}

export default App
