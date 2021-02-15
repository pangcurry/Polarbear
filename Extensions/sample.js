// // Copyright (c) 2012 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.

// // The onClicked callback function.
// function onClickHandler(info, tab) {
//     if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
//       console.log("radio item " + info.menuItemId +
//                   " was clicked (previous checked state was "  +
//                   info.wasChecked + ")");
//     } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
//       console.log(JSON.stringify(info));
//       console.log("checkbox item " + info.menuItemId +
//                   " was clicked, state is now: " + info.checked +
//                   " (previous state was " + info.wasChecked + ")");
  
//     } else {
//       console.log("item " + info.menuItemId + " was clicked");
//       console.log("info: " + JSON.stringify(info));
//       console.log("tab: " + JSON.stringify(tab));
//     }
// };
  
// chrome.contextMenus.onClicked.addListener(onClickHandler);

// // Set up context menu tree at install time.
// chrome.runtime.onInstalled.addListener(function() {
// // Create one test item for each context type.
//     var contexts = ["page","selection","link","editable","image","video",
//                     "audio"];
//     for (var i = 0; i < contexts.length; i++) {
//         var context = contexts[i];
//         var title = "Test '" + context + "' menu item";
//         var id = chrome.contextMenus.create({
//             "title": title, 
//             "contexts":[context],
//             "id": "context" + context
//         });
//         console.log("'" + context + "' item:" + id);
//     }

//     // Create a parent item and two children.
//     chrome.contextMenus.create({
//         "title": "Test parent item", 
//         "id": "parent"
//     });
//     chrome.contextMenus.create({
//         "title": "Child 1", 
//         "parentId": "parent", 
//         "id": "child1"
//     });
//     chrome.contextMenus.create(
//         {"title": "Child 2", 
//         "parentId": "parent", 
//         "id": "child2"
//     });
//     console.log("parent child1 child2");

//     // Create some radio items.
//     chrome.contextMenus.create({
//         "title": "Radio 1", 
//         "type": "radio",
//         "id": "radio1"
//     });
//     chrome.contextMenus.create({
//         "title": "Radio 2", 
//         "type": "radio",
//         "id": "radio2"
//     });
//     console.log("radio1 radio2");

//     // Create some checkbox items.
//     chrome.contextMenus.create({
//         "title": "Checkbox1", 
//         "type": "checkbox", 
//         "id": "checkbox1"
//     });
//     chrome.contextMenus.create({
//         "title": "Checkbox2", 
//         "type": "checkbox",
//         "id": "checkbox2"
//     });
//     console.log("checkbox1 checkbox2");

//     // Intentionally create an invalid item, to show off error checking in the
//     // create callback.
//     console.log("About to try creating an invalid item - an error about " +
//         "duplicate item child1 should show up");
//     chrome.contextMenus.create({
//         "title": "Oops", 
//         "id": "child1"
//     }, function() {
//         if (chrome.extension.lastError) {
//         console.log("Got expected error: " + chrome.extension.lastError.message);
//         }
//     });
// });

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function matches(rule, item) {
    if (rule.matcher == 'js')
      return eval(rule.match_param);
    if (rule.matcher == 'hostname') {
      var link = document.createElement('a');
      link.href = item.url.toLowerCase();
      var host = (rule.match_param.indexOf(':') < 0) ? link.hostname : link.host;
      return (host.indexOf(rule.match_param.toLowerCase()) ==
              (host.length - rule.match_param.length));
    }
    if (rule.matcher == 'default')
      return item.filename == rule.match_param;
    if (rule.matcher == 'url-regex')
      return (new RegExp(rule.match_param)).test(item.url);
    if (rule.matcher == 'default-regex')
      return (new RegExp(rule.match_param)).test(item.filename);
    return false;
  }
  
  chrome.downloads.onDeterminingFilename.addListener(function(item, __suggest) {
    function suggest(filename, conflictAction) {
      __suggest({filename: filename,
                 conflictAction: conflictAction,
                 conflict_action: conflictAction});
      // conflict_action was renamed to conflictAction in
      // https://chromium.googlesource.com/chromium/src/+/f1d784d6938b8fe8e0d257e41b26341992c2552c
      // which was first picked up in branch 1580.
    }
    var rules = localStorage.rules;
    try {
      rules = JSON.parse(rules);
    } catch (e) {
      localStorage.rules = JSON.stringify([]);
    }
    for (var index = 0; index < rules.length; ++index) {
      var rule = rules[index];
      if (rule.enabled && matches(rule, item)) {
        if (rule.action == 'overwrite') {
          suggest(item.filename, 'overwrite');
        } else if (rule.action == 'prompt') {
          suggest(item.filename, 'prompt');
        } else if (rule.action == 'js') {
          eval(rule.action_js);
        }
        break;
      }
    }
  });

  // -----------------------------------------------< 임시저장 2/15 >-----------------------------------------------------------------------------
//   console.log('hello here is background.js.');
// const requestURL = "http://localhost:3002/";

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
//         var videoId = getQueryVariable(info.pageUrl.split('?')[1],'v');
//     } catch (error) {
//         alert(error + "\n정확한 URL을 입력해주세요.");
//         return;
//     }
    
//     const xhr = new XMLHttpRequest();
//     // xhr.responseType = 'blob';
//     const formData = {
//         videoId
//     };

//     chrome.downloads.download({
//         body: JSON.stringify(formData),
//         headers: [
//             {
//                 name: "Content-type",
//                 value: "application/json" 
//             }
//         ],
//         method: "POST",
//         url: requestURL
//     }, () => {
//         const error = chrome.runtime.lastError;
//         console.log(error);
//     });
    

//     // xhr.onreadystatechange = function() {
//     //     if (xhr.readyState === xhr.DONE) {
//     //         if (xhr.status === 200 || xhr.status === 201) {
//     //             callback(xhr.responseText);
//     //             console.log('hahahahaha');
                
//     //         } else {
//     //             console.error(xhr.responseText);
//     //             console.log('erererereeerererer')
//     //         }
//     //     }
//     // };

//     // xhr.open('POST', requestURL);
//     // xhr.setRequestHeader('Content-type','application/json');
//     // xhr.send(JSON.stringify(formData));


//     console.log(videoId);
//     console.log(typeof(videoId));
    
// }

// // chrome.contextMenus.onClicked.addListener();

// chrome.runtime.onInstalled.addListener(function() {
//     chrome.contextMenus.create({
//         "title": "YouTube music download !!!",
//         "documentUrlPatterns": ["*://*.youtube.com/watch*"],
//         "onclick": menuOnClick
//     });
// });
