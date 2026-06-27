# Smart Waste Dustbin - Web Dashboard

Web dashboard for Smart Waste Management Dustbin project. Displays live gas sensor and dustbin fill level with semi-circular gauges, clock, and SMS history.

## Hardware Components

| Component | Quantity |
|-----------|----------|
| Arduino Uno | 1 |
| Ultrasonic Sensor (HC-SR04) | 2 |
| Servo Motor (SG90) | 1 |
| MQ-135 Gas sensor | 1 |
| MQ-135 Gas Sensor module | 1 |
| Large Breadboard | 1 |
| Jumper Wires | 30 |
| USB Cable | 1 |

# Smart Dustbin Monitoring System

## Run the Project

```bash
npm install
npm run dev
npm run server
```

Open the application in your browser:

```
http://localhost:5173/
```

## SMS Alerts

### Contact Number

**Phone Number:** 9805493783
(Configured in `src/config.js`)

### Alert Messages

#### Harmful Gas Detection Alert

```
ALERT: Harmful gas has been detected inside the dustbin. Dustbin is X% full and Gas Level is Y%. Please empty the dustbin immediately.
```

#### Dustbin Full Alert

```
ALERT: Your dustbin has reached X% capacity. Please empty it immediately.
```

## SMS API Configuration

For real-time SMS notifications, configure either Twilio or MSG91 credentials in the `.env` file.

### Twilio Configuration

```env
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=
```

### MSG91 Configuration

```env
MSG91_AUTH_KEY=
MSG91_TEMPLATE_ID=
```

## Features

### Gas Monitoring System

* Real-time gas level monitoring
* Live gauge with moving needle
* Status indicators: Normal, Moderate, and Dangerous

### Dustbin Fill-Level Monitoring

* Live fill percentage tracking
* Visual gauge with real-time updates
* Capacity indicators: 20%, 40%, 60%, 80%, and 100%

### Real-Time Clock

* Displays current date and time
* Automatically updates every second

### SMS History

* Stores and displays alert history
* Accessible through the top-right button
* Easy popup interface with close option

### Live Data Simulation

* Built-in sensor simulation for demonstrations
* Can be replaced with actual hardware data for deployment

## Future Hardware Integration

The system can be connected to an Arduino using a USB connection for real-time sensor monitoring.

### Supported Hardware

* Arduino Uno
* Ultrasonic Sensor (HC-SR04)
* MQ135 Gas Sensor
* Servo Motor

### Data Communication

Arduino can transmit sensor readings through the Serial Port in JSON format. The web application can then receive and display live data using:

* Web Serial API
* Node.js Backend Integration
* Serial Communication Middleware

This enables real-time monitoring of dustbin capacity, gas levels, and automated alert generation.

## Project Highlights

* Smart Waste Management Solution
* Real-Time Monitoring Dashboard
* Automated SMS Notifications
* Gas Leakage Detection
* Dustbin Fill-Level Tracking
* Responsive Web Interface
* Future IoT and Arduino Integration Support

### Developed By

Akshay Kumar

**EcoShield – Smart Waste Management System**
