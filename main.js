const API_Key = "AIzaSyCKESvwpRjNQa6DDLfMnjIqPimi8CBTR_o";
const ratingSelector = "yt-formatted-string.style-scope.ytd-toggle-button-renderer";
const viewsSelector = "span.view-count.style-scope.yt-view-count-renderer";
const commentsSelectors = "#count > yt-formatted-string";
const channelStatistics= "https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=iA9HUcjhKNQ&fields=items.statistics.subscriberCount&key="+API_Key;
const videoStatistics = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=WzKejwI7J38&fields=items.statistics&key="+API_Key;

var isON = true;
var isPaused = false;
var timer;


var obj;
var likesObj;
var dislikesObj;
var viewsObj;


document.addEventListener("visibilitychange", event => {
    if (document.visibilityState == "visible") {
      isPaused = false;
    } else {
      isPaused=true;
    }
})



chrome.runtime.onMessage.addListener((request) => {
    isON = false;
});

main()

function main(){
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Exo:ital@1&display=swap');
    document.head.appendChild(link);
    Start();
}

async function Start(){

    if (getVideoId()!=-1){
        await initElements();
        timer = setInterval(async ()=>{
            if(isON&&!isPaused&&(getVideoId()!=-1)){
                await updateAll()
                console.log("updated!!")
        }
    }, 10000)
    }
    timer;
}

function StringWithCommasToInt(str){
    return parseInt(str.replace(/,/g,""))
}

function animateValue(obj, start, end, duration) {
    start = parseInt(start);
    if (start=="NaN"){
        start = 0;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

function animateValue2(obj, start, end, duration) {
    start = parseInt(start);
    if (start=="NaN"){
        start = 0;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString()+" views";
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  
function timeCalculator(diff){
    if (diff==0) return 10;
    if(diff<20) return 2000;
    else if (diff < 100) return 3000;
    else if (diff < 500) return 7000;
    else if (diff < 1000) return 6000;
    else if (diff < 5000) return 8500;
    else return 9200;
}

async function getData(videoId){
    let url = "https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=" + videoId + "&fields=items.statistics&key=AIzaSyAPXyji7zyhfUM5932TTdkD7BXQT5RMCyY";
    return await fetch(url)
    .then(async data => {
        Data1 = await data.json();
        return Data1.items[0].statistics;
    }).catch(error => {
        console.log(error);
        return -1;
    });
}

function getVideoId(){
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("v")!=null) return urlParams.get("v");
    return -1;
}

async function initElements(){
    let VideoId = getVideoId();
    let data = await getData(VideoId);
    obj = document.querySelectorAll(ratingSelector);
    likesObj = obj[0];
    dislikesObj = obj[1];
    viewsObj = document.querySelector(viewsSelector);
    likesObj.setAttribute("style", "font-family: 'Exo', sans-serif;");
    dislikesObj.setAttribute("style", "font-family: 'Exo', sans-serif;");
    viewsObj.setAttribute("style", "font-family: 'Exo', sans-serif;");
    viewsObj.textContent = parseInt(data.viewCount).toLocaleString() ;
    likesObj.textContent = parseInt(data.likeCount).toLocaleString() ;
    dislikesObj.textContent = parseInt(data.dislikeCount).toLocaleString() ;
}

async function updateAll(){
    obj = document.querySelectorAll(ratingSelector);
    likesObj = obj[0];
    dislikesObj = obj[1];
    viewsObj = document.querySelector(viewsSelector);
    let data =await getData(getVideoId());
    animateValue(likesObj,StringWithCommasToInt(likesObj.textContent), data.likeCount, timeCalculator(data.likeCount-StringWithCommasToInt(likesObj.textContent)));
    animateValue(dislikesObj,StringWithCommasToInt(dislikesObj.textContent), data.dislikeCount, timeCalculator(data.dislikeCount-StringWithCommasToInt(dislikesObj.textContent)));
    animateValue2(viewsObj,StringWithCommasToInt(viewsObj.textContent), data.viewCount, timeCalculator(data.viewCount-StringWithCommasToInt(viewsObj.textContent)));
}

function killTimer(){
    clearInterval(timer);
}

