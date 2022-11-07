const searchButton = document.getElementById('search');

searchButton.onclick = async () => {
    contentId= await callAPI();
    await console.log(contentId);
    //window.location.href = await `index.html?ta_song_url=https://www.nicovideo.jp/watch/${contentId}`
    window.open(`index.html?ta_song_url=https://www.nicovideo.jp/watch/${contentId}`)
}

async function callAPI(){
    const url = await document.getElementById('url');
    const res = await fetch(`https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=${url.value}&targets=title&fields=contentId&filters[viewCounter][gte]=100000&_sort=-viewCounter&_offset=0&_limit=1`)
    const musics = await res.json();
    console.log(musics);
    return await musics.data[0].contentId;
}