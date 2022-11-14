import {Player, SongleTimer, Ease} from "textalive-app-api";
import P5,{Image} from "p5";

(function(d) {
    var config = {
      kitId: 'hzb4bty',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);

window.onbeforeunload =  (event) => {
    player.requestPause() && player.requestStop() && player.requestMediaSeek(0);
    //player.dispose();
    return  "false";
};
window.onunload =  (event) => {
    player.requestPause() && player.requestStop() && player.requestMediaSeek(0);
    // && player.dispose();
    return "Check";
};


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
    valenceArousalEnabled: true,
    vocalAmplitudeEnabled: true,
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
    //onThrottledTimeUpdate,
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
    document.querySelector("#media").className = "disabled";
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
    document.getElementsByClassName("textalive-media-wrapper")[0].style.display = "none";
    player.requestPause();
    artist.textContent = player.data.song.artist.name;
    song.textContent = player.data.song.name;
    document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
    /*let p = player.video.firstPhrase;
    jump.disabled = !p;
    while (p && p.next) {
        p.animate = animatePhrase;
        p = p.next;
    }*/
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
/*
function animatePhrase(now, unit){
    if (unit.contains(now)){
        phraseEl.textContent = unit.text;
    }
}*/


const sketch = (p5) =>{
    const width = window.innerWidth;
    const height = window.innerHeight;
    //表示する文字数
    const numChar = 7;
    //円の半径
    let radius = height/2 - 30;

    let img = null;
    const imageURL = "https://lh3.googleusercontent.com/BVUHVmvPUmjhu_gctJS_NBGZjF6ZuVIfe3bS4jzrF6gB3qsMV3tpyiE0znKn1MpOZOKaEqc-vb2NHpOmAmy2WGLlgGHEj6MVRm4_R6yu_vsihD5QMGTI0Qo65xhDIjikToPur7yBEeGyEqWw4CtB7_Qd0XwMaBpsR7Oc3Foo_N-2bGEIxjtSVu2UgbSUkjm1WqsJ5syzmODffWkkz159ZstxAm5TQQjMUoV-OPQ32b0UOt9l7nNRdinZV4pd5Ko3clMgFPGR0--zhaRu5Mlz7GpJb5D6lkPkkVqeEn7TlF7BC792AngzkF5FGG1tjufbUld7kmLFBncFsB6jelofgcRr_YogVewU23N9SMN1EXp7GHno2YLU2I4yq9kcAHN6gYHQKio63jnFV-NaVEiuIViIW27dA81IMW4ya-iNmhfdIiNZI66xTuLS6IZjXAbsYfQ6RdOIwYJUmvb7SDloOzwvPxUBQDqiRWEyMrZYdqz-cgWolbONxEnv0PbHu5_vUdnDBrtc71cVoRFsJGb8midyVACWWxc_bZvmvBt-uuxrb9mLVcT475PeCJVgq9A7Jl-IWkzQaxnx5VztFkDoxaBym2gNPcwsvs6iocLfVsCG0o78kIEu7FL1JWmKO1yE4q-crcgDI4cfB9EQZtz4ZVemCMojm7TrMFgWpngFKba6Tzs4og-x6mq_5BMj2FiQlsMI2SCYlW1X5PW86NHUCWM94hJ8kNc5BiUTDcivi_5jadGrOmjdNP1OgVcg2q1AIEW-GNafqVZJts6hvLSR6Nzkm1WD0lMwPPBLwsrMpoefIqgC8kLVBXdoyLqS0P0cBCtl-ZHcYfVQWIuS7lPOCplR3Hw7yXlmDNARtYpuXFFWYxu3GNmjtuxI31yRQqlHO-ndcMkgtdgBoOF_Fh-2ry59K5MUiCNV7B3bHkpc3QQiX2VDFDppUzG6aeHhGmYx0XM_mRWA_K9UfZL2dCtVtg=s924-no?authuser=1"
    p5.preload = () => {
        img = p5.loadImage(imageURL);
    }

    p5.setup = () =>{

    p5.createCanvas(width,height);
    p5.colorMode(p5.HSB,360, 100,100,100);
    p5.frameRate(30);
    p5.background(0);
    p5.noStroke();
    p5.textFont("fot-seurat-pron");
    //文字の位置
    p5.textAlign(p5.CENTER,p5.CENTER);
    p5.frameRate(60);
    }

    const radpi = Math.PI/(numChar-1);
    let rad = [];
    for (let i = numChar-1;i >= 0;i--){
        rad.push(radpi*i);
    }
    let cosrad =[]
    let sinrad = []
    for (r of rad){
        cosrad.push(Math.cos(r));
        sinrad.push(Math.sin(r));
    }

    let index = 0;
    let previousChar;
    let previousIndex;
    let phraseEnd;

    let star = []

    p5.setStar = (flag) =>{
        p5.background(0);
        p5.stroke(255);
        if(flag){
            star.length = 0;
            for(let i = 0;i < index*index;i++){
                star.push({weight: Math.random()*100%4, width: Math.random()*10000%width, height: Math.random()*10000%height})
            }
        }
        for(let i = 0; i < index;i++){
            p5.strokeWeight(star[i]?.weight);
            p5.point(star[i]?.width,star[i]?.height);
        }
        p5.noStroke();
    }

    let earthRad = 0;

    p5.draw = () => {
        if (!player || !player.video || !player.isPlaying){
            return;
        }

        const position = player.timer.position;

        let char = player.video.findChar(position+150, {loose: true});
        let bchar = player.video.findChar(position);
        let word = player.video.findWord(position+200, {loose: true});
        let phrase = player.video.findPhrase(position+300);
        //console.log(char.text);
        //一定以上の時間がたった文字は消す
        /*if(Math.round(word.endTime + 300)/100 == position/100){
            texts.forEach((text, index) =>{
                if(text.endTime+1000 < position){
                    texts.splice(index,1);
                    //delete texts[index];
                }
            });
        }*/
        //console.log(phrase?.endTime/100,position/100);
        phraseEnd = isNaN(phrase?.endTime) ? phraseEnd : phrase?.endTime;
        //console.log(phraseEnd);
        if(Math.round((phraseEnd)/120) == Math.round((position)/120)){
            p5.setStar(true);
        }
        //近づいたら文字を表示
        //console.log(player.video.findIndex(char))
        if(bchar?.endTime > position){
            p5.setStar(false);
        }
        if(char?.startTime - 150 < position){
            //文字が上限を超えたら最初の要素から消す
            /*if(texts.length >= numChar){
                texts.shift();
                p5.background(60);
            }*/
            //texts.push(char);
            //console.log(texts);
            previousIndex = index;
            if(previousChar?.endTime != char?.endTime){
                index++;
            }
            console.log(index, player.video.findIndex(char), char?.text, char?.endTime);
            //console.log(index);
            previousChar = char;

            const vocal = player.getVocalAmplitude(position+60);
            const maxVocal = player.getMaxVocalAmplitude();

            let size;
            let alpha;
            if(position < char.startTime + 100){
                const progress = (char.startTime - position)/1000;
                const eased = Ease.bounceOut(progress);
                //console.log("eased:",eased);
                size = (vocal/maxVocal)*200+0.12 * height * (1- eased);
                //console.log("size:", size);
                alpha = 100 - (char.startTime - position)/4;
            }
            /*if(position > char.startTime + 150){
                const progress = (char.endTime - position)/1000;
                const eased = Ease.quadIn(progress);
                console.log("eased:",eased);
                size -= 0.2 * height * (1- eased);
                console.log("size:", size);
                alpha = 100 - (char.startTime - position)/4;
            }*/

            /*if (index % numChar == 0 && index != previousIndex){
                radius += 55;
            }
            if(Math.floor(index / numChar % 6) == 0){
                radius = height/2 - 60;
            }*/

            x = width / 2 + radius * cosrad[index%numChar];
            y = height - 80 - radius * sinrad[index%numChar];
            p5.fill(index%1000,255,255,70,alpha);
            p5.circle(x,y,size);
            p5.fill(0,0,100);
            p5.textSize(size*0.8);
            p5.text(char.text,x,y);
        }
        /*p5.fill(0,0,100);
        p5.textSize(20);
        texts.forEach((text, index) =>{
            x = width/2 + radius * cosrad[index];
            y = height - 30 - radius * sinrad[index];
            rad -= pi12;
            //p5.rotate(Math.PI/2-rad);
            p5.text(text.text,x,y);
        });*/
        const beat = player.findBeat(position);


        p5.push();
        p5.translate(width/2,height);
        if(beat){
            if(beat.position % 2 == 1){
                p5.fill(180,255,255,200);
            }else{
                p5.fill(0,0,0);
            }
        }
        p5.circle(0,0,height/1.73);
        p5.rotate(earthRad+=Math.PI/720);
        p5.image(img, -height/3.3, -height/3.3, height/1.65, height/1.65);
        p5.pop();
    }
}

new P5(sketch);