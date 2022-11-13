#define PIN_SER 12
#define PIN_LATCH 11
#define PIN_CLK 10
#define LED 13

int recieveByte = 0;
String bufferStr = "";

byte patterns[] = {
  B10000000,
  B01000000,
  B00100000,
  B00010000,
  B00001000,
  B00000100,
  B00000010,
  B00000001,
};

bool reverse = false;
bool ledEnd = false;
int ledCount = 0;
float diffTime = 0;

void updateVolumeLED(){
  float currentTime = micros();
  if(currentTime - diffTime > 500){
    if(!ledEnd){
      digitalWrite(PIN_LATCH, LOW);
      shiftOut(PIN_SER, PIN_CLK, MSBFIRST, patterns[ledCount]);
      digitalWrite(PIN_LATCH, HIGH);
      ledCount = !reverse ? ledCount+1 : ledCount-1;
      if(ledCount == 8){
        reverse = true;
      }
      if(ledCount < 0){
        reverse = false;
        ledEnd = true;
        digitalWrite(PIN_LATCH, LOW);
        shiftOut(PIN_SER, PIN_CLK, LSBFIRST, B00000000);
        digitalWrite(PIN_LATCH, HIGH);
      }
      diffTime = currentTime;
    }
  }
}

void setup() {
  pinMode(PIN_SER, OUTPUT);
  pinMode(PIN_LATCH, OUTPUT);
  pinMode(PIN_CLK, OUTPUT);

  pinMode(LED, OUTPUT);
  Serial.begin(115200);
}

// シリアルポートに定期的に書き込んではデータを受け取る
// パーストークンは \n
// OK を受け取ったら 13 LED点灯、それ以外を受け取ったら削除
// 1秒おきループ
byte b = B11111000;

void loop() {
  bufferStr = "";
  while (Serial.available() > 0) {
    recieveByte = Serial.read();
    if (recieveByte == (int)'\n') break;
    bufferStr.concat((char)recieveByte);
  }
  if(bufferStr.length() > 0){
    digitalWrite(LED, HIGH);
    //setTempo(bufferStr[0]);
    //setVolumeTempo();
    ledEnd = false;
    ledCount = 0;
  }else{
    digitalWrite(LED, LOW);
  }
  updateVolumeLED();
  delay(10);
}

void setVolumeTempo(){
  //int rb = str - '0';
  for(int i = 7; i >= 0;i--){
    digitalWrite(PIN_LATCH, LOW);
    shiftOut(PIN_SER, PIN_CLK, LSBFIRST, patterns[i]);
    digitalWrite(PIN_LATCH, HIGH);
    delay(10);
  }
  for(int i = 0; i < 8;i++){
    digitalWrite(PIN_LATCH, LOW);
    shiftOut(PIN_SER, PIN_CLK, LSBFIRST, patterns[i]);
    digitalWrite(PIN_LATCH, HIGH);
    delay(10);
  }
  digitalWrite(PIN_LATCH, LOW);
  shiftOut(PIN_SER, PIN_CLK, LSBFIRST, B00000000);
  digitalWrite(PIN_LATCH, HIGH);
}

void setTempo(char str){
  int rb = str - '0';
  digitalWrite(PIN_LATCH, LOW);
  shiftOut(PIN_SER, PIN_CLK, LSBFIRST, (int(pow(2,rb)+1)>>1));
  digitalWrite(PIN_LATCH, HIGH);
}