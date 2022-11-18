import  { ReadlineParser, SerialPort } from "serialport";

const port = new SerialPort({path: 'COM3', baudRate: 115200});
const parser = new ReadlineParser( { delimiter: '\n'});
port.pipe(parser);

import pkg from 'songle-api';
const {Player, Plugin} = pkg;

// 音楽プレーヤーを初期化する
var player = new Player({
    accessToken: '00000101-b8RiuAV' // アクセストークン
});
player.addPlugin(new Plugin.SongleSync());
player.addPlugin(new Plugin.Beat({offset: 20}));
player.addPlugin(new Plugin.Variation({groupCount: 3, offset: -200}));
player.addPlugin(new Plugin.Chorus({offset: -200}));

let light = "88";

player.on("beatPlay",
    function(ev) {
        if(ev.data.beat.number == 1){
            //flash
            //write("11");
            //round
            write(light);
        }else{
            write("88");
        }
    }
)

player.on("variationEnter",
    function(ev){
        if(light != 14){
            switch(ev.data.variation.group){
                case 0:
                    light = "24";
                    break;
                case 1:
                    light = "34";
                    break;
                case 2:
                    light = "14";
                    break;
                default:
                    light = "77";
            }
        }
    }
);

player.on("chorusSectionEnter",
    function(ev){
        light = "14";
    }
);

player.on("chorusSectionLeave",
    function(ev){
        light = "34";
    }
);

player.on("pause",
    function(){
        write("99");
    }
);


function write(data) {
    console.log('Write: ' + data);
    port.write(data , function(err, results) {
        if(err) {
            console.log('Err: ' + err);
            console.log('Results: ' + results);
        }
    });
}