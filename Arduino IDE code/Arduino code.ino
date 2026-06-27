#include <Servo.h>

// -------- First Ultrasonic (Dustbin Level) --------
#define trigPin 9
#define echoPin 10

// -------- Second Ultrasonic (Lid Open Sensor) --------
#define trigPin2 7
#define echoPin2 8

#define servoPin 5
#define gasSensor A0

bool lidOpen = false;
bool waitingForRemove = false;
unsigned long openTime = 0;

Servo myServo;

long duration;
int distance;

long duration2;
int distance2;

int gasValue;

int dustbinHeight = 28;

void setup() {

  Serial.begin(9600);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  myServo.attach(servoPin);

  myServo.write(0);

}

void loop() {

  // -------- Dustbin Level Ultrasonic --------

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH, 30000);

  distance = duration * 0.034 / 2;

  if(distance <= 0 || distance > dustbinHeight){
    distance = dustbinHeight;
  }

  int dustbinPercent = map(distance, dustbinHeight, 0, 0, 100);

  dustbinPercent = constrain(dustbinPercent, 0, 100);


  // -------- Gas Sensor --------

  gasValue = analogRead(gasSensor);
  gasValue = analogRead(gasSensor);

  int gasPercent = map(gasValue, 200, 800, 0, 100);

  gasPercent = constrain(gasPercent, 0, 100);



  // -------- Lid Open Ultrasonic (7,8) --------

  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin2, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin2, LOW);

  duration2 = pulseIn(echoPin2, HIGH);

  distance2 = duration2 * 0.034 / 2;



// -------- Servo Control --------

// Open only once
if(distance2 <= 10 && lidOpen == false && waitingForRemove == false)
{
    myServo.write(100);        // open
    lidOpen = true;
    openTime = millis();
}

// Close after 7 seconds
if(lidOpen == true && millis() - openTime >= 7000)
{
    myServo.write(0);         // close
    lidOpen = false;
    waitingForRemove = true;  // wait until hand removed
}

// Reset when hand removed
if(distance2 > 10 && waitingForRemove == true)
{
    waitingForRemove = false;
}

  // -------- Send Data --------

  Serial.print("D:");
  Serial.print(dustbinPercent);

  Serial.print(",G:");
  Serial.println(gasPercent);


  delay(1000);



}