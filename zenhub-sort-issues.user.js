// ==UserScript==
// @name          ZenHub Sort Issues
// @version       0.1.0
// @description   Sort pipeline issues by issue number
// @namespace     http://github.com/Mottie
// @include       https://github.com/*
// @grant         GM_addStyle
// @require       https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.2.4/tinysort.js
// @run-at        document-idle
// @author        Rob Garrison >> http://github.com/Mottie
// @updateURL     https://raw.githubusercontent.com/Mottie/Zenhub-userscripts/master/zenhub-sort-issues.user.js
// @downloadURL   https://raw.githubusercontent.com/Mottie/Zenhub-userscripts/master/zenhub-sort-issues.user.js
// ==/UserScript==
/* global GM_addStyle, tinysort */
(function() {
  "use strict";
  var done = false,
  busy = false,

  init = function() {
    GM_addStyle([
      ".zh-pipeline-heading { position: relative; }",
      ".zh-pipeline:not(.zh-pipeline-collapsed) .zh-pipeline-heading:hover .sort-arrow { display: block; }",
      ".zh-pipeline-heading .sort-arrow { display: none; position: absolute; top: 3px; right: 0; color: #888; cursor: pointer; }",
      ".zh-pipeline-heading .sort-arrow.desc { bottom: 3px; top: auto; }",
      // using class name from GitHub-Dark script so the color matches
      ".zh-pipeline-heading .ghd-icon-active { color: #4183C4; }"
    ].join(""));

    addSortArrows();
    bindEvents();
  },

  addEvent = function(el, type, handler) {
    if (el.attachEvent) {
      el.attachEvent("on" + type, handler);
    } else {
      el.addEventListener(type, handler);
    }
  },

  hasClass = function(el, name) {
    if (el) {
      return el.classList ?
        el.classList.contains(name) :
        new RegExp("\\b" + name + "\\b").test(el.className);
    }
    return false;
  },

  closest = function(el, name) {
    while (el && !hasClass(el, name)) {
      el = el.parentNode;
    }
    return hasClass(el, name) ? el : null;
  },

  bindEvents = function() {
    addEvent(document.body, "click", function(event) {
      var target = event.target;
      if ((target.nodeName || "").toLowerCase() === "path") {
        // make sure we target the SVG and not the path element
        target = event.target.parentNode;
      }
      if (hasClass(target, "sort-arrow")) {
        var direction = hasClass(target, "asc"),
          otherArrow = closest(target, "sort-arrow-wrapper"),
          list = closest(target, "zh-pipeline"),
          issues = list ? list.querySelectorAll(".zh-pipeline-issue") : null;
        if (otherArrow) {
          otherArrow.querySelector(direction ? ".desc" : ".asc").classList.remove("ghd-icon-active");
          target.classList.add("ghd-icon-active");
        }
        if (issues) {
          tinysort.defaults.order = direction ? "asc" : "desc";
          tinysort(issues, ".zh-issuecard-number");
        }
      }
    });
    addEvent(document.body, "DOMNodeInserted", function(event) {
      if (done && !busy) {
        addSortArrows();
      }
    });
  },

  addSortArrows = function() {
    // set busy flag to ignore DOMNodeInserted firing while adding new content
    busy = true;
    var headers = document.querySelectorAll(".zh-pipeline-heading");
    // look for ZenHub pipeline
    if (headers.length && headers.length !== document.querySelectorAll(".sort-arrow-wrapper").length) {
      var el,
        indx = headers.length,

        // sort arrows
        asc = "<svg class='sort-arrow asc' xmlns='http://www.w3.org/2000/svg' viewbox='0 0 14 10' width='14px' height='8px'><path d='M7,0L0,10h14L7,0z' fill='currentColor'/></svg>",
        desc = "<svg class='sort-arrow desc' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 10' width='14px' height='8px'><path d='M14,0H0l7,10L14,0z' fill='currentColor'/></svg>";

      while (indx--) {
        if (!headers[indx].querySelector(".sort-arrow-wrapper")) {
          el = document.createElement("span");
          el.className = "sort-arrow-wrapper";
          el.innerHTML = asc + desc;
          headers[indx].appendChild(el);
        }
      }
      // initialization complete
      done = true;

    }
    if (!done) {
      setTimeout(function() {
        // keep checking for the pipeline to complete setup
        addSortArrows();
      }, 1000);
    }
    busy = false;
  };

  init();

})();
