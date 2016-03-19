// ==UserScript==
// @name          ZenHub Toggle Meta
// @version       0.1.1
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
  var done = false,
  isVisible = true,

  addEvent = function(el, type, handler) {
    if (el.attachEvent) {
      el.attachEvent("on" + type, handler);
    } else {
      el.addEventListener(type, handler);
    }
  },

  addButton = function() {
    GM_addStyle([
      "#zh-toggle-meta-button { padding-top: 6px; }",
      // using class name from GitHub-Dark script so the color matches
      "#zh-toggle-meta-button svg { color: #000; }"
    ].join(""));

    var markup = [
      "<div class='zh-board-menu-item'>",
        "<button id='zh-toggle-meta-button' class='zh-toggle-button tooltipped tooltipped-n selected' aria-label='Toggle Issue Meta Data'>",
          "<span class='zh-toggle-meta zh-octicon-grey'>",
            "<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15'>",
              "<path fill='none' stroke='currentColor' stroke-linecap='round' d='M1.972 1.156H6.1c.279.027.788.322 1.005.497l6.618 6.469c.206.2.197.937 0 1.149l-4.581 4.537c-.196.164-.848.18-1.03 0l-6.669-6.73c-.186-.194-.316-.751-.318-1.017V2.096c.015-.314.529-.926.847-.94z'/>",
              "<circle fill='none' stroke='currentColor' cx='4.8' cy='4.6' r='1'/>",
            "</svg>",
          "</span>",
        "</button>",
      "</div>"
    ].join(""),
    el = document.createElement("li"),
    ref = document.querySelector("#zh-show-closed-pipeline");

    el.id = "zh-toggle-meta";
    el.className = "zh-board-menu-itemgroup";
    el.innerHTML = markup;
    ref.parentNode.insertBefore(el, ref.nextSibling);

    addEvent(el, "click", function(){
      isVisible = !isVisible;
      toggleLabels();
    });
  },

  addClass = function( el, name ) {
    if ( el ) {
      if ( el.classList ) {
        el.classList.add( name );
      } else if ( !pl.hasClass( el, name ) ) {
        el.className += ' ' + name;
      }
    }
  },

  removeClass = function( el, name ) {
    if ( el ) {
      if ( el.classList ) {
        el.classList.remove( name );
      } else {
        el.className = el.className.replace( new RegExp( '\\b' + name + '\\b', 'g' ), '' );
      }
    }
  },

  toggleLabels = function() {
    var meta = document.querySelectorAll(".zh-issuecard-meta"),
      indx = meta.length,
      button = document.querySelector("#zh-toggle-meta-button");
    while (indx--) {
      meta[indx].style.display = isVisible ? '' : 'none';
    }
    if (isVisible) {
      removeClass(button, "selected");
    } else {
      addClass(button, "selected");
    }
  },

  init = function(){
    if (!done && document.querySelector(".zh-board-menu")) {
      addButton();
      done = true;
    } else {
      setTimeout(function() {
        init();
      },1000);
    }
  };

  // initialize if ZenHub active
  if (document.querySelector(".zhio")) {
    init();
  }

})();
