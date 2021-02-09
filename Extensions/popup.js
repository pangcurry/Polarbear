// function sayHello(){
//     document.body.innerText = "Hello, World!";
// }
// window.onload = sayHello;
// let console = chrome.extension.getBackgroundPage().console;
// console.log('hello here is popup background.js.');
// const requestURL = "http://localhost:3002/ping";

// const getQueryVariable = (query, variable) => {
//     const vars = query.split('&');
//     for(let i = 0; i < vars.length;i++) {
//         let pair = vars[i].split('=');
//         if(decodeURIComponent(pair[0]) === variable) {
//             return decodeURIComponent(pair[1]);
//         }
//     }
// }

// const menuOnClick = (info, tab) => {
//     try {
//         const videoId = getQueryVariable(info.pageUrl.split('?')[1],'v');
//     } catch (error) {
//         alert(error + "\n정확한 URL을 입력해주세요.");
//         return;
//     }
    
//     const xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState === xhr.DONE) {
//             if (xhr.status === 200 || xhr.status === 201) {
//                 console.log(xhr.responseText);
//             } else {
//                 console.error(xhr.responseText);
//             }
//         }
//     };

//     const formData = {
//         'test': "hello"
//     };

//     xhr.open('POST', requestURL);
//     xhr.setRequestHeader('Content-type','application/json');
//     xhr.send(JSON.stringify(formData));
// }

// chrome.contextMenus.onClicked.addListener();

// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         "title": "YouTube music download !!!",
//         "documentUrlPatterns": ["*://*.youtube.com/watch*"],
//         "onclick": menuOnClick
//     });
// });



// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
