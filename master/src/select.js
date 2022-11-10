import {randomBytes} from "crypto"

const searchButton = document.getElementById('search');

searchButton.onclick = () => {
    //contentId= await callAPI();
    //await console.log(contentId);
    //window.location.href = await `index.html?ta_song_url=https://www.nicovideo.jp/watch/${contentId}`
    const N = 20;
    rand = randomBytes(N).reduce((p, i) => p + (i % 32).toString(32), '')
    url = encodeURIComponent(document.getElementById('url').value);
    window.open(`index.html?ta_song_url=${url}&${rand}`);
}

async function callAPI(){
    const url = await document.getElementById('url');
    const res = await fetch(`https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=${url.value}&targets=title&fields=contentId&filters[viewCounter][gte]=100000&_sort=-viewCounter&_offset=0&_limit=1`)
    const musics = await res.json();
    console.log(musics);
    return await musics.data[0].contentId;
}