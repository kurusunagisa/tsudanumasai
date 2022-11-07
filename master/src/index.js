import {Player, SongleTimer} from "textalive-app-api";

const songleTimer = new SongleTimer({accessToken:"00000101-b8RiuAV",
secretToken:"HQtMEczdpbvXSfgY7n3ht5G2T76AT9QR"})

const player = new Player({
    app: {token: "dR17qZsRe0YR9VYq",
        parameters: [
        ],
    },
    mediaElement: document.querySelector("#media"),
    mediaBannerPosition: "bottom right",
    timer: songleTimer
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
    onThrottledTimeUpdate
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

onAppParameterUpdate: () => {
    const params = player.app.options.parameters;
}

//楽曲の開始時によびだされる
function onTimerReady(){
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

//毎秒更新
//拍の取得
function onTimeUpdate(position){
    const beat = player.findBeat(position);
    if (!beat){
        return;
    }
}

function onThrottledTimeUpdate(position){
    positionEl.textContent = String(Math.floor(position));
}

function animatePhrase(now, unit){
    if (unit.contains(now)){
        phraseEl.textContent = unit.text;
    }
}


