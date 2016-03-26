// ==UserScript==
// @name          ZenHub Sort Issues
// @version       1.0.0
// @description   Sort pipeline issues by issue number
// @license       https://creativecommons.org/licenses/by-sa/4.0/
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

  sortTarget = {
    // special case: sort using value of aria-label attribute
    // use ";" as a separator
    "assignee" : ".js-zh-assignee-name a:not([aria-label='not assigned']);aria-label",
    // these all sort on element text
    "estimate" : ".zh-issuecard-estimate-badge",
    "number"   : ".zh-issuecard-number",
    "repo"     : ".zh-issuecard-reponame",
    "title"    : ".zh-issuecard-title"
  },

  init = function() {
    GM_addStyle([
      ".zh-pipeline-heading { position: relative; overflow: visible; }",
      ".sort-arrow-wrapper { position: absolute; right: 0; width: 15px; height: 23px; }",
      ".zh-pipeline:not(.zh-pipeline-collapsed) .zh-pipeline-heading:hover .sort-arrow { display: block; }",
      ".zh-pipeline-heading .sort-arrow { display: none; position: relative; top: 3px; right: 0; color: #888; cursor: pointer; }",
      ".zh-pipeline-heading .sort-arrow.desc { bottom: -6px; top: auto; }",
      ".pipeline-sort-menu { display: none; position: absolute; z-index: 1000; top: -4px; width: 115px; }",
      ".sort-arrow-wrapper:hover .pipeline-sort-menu { display: block; }",
     // using class name from GitHub-Dark script so the color matches
      ".zh-pipeline-heading .ghd-icon-active { color: #4183C4; }"
    ].join(""));

    addSortArrows();
    bindEvents();
  },

  // no need to support older IE
  closest = function(el, name) {
    while (el && !el.classList.contains(name)) {
      el = el.parentNode;
    }
    return el.classList.contains(name) ? el : null;
  },

  initSort = function(event) {
    var opts,
      target = event.target;
    if ((target.nodeName || "").toLowerCase() === "path") {
      // make sure we target the SVG and not the path element
      target = event.target.parentNode;
    }
    if (target.classList.contains("sort-arrow")) {
      var sortType, selector,
        direction = target.classList.contains("asc"),
        wrapper = closest(target, "sort-arrow-wrapper"),
        list = closest(target, "zh-pipeline"),
        issues = list ? list.querySelectorAll(".zh-pipeline-issue") : null;
      if (wrapper) {
        sortType = wrapper.querySelector("input:checked").value || "number";
        wrapper.querySelector(direction ? ".desc" : ".asc").classList.remove("ghd-icon-active");
        target.classList.add("ghd-icon-active");
      }
      if (issues && sortType) {
        selector = sortTarget[sortType].split(";");
        opts = {
          useFlex  : false,
          order    : direction ? "asc" : "desc",
          selector : selector[0],
          place    : "start"
        };
        if (selector[1]) {
          opts.attr = selector[1];
        }
        try {
          // catch js error: https://github.com/Sjeiti/TinySort/issues/114
          // estimate elements may not exist
          tinysort(issues, opts);
        } catch (err) {}
      }
    }
  },

  bindEvents = function() {
    document.body.addEventListener("click", initSort);
    document.body.addEventListener("DOMNodeInserted", function(event) {
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
        desc = "<svg class='sort-arrow desc' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 10' width='14px' height='8px'><path d='M14,0H0l7,10L14,0z' fill='currentColor'/></svg>",

        menu = [
          "<div class='pipeline-sort-menu dropdown-menu dropdown-menu-e'>",
            "<div class='dropdown-header header-nav-current-user css-truncate'>Sort By:</div>",
            "<div class='dropdown-divider'></div>",
            "<label class='dropdown-item'><input type='radio' name='pipeline-sort-group-{id}' value='number' checked> Number</label>",
            "<label class='dropdown-item'><input type='radio' name='pipeline-sort-group-{id}' value='title'> Title</label>",
            "<label class='dropdown-item'><input type='radio' name='pipeline-sort-group-{id}' value='assignee'> Assignee</label>",
            "<label class='dropdown-item'><input type='radio' name='pipeline-sort-group-{id}' value='repo'> Repo</label>",
            "<label class='dropdown-item'><input type='radio' name='pipeline-sort-group-{id}' value='estimate'> Estimate</label>",
          "</div>"
        ].join("");

      while (indx--) {
        if (!headers[indx].querySelector(".sort-arrow-wrapper")) {
          el = document.createElement("div");
          el.className = "sort-arrow-wrapper";
          el.innerHTML = asc + desc + menu.replace(/\{id\}/g, indx);
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

  // initialize if ZenHub active
  if (document.querySelector(".zhio")) {
    init();
  }

})();
