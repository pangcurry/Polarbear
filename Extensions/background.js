console.log('hello here is background.js.');
// const requestURL = "http://13.124.208.2/";
const requestURL = "http://localhost:3002/";

const getQueryVariable = (query, variable) => {
    const vars = query.split('&');
    for(let i = 0; i < vars.length;i++) {
        let pair = vars[i].split('=');
        if(decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

const menuOnClick = async (info, tab) => {
    try {
        var videoId = getQueryVariable(info.pageUrl.split('?')[1],'v');
    } catch (error) {
        alert(error + "\n정확한 URL을 입력해주세요.");
        return;
    }
    
    // const xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    const formData = {
        videoId
    };
    let testTemp = 0;
    const downloadId = await chrome.downloads.download({
        body: JSON.stringify(formData),
        headers: [
            {
                name: "Content-type",
                value: "application/json" 
            }
        ],
        method: "POST",
        url: requestURL
    });
    if(!downloadId) {
        const error = chrome.runtime.lastError;
        console.log(error);
    }
    console.log(typeof(downloadId));
    console.log(videoId);
    console.log(typeof(videoId));
    
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "YouTube music download !!!",
        "documentUrlPatterns": ["*://*.youtube.com/watch*"],
        "onclick": menuOnClick
    });
});

// console.log("hi i'm background !");
