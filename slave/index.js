import  { ReadlineParser, SerialPort } from "serialport";

const port = new SerialPort({path: 'COM3', baudRate: 9600});
const parser = new ReadlineParser( { delimiter: '\n'});
port.pipe(parser);

import pkg from 'songle-api';
const {Player, Plugin} = pkg;

// 音楽プレーヤーを初期化する
var player = new Player({
    accessToken: '00000101-b8RiuAV' // アクセストークン
});
player.addPlugin(new Plugin.SongleSync());
player.addPlugin(new Plugin.Beat({offset: -100}));

player.on("beatPlay",
    function(ev) {
        switch(ev.data.beat.number){
            case 1:
                console.log("beat");
                write("OK");
                break;
            case 2:
                console.log("beat");
                write("NG");
                break;
            case 3:
                console.log("beat");
                write("NG");
                break;
            case 4:
                console.log("beat");
                write("NG");
                break;
        }
    }
)
function write(data) {
    console.log('Write: ' + data);
    port.write(data , function(err, results) {
        if(err) {
            console.log('Err: ' + err);
            console.log('Results: ' + results);
        }
    });
  }