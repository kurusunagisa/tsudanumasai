# LEDとリリックアニメーションを同期したトイ作品
津田沼祭で展示した、Web技術と電子工作を同期した視覚的な効果を与えるリリックアニメーション作品

![D90646D7-0463-435A-B8AA-C81277C86512_1_105_c](https://user-images.githubusercontent.com/41140188/207920239-f3d55b19-8297-4b2a-9802-a67a89ba75e0.jpeg)
![FhvGt2nUAAAzC8e](https://user-images.githubusercontent.com/41140188/207923135-e6a2cee6-842f-4673-9bc6-bb5279c4bab4.jpeg)

## How To Use
### Require
- Node.js (>=16)
- Aruduino IDE (>=3)
- Arduino Uno
- LEDリング(SW2812B) 16,35,45個
- LEDライト 8個
- 74HC595 1個

### Command
```sh
$ git clone https://github.com/kurusunagisa/tsudanumasai
$ cd tsudanumasai
```
2つのシェルを起動します

### master
```sh
$ cd master
$ npm run dev
```

`http://127.0.0.1:1234/`で音楽が再生されるはずです

### slave
```sh
$ cd slave
$ node index.js
```
**TODO:LED配線図を書く**

`http://127.0.0.1:1234/`で音楽が再生するとLEDリングがテンポに同期して光ります
