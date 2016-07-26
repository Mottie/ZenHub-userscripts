// ==UserScript==
// @name          ZenHub Toggle Meta
// @version       0.1.5
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
/* jshint esnext:true, unused:true */
(() => {
  "use strict";
  let busy = false,
    isVisible = true,

    $style = document.createElement("style"),

    markup = `
      <button id="zhu-toggle-meta-button" class="zhc-toggle-button tooltipped tooltipped-n zhc-toggle-button--is-active" aria-label="Toggle Issue Meta Data">
        <span class="zhu-toggle-meta zhc-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
            <path fill="none" stroke="currentColor" stroke-linecap="round" d="M1.972 1.156H6.1c.279.027.788.322 1.005.497l6.618 6.469c.206.2.197.937 0 1.149l-4.581 4.537c-.196.164-.848.18-1.03 0l-6.669-6.73c-.186-.194-.316-.751-.318-1.017V2.096c.015-.314.529-.926.847-.94z"/>
            <circle fill="none" stroke="currentColor" cx="4.8" cy="4.6" r="1"/>
          </svg>
        </span>
      </button>
    `;

  function addButton() {
    // set busy flag to ignore DOMNodeInserted firing while adding new content
    busy = true;
    let el,
      ref = $(".zhc-search-bar");
    // look for ZenHub pipeline
    if (ref && !$("#zhu-toggle-meta-button")) {
      el = document.createElement("div");
      el.id = "zhu-toggle-meta";
      el.className = "zhc-tooltip zhc-tooltip--top";
      el.innerHTML = markup;
      ref.parentNode.insertBefore(el, ref);

      el.addEventListener("click", () => {
        isVisible = !isVisible;
        toggleLabels();
        document.activeElement.blur();
      });
    }
    busy = false;
  }

  function toggleLabels() {
    let button = $("#zhu-toggle-meta-button");
    if (isVisible) {
      button.classList.add("zhc-toggle-button--is-active");
      $style.disabled = true;
    } else {
      button.classList.remove("zhc-toggle-button--is-active");
      $style.disabled = false;
    }
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function init() {
    GM_addStyle(`
      #zhu-toggle-meta-button .zhc-icon { padding-top: 2px; }
      #zhu-toggle-meta-button svg { color: #000; }
    `);

    document.body.appendChild($style);
    $style.textContent = ".zhc-issue-card__meta { display: none; }";
    $style.disabled = true;

    document.body.addEventListener("DOMNodeInserted", () => {
      if (!busy && $(".zh-board")) {
        addButton();
      }
    });
  }

  // initialize if ZenHub active
  if ($(".zhio, .zhe")) {
    init();
  }

})();
