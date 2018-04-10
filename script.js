// var FileSaver = require('file-saver');

var remove = "none";
var _tab;
function saveMarkuptoFile(info, tab) {
    _tab = tab;
    console.log("Word " + info.selectionText + " was clicked.");
    // chrome.tabs.create({   url: "http://www.google.com/search?q=" +
    // info.selectionText, });
    chrome
        .tabs
        .sendMessage(tab.id, {
            text: 'saveMarkuptoFile'
        }, saveDomtoFile);
}
chrome
    .contextMenus
    .create({title: "Save DOM for selection: %s", contexts: ["selection"], onclick: saveMarkuptoFile});
function copyMarkupToClipboard(info, tab) {
    _tab = tab;
    console.log("Word " + info.selectionText + " was clicked.");
    // chrome.tabs.create({   url: "http://www.google.com/search?q=" +
    // info.selectionText, });
    remove = "none";
    chrome
        .tabs
        .sendMessage(tab.id, {
            text: 'copyMarkupToClipboard'
        }, copyDomtoClipboard);
}
chrome
    .contextMenus
    .create({title: "Copy DOM for selection: %s", contexts: ["selection"], onclick: copyMarkupToClipboard});
function copyMarkupNoStyleToClipboard(info, tab) {
    _tab =  tab;
    console.log("Word " + info.selectionText + " was clicked.");
    // chrome.tabs.create({   url: "http://www.google.com/search?q=" +
    // info.selectionText, });
    remove = "style";
    chrome
        .tabs
        .sendMessage(tab.id, {
            text: 'copyMarkupToClipboard'
        }, copyDomtoClipboard);
}

chrome
    .contextMenus
    .create({title: "Copy DOM without styles for selection: %s", contexts: ["selection"], onclick: copyMarkupNoStyleToClipboard});
    
function copyMarkupMinusJunkToClipboard(info, tab) {
    _tab =  tab;
    console.log("Word " + info.selectionText + " was clicked.");
    // chrome.tabs.create({   url: "http://www.google.com/search?q=" +
    // info.selectionText, });
    remove = "junk";
    chrome
        .tabs
        .sendMessage(tab.id, {
            text: 'copyMarkupToClipboard'
        }, copyDomtoClipboard);
}
chrome
    .contextMenus
    .create({title: "Copy DOM without junk attributes for selection: %s", contexts: ["selection"], onclick: copyMarkupMinusJunkToClipboard});

function copyMarkupOnlyToClipboard(info, tab) {
    _tab =  tab;
    console.log("Word " + info.selectionText + " was clicked.");
    // chrome.tabs.create({   url: "http://www.google.com/search?q=" +
    // info.selectionText, });
    remove = "*";
    chrome
        .tabs
        .sendMessage(tab.id, {
            text: 'copyMarkupToClipboard'
        }, copyDomtoClipboard);
}
chrome
    .contextMenus
    .create({title: "Copy DOM without any attributes for selection: %s", contexts: ["selection"], onclick: copyMarkupOnlyToClipboard});

// Regex-pattern to check URLs against. It matches URLs like:
// http[s]://[...]stackoverflow.com[...] var urlRegex =
// /^https?:\/\/(?:[^./?#]+\.)?stackoverflow\.com/; A function to use as
// callback
function saveDomtoFile(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
    // var blob = new Blob([domContent], {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "hello world.txt");
    saveData(domContent, "text.xml");
}
function copyDomtoClipboard(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
    // var blob = new Blob([domContent], {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "hello world.txt");
    switch (remove) {
        case "*":
        case "all":
            // domContent = domContent.replace(/(\w+)="[^"]*"/g, "");
            domContent = domContent.replace(/(\w+)="[^"]*"/g, "");
            // domContent = domContent.replace(/href="[^"]*"/g, "");
            // domContent = $("<p><span>" + domContent + "</span></p>").find("*").each(function(){
            //     for(var i = 0 ; i < this.attributes.length; i++){
            //         console.log(this.attributes[i].name)
            //         if(this.attributes[i].name != 'href')this.removeAttribute(this.attributes[i].name);
            //     }
            // }).html();
            break;
        case "junk":
            // domContent = domContent.replace(/class="((?!table|abc).)*"/g, "");
            // domContent = domContent.replace(/class="[^(?!^table$).]*"/g, "");
            domContent = domContent.replace(/class="[^"]*"/g, "");
            domContent = domContent.replace(/dir="[^"]*"/g, "");
            domContent = domContent.replace(/style="[^"]*"/g, "");
            domContent = domContent.replace(/width="[^"]*"/g, "");
            domContent = domContent.replace(/valign="[^"]*"/g, "");
            domContent = domContent.replace(/align="[^"]*"/g, "");
            domContent = domContent.replace(/height="[^"]*"/g, "");
            domContent = domContent.replace(/lang="[^"]*"/g, "");
            domContent = domContent.replace(/_classcustom/g,'class');
            break;
        case "style":
            domContent = domContent.replace(/style="[^"]*"/g, "");
            break;
        case "none":
        default:
            break;
    }
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = domContent;
    document
        .body
        .appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful
            ? 'successful'
            : 'unsuccessful';
        console.log('Copying text command was ' + msg);
        fnAlert("success", 'Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
        fnAlert("danger", 'Oops, unable to copy');
    }
    // document.body.removeChild(textArea);
}

function fnAlert(type, message) {
    chrome
        .tabs
        .sendMessage(_tab.id, {
            type: type,
            message: message
        });
}

var saveData = (function () {
    var a = document.createElement("a");
    document
        .body
        .appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        // var json = JSON.stringify(data)
        var blob = new Blob([data], {type: "text/html;charset=utf-8"}),
            url = window
                .URL
                .createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window
            .URL
            .revokeObjectURL(url);
    };
}());

// // When the browser-action button is clicked...
// chrome.browserAction.onClicked.addListener(function (tab) {     // ...check
// the URL of the active tab against our pattern and...     if
// (urlRegex.test(tab.url)) {         // ...if it matches, send a message
// specifying a callback too         chrome.tabs.sendMessage(tab.id, {text:
// 'report_back'}, doStuffWithDom);     } });