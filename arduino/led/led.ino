#include<FastLED.h>

#define PIN_SER 12
#define PIN_LATCH 11
#define PIN_CLK 10
#define LED 13

#define BRIGHTNESS 80
#define LED_TYPE WS2812B
#define COLOR_ORDER RGB

#define NUM_LEDS_16 16
#define RING_PIN_16 9

#define NUM_LEDS_35 35
#define RING_PIN_35 8

#define NUM_LEDS_45 45
#define RING_PIN_45 7

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

bool roundFlag = false;
bool alterFlag = false;
bool lightFlag = false;

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

//Ringライトの種類と光らせ方を選択する
void selectLightingType(int lightingType, int ringNumber){
  switch(lightingType){
    case 1:
      lightFlag = true;
      FastLED.setBrightness(90);
      alterFlag = false;
      setRingFlash(ringNumber);
      break;
    case 2:
      FastLED.setBrightness(60);
      alterFlag = false;
      setRingRound(ringNumber);
      break;
    case 3:
      FastLED.setBrightness(40);
      alterFlag = true;
      setRingAlternated(ringNumber);
      break;
  }
}

//フラッシュさせる
void setRingFlash(int ringNumber){
  switch(ringNumber){
    case 1:
      RingFlash16(true);
      break;
    case 2:
      RingFlash35(true);
      break;
    case 3:
      RingFlash45(true);
    case 4:
      RingFlash16(true);
      RingFlash35(true);
      RingFlash45(true);
  }
}

void setRingRound(int ringNumber){
  switch(ringNumber){
    case 1:
      RingRound16(true);
      break;
    case 2:  
      RingRound35(true);
      break;
    case 3:
      RingRound45(true);
      break;
    case 4:
      RingRound16(true);
      RingRound35(true);
      RingRound45(true);
  }
}

void setRingAlternated(int ringNumber){
  switch(ringNumber){
    case 1:
      RingAlternated16(true);
      break;
    case 2:  
      RingAlternated35(true);
      break;
    case 3:
      RingAlternated45(true);
      break;
    case 4:
      RingAlternated16(true);
      RingAlternated35(true);
      RingAlternated45(true);
  }
}

//変化させるLED
CRGB ring16_leds[NUM_LEDS_16];
CRGB ring35_leds[NUM_LEDS_35];
CRGB ring45_leds[NUM_LEDS_45];
//インデックス
int ring16Index = 0;
int ring35Index = 0;
int ring45Index = 0;

int ring16Time = 0;
int ring35Time = 0;
int ring45Time = 0;


//実時間ベースで変化させる
/*void RingFlash8(bool flag){
  if(flag){
    ring8Index = 0;
    FastLED.clear();
  }
  if(ring8Index < NUM_LEDS_8){  
    ring8_leds[ring8Index] = CHSV(random(100,255),255,255);
    FastLED.show();
    FastLED.delay(2);
    ring8Index++;
  }
}*/

long r_16 = 0;
long r_35 = 0;
long r_45 = 0;


void RingFlash16(bool flag){
  if(flag){
    r_16 = random(0,255);
  }
  for(int i = 0;i < NUM_LEDS_16;i++){
    ring16_leds[i] = CHSV(r_16,255,lightFlag ? 255 : 0);
  }
  FastLED.show();
}

void RingFlash35(bool flag){
  if(flag){
    r_35 = random(0,255);
  }
  for(int i = 0;i < NUM_LEDS_35;i++){
    ring35_leds[i] = CHSV(r_35,255,lightFlag ? 255 : 0);
  }
  FastLED.show();
}

void RingFlash45(bool flag){
  if(flag){
    r_45 = random(0,255);
  }
  for(int i = 0;i < NUM_LEDS_45;i++){
    ring45_leds[i] = CHSV(r_45,255,lightFlag ? 255 : 0);
  }
  FastLED.show();
}


void RingRound16(bool flag){
  float currentTime = micros();
  if(flag){
    ring16Index = 0;
    FastLED.clear();
    r_16 = random(0,255);
    roundFlag = true;
  }
  if(ring16Index < NUM_LEDS_16 && currentTime - ring16Time > 3000000){  
    ring16_leds[ring16Index] = CHSV(r_16,255,255);
    FastLED.show();
    ring16_leds[ring16Index] = CHSV(0,0,0);
    ring16Index++;
    ring16Time = currentTime;
  }
}

void RingRound35(bool flag){
  float currentTime = micros();
  if(flag){
    ring35Index = 0;
    FastLED.clear();
    r_35 = random(0,255);
    roundFlag = true;
  }
  if(ring35Index < NUM_LEDS_35 && currentTime - ring35Time > 13){  
    ring35_leds[ring35Index] = CHSV(r_35,255,255);
    FastLED.show();
    ring35_leds[ring35Index] = CHSV(0,0,0);
    ring35Index++;
    ring35Time = currentTime;
  }
}

void RingRound45(bool flag){
  float currentTime = micros();
  if(flag){
    ring45Index = 0;
    FastLED.clear();
    r_45 = random(0,255);
    roundFlag = true;
  }
  if(ring45Index < NUM_LEDS_45 && currentTime - ring45Time > 7){  
    ring45_leds[ring45Index] = CHSV(r_45,255,255);
    FastLED.show();
    ring45_leds[ring45Index] = CHSV(0,0,0);
    ring45Index++;
    ring45Time = currentTime;
  }
  if(ring45Index == NUM_LEDS_45){
    roundFlag = false;
  }
}

void RingAlternated16(bool flag){
  float currentTime = micros();
  if(flag){
    ring16Index = 0;
    FastLED.clear();
    r_16 = random(0,255);
  }
  if(currentTime - ring16Time > 30){  
    for(int i = 0; i < NUM_LEDS_16;i++){
      ring16_leds[i] = CHSV((i+ring16Index)%2*r_16,(i+ring16Index)%2*255,(i+ring16Index)%2*255);
    }
    FastLED.show();
    ring16Index++;
    ring16Time = currentTime;
  }
}

void RingAlternated35(bool flag){
  float currentTime = micros();
  if(flag){
    ring35Index = 0;
    FastLED.clear();
    r_35 = random(0,255);
  }
  if(currentTime - ring35Time > 7){  
    for(int i = 0; i < NUM_LEDS_35;i++){
      ring35_leds[i] = CHSV((i+ring35Index)%2*r_35,(i+ring35Index)%2*255,(i+ring35Index)%2*255);
    }
    FastLED.show();
    ring35Index++;
    ring35Time = currentTime;
  }
}

void RingAlternated45(bool flag){
  float currentTime = micros();
  if(flag){
    ring45Index = 0;
    FastLED.clear();
    r_45 = random(0,255);
  }
  if(currentTime - ring35Time > 7){  
    for(int i = 0; i < NUM_LEDS_45;i++){
      ring45_leds[i] = CHSV((i+ring45Index)%2*r_45,(i+ring45Index)%2*255,(i+ring45Index)%2*255);
    }
    FastLED.show();
    ring45Index++;
    ring45Time = currentTime;
  }
}


//何番目のテンポかを表示する
void setTempo(char str){
  int rb = str - '0';
  digitalWrite(PIN_LATCH, LOW);
  shiftOut(PIN_SER, PIN_CLK, LSBFIRST, (int(pow(2,rb)+1)>>1));
  digitalWrite(PIN_LATCH, HIGH);
}

void clearAllLED(){
  FastLED.clear();
  for(int i = 0;i < NUM_LEDS_16;i++){
    ring16_leds[i] = CHSV(0,0,0);
  }
  for(int i = 0;i < NUM_LEDS_35;i++){
    ring35_leds[i] = CHSV(0,0,0);
  }
  for(int i = 0;i < NUM_LEDS_45;i++){
    ring45_leds[i] = CHSV(0,0,0);
  }
  FastLED.show();
}


void setup() {
  pinMode(PIN_SER, OUTPUT);
  pinMode(PIN_LATCH, OUTPUT);
  pinMode(PIN_CLK, OUTPUT);

  FastLED.addLeds<LED_TYPE, RING_PIN_16, COLOR_ORDER>(ring16_leds, NUM_LEDS_16).setCorrection(TypicalLEDStrip);
  FastLED.addLeds<LED_TYPE, RING_PIN_35, COLOR_ORDER>(ring35_leds, NUM_LEDS_35).setCorrection(TypicalLEDStrip);
  FastLED.addLeds<LED_TYPE, RING_PIN_45, COLOR_ORDER>(ring45_leds, NUM_LEDS_45).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);

  pinMode(LED, OUTPUT);
  pinMode(RING_PIN_16, OUTPUT);
  pinMode(RING_PIN_35, OUTPUT);
  pinMode(RING_PIN_45, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  bufferStr = "";
  while (Serial.available() > 0) {
    recieveByte = Serial.read();
    if (recieveByte == (int)'\n') break;
    bufferStr.concat((char)recieveByte);
  }
  if(bufferStr.length() > 0){
    //digitalWrite(LED, HIGH);
    String finish = "99";
    if(finish.compareTo(bufferStr) == 0){
      clearAllLED();
    }else{
      digitalWrite(LED,lightFlag);
      //LEDバーの起動
      ledEnd = false;
      ledCount = 0;
      //LEDリングの起動
      selectLightingType(bufferStr[0] - '0',bufferStr[1] - '0');
      if(alterFlag){
        RingAlternated16(false);
        RingAlternated35(false);
        RingAlternated45(false);
      }
    }
    lightFlag = false;
  }
  //RingFlash35(false);
  //RingFlash45(false);
  if(roundFlag){
    RingRound16(false);
    RingRound35(false);
    RingRound45(false);
  }
  updateVolumeLED();
  delay(5);
}