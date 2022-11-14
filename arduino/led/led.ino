#include<FastLED.h>

#define PIN_SER 12
#define PIN_LATCH 11
#define PIN_CLK 10
#define LED 13

#define BRIGHTNESS 80
#define LED_TYPE WS2812B
#define COLOR_ORDER RGB

#define NUM_LEDS_8 8
#define RING_PIN_8 9

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

CRGB ring8_leds[NUM_LEDS_8];

void setup() {
  pinMode(PIN_SER, OUTPUT);
  pinMode(PIN_LATCH, OUTPUT);
  pinMode(PIN_CLK, OUTPUT);

  FastLED.addLeds<LED_TYPE, RING_PIN_8, COLOR_ORDER>(ring8_leds, NUM_LEDS_8).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);

  pinMode(LED, OUTPUT);
  Serial.begin(115200);
}

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
    //LEDバーの起動
    ledEnd = false;
    ledCount = 0;
    //LEDリングの起動
  }else{
    digitalWrite(LED, LOW);
  }
  updateVolumeLED();
  delay(10);
}

//Ringライトの種類と光らせ方を選択する
void setRingLED(int ringNumber, int lightingType){
  switch(lightingType){
    case 1:
      
      break;
  }
}

//何番目のテンポかを表示する
void setTempo(char str){
  int rb = str - '0';
  digitalWrite(PIN_LATCH, LOW);
  shiftOut(PIN_SER, PIN_CLK, LSBFIRST, (int(pow(2,rb)+1)>>1));
  digitalWrite(PIN_LATCH, HIGH);
}