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
    xhr.responseType = 'blob';
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
    });
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState === xhr.DONE) {
    //         if (xhr.status === 200 || xhr.status === 201) {
    //             console.log(xhr.response);
    //             console.log('hahahahaha');
                
    //         } else {
    //             console.error(xhr.responseText);
    //             console.log('erererereeerererer')
    //         }
    //     }
    // };
    console.log(videoId);
    console.log(typeof(videoId));
    

    // xhr.open('POST', requestURL);
    // xhr.setRequestHeader('Content-type','application/json');
    // xhr.send(JSON.stringify(formData));
    


}

// chrome.contextMenus.onClicked.addListener();

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "YouTube music download !!!",
        "documentUrlPatterns": ["*://*.youtube.com/watch*"],
        "onclick": menuOnClick
    });
});
