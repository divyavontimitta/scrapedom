// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // debugger;
    // If the received message has the expected format...
    if (msg.text === 'saveMarkuptoFile') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        // sendResponse(document.all[0].outerHTML);
        sendResponse(getSelectionHtml());
    }
    if (msg.text === 'copyMarkupToClipboard') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        // sendResponse(document.all[0].outerHTML);
        sendResponse(getSelectionHtml());
    }
    if(typeof msg.type!== 'undefined' && (msg.type === 'success' || msg.type === 'danger')){
        fnAlert(msg.type, msg.message);
    }
});

function fnAlert(type, message){
    var keypad1 = document.createElement("div");
    keypad1.setAttribute("id","alert-div-ce");
    keypad1.setAttribute("class","alert-div-ce alert-div-ce-"+type);
    keypad1.innerHTML = message;
    document.body.appendChild(keypad1);
    setTimeout(function() {
        document.getElementById("alert-div-ce").remove();
    }, 5000);
}

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
var tagsWhiteList = ['span', 'img'];
var tagsNested = ['b', 'span'];
var tagsInList = ['div', 'span'];
var tagsWrapper = ['table', 'p', 'blockquote', 'img'];
var tagsBlindRemove = ['o:p'];
var tagsEmpty = ['blockquote', 'br'];
window
    .addEventListener('load', function () {
       if($.fn.jquery){
        var element;
        if($("#cms-center-3-column").length){
            element = $("#cms-center-3-column *")
        }else if($(".CMS_Body .CMS_Template .CMS_Region.CMS_Content > table span[class^='CMS_Citem']").length){
            element = $(".CMS_Body .CMS_Template .CMS_Region.CMS_Content > table span[class^='CMS_Citem'] > table *");
        }else if($(".CMS_Body .CMS_Template .CMS_Region.CMS_Content > table span[class^='cms_citem'] table").length){
            element = $(".CMS_Body .CMS_Template .CMS_Region.CMS_Content > table span[class^='cms_citem'] > table *")
        }else if($(".CMS_Region.CMS_Content table table table td:eq(1)").length){
            element = $(".CMS_Region.CMS_Content table table table td:eq(1) *")
        }else if($("#cms-center-2-column-left").length){
            element = $("#cms-center-2-column-left *")
        }
        if(typeof element === "undefined"){
            return;
        }
        element.each(function(index, item) { 
            console.log($(item).prop("tagName"));  
            if($(item).prop("tagName").toLowerCase() == 'img'){
                return;
            } 
            if(!$(item).is(":visible") || $.trim($(item).text()) == ''){
                if($.inArray($(item).prop("tagName").toLowerCase(), tagsWrapper) == -1){
                    // $(item).remove();
                    return;
                }                
            }
            if($.inArray($(item).prop("tagName").toLowerCase(), tagsBlindRemove) != -1){
                    if($(item).children().length != 0){
                        $($(item).children()[0]).unwrap()
                    }else{
                        $(item).remove();
                    }
            }
            if($.inArray($(item).prop("tagName").toLowerCase(), tagsWhiteList) != -1){
                var remove = $.trim($(item).contents().filter(function(){
                    return this.nodeType == 3; 
                }).text()) == '';
                if(remove){
                    if($(item).children().length != 0){
                        $($(item).children()[0]).unwrap()
                    }else{
                        $(item).remove();
                    }
                }
            }
            if($.inArray($(item).prop("tagName").toLowerCase(), tagsNested) != -1){
                var remove = $.trim($(item).contents().filter(function(){
                    return this.nodeType == 3; 
                }).text()) == '';
                if(remove){
                    if($(item).children().length == 1){
                        $($(item).children()[0]).unwrap()
                    }
                }
            }
            if ($.inArray($(item).prop("tagName").toLowerCase(), tagsInList) != -1) {
                if($(item).parent().is("li") || $(item).parent().is("p") || $(item).parent().is("span") ){
                    var remove =  $.trim($(item).parent()
                        .contents()
                        .filter(function () {
                            return this.nodeType == 3;
                        }).text()) == '';
                    if (remove) {
                        if ($(item).parent().children().length == 1) {
                            $(item).contents().unwrap()
                        }
                    }
                }
                
            }
            
            if($(item).prop("tagName") == "B" || $(item).prop("tagName") == "U"){
                var $this = $(item);
                $this.replaceWith($("<strong>" + $this.html() + "</strong>"));
            }
            if($.trim($(item).text()) === "" && $.inArray($(item).prop("tagName").toLowerCase(), tagsEmpty) == -1) {
                
            //    $(item).remove();
               return;
            }
            if($(item).prop("tagName") == "TABLE"){
                $(item).attr("_classcustom","table");
                $(item).wrap("<div _classcustom='table-responsive'></div>");
            }
        });
       }
    //    javascript: (function(e, s) {
    //     e.src = s;
    //     e.onload = function() {
    //         jQuery.noConflict();
    //         console.log('jQuery injected');
    //         $ = jQuery
    //     };
    //     document.head.appendChild(e);
    // })(document.createElement('script'), 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js')
    // 
    }, false);