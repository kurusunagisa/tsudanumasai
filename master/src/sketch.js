import {Player, SongleTimer} from "textalive-app-api";
import P5 from "p5";

const songleTimer = new SongleTimer({accessToken:"00000101-b8RiuAV",
secretToken:"HQtMEczdpbvXSfgY7n3ht5G2T76AT9QR"})

const player = new Player({
    app: {token: "dR17qZsRe0YR9VYq",
        parameters: [
        ],
    },
    mediaElement: document.querySelector("#media"),
    mediaBannerPosition: "bottom right",
    timer: songleTimer,
    offset: -60,
});

window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    player.requestPause() && player.requestStop() && player.requestMediaSeek(0) && player.dispose();
    return "";
});

const play = document.querySelector("#play");
const jump = document.querySelector("#jump");
const pause = document.querySelector("#pause");
const rewind = document.querySelector("#rewind");

const positionEl = document.querySelector("#position strong");
const phraseEl = document.querySelector("#phrase");

const artist = document.querySelector("#artist span");
const song = document.querySelector("#song span");


player.addListener({
    onAppReady,
    onTimerReady,
    onTimeUpdate,
    onThrottledTimeUpdate,
    onTextLoad,
    //onPlay,
})

function onAppReady(app){
    if (!app.managed){
        document.querySelector("#control").style.display = "block";
        play.addEventListener("click", () => player.video && player.requestPlay());
        jump.addEventListener("click", () => player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
        pause.addEventListener("click", () => player.video && player.requestPause());
        rewind.addEventListener("click", () => player.video && player.requestMediaSeek(0));
    }
    if (!app.songUrl) {
        // blues / First Note
        player.createFromSongUrl("https://piapro.jp/t/FDb1/20210213190029", {
            video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121525/history
            beatId: 3953882,
            repetitiveSegmentId: 2099561,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FFDb1%2F20210213190029
            lyricId: 52065,
            lyricDiffId: 5093,
            },
        });
    }
}

//楽曲の開始可能時によびだされる
function onTimerReady(){
    /*if (window.name != "video"){
        window.name="video";
        location.reload();
    }else{
        window.name="";
    }*/
    player.requestPause();
    artist.textContent = player.data.song.artist.name;
    song.textContent = player.data.song.name;
    document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
    let p = player.video.firstPhrase;
    jump.disabled = !p;
    while (p && p.next) {
        p.animate = animatePhrase;
        p = p.next;
    }
}

//拍の取得
function onTimeUpdate(position){
    const beat = player.findBeat(position);
    if (!beat){
        return;
    }
}

function onTextLoad(body){
    document.querySelector("#dummy").textContent = body?.text;
}

function onThrottledTimeUpdate(pos){
    positionEl.textContent = String(Math.floor(pos));
}

function animatePhrase(now, unit){
    if (unit.contains(now)){
        phraseEl.textContent = unit.text;
    }
}


new P5((p5) =>{
    const width = window.innerWidth;
    const height = window.innerHeight;
    const margin = 100;
    const textAreaWidth = width-margin*2;
    const numChar = 10;

    //星の座標と大きさ
    const star = new Object();
    //星の配列
    let stars = [];

    //textの幅

    let scale = 1;
    p5.setup = () =>{
    console.log("test");
    p5.createCanvas(width,height);
    p5.colorMode(p5.HSB,360, 100,100,100);
    p5.frameRate(30);
    p5.background(20);
    p5.noStroke();
    p5.textFont("Noto Sans JP");
    //文字の位置
    p5.textAlign(p5.CENTER,p5.CENTER);
    p5.circle(10,10,10);
    }

    p5.draw = () => {
        if (!player || !player.video){
            return;
        }

        const position = player.timer.position;

        //背景
        p5.background(60);
        const beat = player.findBeat(position);
        if(beat){
            //console.log(beat.position)
            p5.fill(360,100,100);
            p5.scale(scale,scale);
            scale += 1;
            p5.rect(10,10,10,10);
        }
        let phrase = player.video.findPhrase(position-100, {loose: true});
        let word = player.video.findWord(position-100, {loose: true});
        let char = player.video.findChar(position - 100, {loose: true});
        if(char){
            //最初からの文字数
            let index = player.video.findIndex(char);
            console.log(phrase.text, phrase.endTime, word.text, word.endTime, char.text, char.endTime, index);
            /*while(char){
                if(char.endTime + 200 < position){
                    break;
                }
                if (char.startTime < position+100){
                    //文字の始まりが単語の始まりなら
                    //文字が足りなければh左の文字をクリアして左詰め
                    if(word.startTime == char.startTime){
                        nword = player.video.findWord();
                        if(nword.charCount < (index % numChar)){
                            break;
                        }
                    }
                    //const x = ((index % ))
                }
            }*/
        }
    }
})