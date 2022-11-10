const { Player , SongleTimer  } = TextAliveApp;
const songleTimer = new SongleTimer({
    accessToken: "00000101-b8RiuAV",
    secretToken: "HQtMEczdpbvXSfgY7n3ht5G2T76AT9QR"
});
const player = new Player({
    app: {
        token: "dR17qZsRe0YR9VYq",
        parameters: []
    },
    mediaElement: document.querySelector("#media"),
    mediaBannerPosition: "bottom right",
    timer: songleTimer
});
window.addEventListener("beforeunload", (event)=>{
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
    onTextLoad
});
function onAppReady(app) {
    if (!app.managed) {
        document.querySelector("#control").style.display = "block";
        play.addEventListener("click", ()=>player.video && player.requestPlay());
        jump.addEventListener("click", ()=>player.video && player.requestMediaSeek(player.video.firstPhrase.startTime));
        pause.addEventListener("click", ()=>player.video && player.requestPause());
        rewind.addEventListener("click", ()=>player.video && player.requestMediaSeek(0));
    }
    if (!app.songUrl) // blues / First Note
    player.createFromSongUrl("https://piapro.jp/t/FDb1/20210213190029", {
        video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/2121525/history
            beatId: 3953882,
            repetitiveSegmentId: 2099561,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FFDb1%2F20210213190029
            lyricId: 52065,
            lyricDiffId: 5093
        }
    });
}
//楽曲の開始可能時によびだされる
function onTimerReady() {
    /*if (window.name != "video"){
        window.name="video";
        location.reload();
    }else{
        window.name="";
    }*/ player.requestPause();
    artist.textContent = player.data.song.artist.name;
    song.textContent = player.data.song.name;
    document.querySelectorAll("button").forEach((btn)=>btn.disabled = false);
    let p = player.video.firstPhrase;
    jump.disabled = !p;
    while(p && p.next){
        p.animate = animatePhrase;
        p = p.next;
    }
}
//拍の取得
function onTimeUpdate(position) {
    const beat = player.findBeat(position);
    if (!beat) return;
}
function onTextLoad(body) {
    document.querySelector("#dummy").textContent = body?.text;
}
function onThrottledTimeUpdate(pos) {
    positionEl.textContent = String(Math.floor(pos));
}
function animatePhrase(now, unit) {
    if (unit.contains(now)) phraseEl.textContent = unit.text;
}
const width = window.innerWidth;
const height = window.innerHeight;
const margin = 30;
const numChars = 10;
const textAreaWidth = width - margin * 2;
function setup() {
    console.log("test");
    createCanvas(width, height);
    colorMode(p5.HSB, 100);
    frameRate(30);
    background(20);
    noStroke();
    textFont("Noto Sans JP");
    //文字の位置
    textAlign(p5.CENTER, p5.CENTER);
    circle(10, 10, 10);
}
function draw() {
    if (!player || !player.video) return;
    //circle(10,10,10)
    //camera.on();
    camera.x += 1;
//フレーズを取得
//もしサビなら中心に移動
//中心に１文字ずつ表示
//サビが終わっていたら各ノードに戻る
//外周ノードに文字を追加
//フレーズの文字数から円の半径を計算
//3週目からは外のノードにする
//回転数が2、回転回数が4で割り切れたら中心を軸に-45度回転
//中心を軸に90度回転
}

//# sourceMappingURL=index.90c8281a.js.map
