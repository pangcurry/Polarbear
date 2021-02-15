console.log('hello here is background.js.');
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

const menuOnClick = (info, tab) => {
    try {
        var videoId = getQueryVariable(info.pageUrl.split('?')[1],'v');
    } catch (error) {
        alert(error + "\n정확한 URL을 입력해주세요.");
        return;
    }
    
    const xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    const formData = {
        videoId
    };

    chrome.downloads.download({
        body: JSON.stringify(formData),
        headers: [
            {
                name: "Content-type",
                value: "application/json" 
            }
        ],
        method: "POST",
        url: requestURL
    }, () => {
        const error = chrome.runtime.lastError;
        console.log(error);
    });
    
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
