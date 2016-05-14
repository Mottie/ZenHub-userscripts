// ==UserScript==
// @name          ZenHub Toggle Meta
// @version       0.1.4
// @description   Toggle pipeline issue meta data (labels)
// @license       https://creativecommons.org/licenses/by-sa/4.0/
// @namespace     http://github.com/Mottie
// @include       https://github.com/*
// @grant         GM_addStyle
// @run-at        document-idle
// @author        Rob Garrison >> http://github.com/Mottie
// @updateURL     https://raw.githubusercontent.com/Mottie/Zenhub-userscripts/master/zenhub-toggle-meta.user.js
// @downloadURL   https://raw.githubusercontent.com/Mottie/Zenhub-userscripts/master/zenhub-toggle-meta.user.js
// ==/UserScript==
/* global GM_addStyle */
(function() {
  "use strict";
  var busy = false,
  isVisible = true,

  markup = [
    "<div class='zh-board-menu-item'>",
      "<button id='zhu-toggle-meta-button' class='zh-toggle-button tooltipped tooltipped-n selected' aria-label='Toggle Issue Meta Data'>",
        "<span class='zhu-toggle-meta'>",
          "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15'>",
            "<path fill='none' stroke='currentColor' stroke-linecap='round' d='M1.972 1.156H6.1c.279.027.788.322 1.005.497l6.618 6.469c.206.2.197.937 0 1.149l-4.581 4.537c-.196.164-.848.18-1.03 0l-6.669-6.73c-.186-.194-.316-.751-.318-1.017V2.096c.015-.314.529-.926.847-.94z'/>",
            "<circle fill='none' stroke='currentColor' cx='4.8' cy='4.6' r='1'/>",
          "</svg>",
        "</span>",
      "</button>",
    "</div>"
  ].join(""),

  addButton = function() {
    // set busy flag to ignore DOMNodeInserted firing while adding new content
    busy = true;
    var el,
      ref = document.querySelector("#zh-show-closed-pipeline");
    // look for ZenHub pipeline
    if (ref && !document.querySelector(".zhu-toggle-meta")) {
      el = document.createElement("li");
      el.id = "zhu-toggle-meta";
      el.className = "zh-board-menu-itemgroup";
      el.innerHTML = markup;
      ref.parentNode.insertBefore(el, ref.nextSibling);

      el.addEventListener("click", function(){
        isVisible = !isVisible;
        toggleLabels();
        document.activeElement.blur();
      });
    }
    busy = false;
  },

  toggleLabels = function() {
    var meta = document.querySelectorAll(".zh-issuecard-meta"),
      indx = meta.length,
      button = document.querySelector("#zhu-toggle-meta-button");
    while (indx--) {
      meta[indx].style.display = isVisible ? '' : 'none';
    }
    if (isVisible) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  },

  init = function(){
    GM_addStyle([
      "#zhu-toggle-meta-button { padding-top: 6px; }",
      "#zhu-toggle-meta-button svg { color: #000; }"
    ].join(""));

    document.body.addEventListener("DOMNodeInserted", function(event) {
      if (!busy && document.querySelector(".zh-board")) {
        addButton();
      }
    });
  };

  // initialize if ZenHub active
  if (document.querySelector(".zhio, .zhe")) {
    init();
  }

})();
