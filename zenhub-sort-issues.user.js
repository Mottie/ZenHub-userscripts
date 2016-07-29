// ==UserScript==
// @name          ZenHub Sort Issues
// @version       1.1.1
// @description   Sort pipeline issues by issue number
// @license       https://creativecommons.org/licenses/by-sa/4.0/
// @namespace     http://github.com/Mottie
// @include       https://github.com/*
// @grant         GM_addStyle
// @require       https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.3.6/tinysort.js
// @run-at        document-idle
// @author        Rob Garrison
// @updateURL     https://raw.githubusercontent.com/Mottie/Zenhub-userscripts/master/zenhub-sort-issues.user.js
// @downloadURL   https://raw.githubusercontent.com/Mottie/Zenhub-userscripts/master/zenhub-sort-issues.user.js
// ==/UserScript==
/* global GM_addStyle, tinysort */
/*jshint unused:true, esnext:true */
(() => {
  "use strict";
  let busy = false;

  const sortTarget = {
    // special case: sort using value of aria-label attribute
    // use ";" as a separator
    "assignee" : ".zhc-issue-card__assignee img;alt",
    // these all sort on element text
    "estimate" : ".zhc-badge--estimate",
    "number"   : ".zhc-issue-card__issue-number",
    "repo"     : ".zhc-issue-card__repo-name",
    "title"    : ".zhc-issue-card__title"
  };

  function init() {
    GM_addStyle(`
      .zhc-pipeline-header__actions { position: relative; overflow: visible; }
      .zhu-sort-arrow-wrapper { position: absolute; left: -20px; top: 0; width: 15px; height: 23px; cursor: pointer; }
      .zhc-pipeline:not(.zhc-pipeline--is-collapsed) .zhc-pipeline-header:hover .zhu-sort-arrow { display: block; }
      .zhc-pipeline:not(.zhc-pipeline--is-collapsed) .zhc-pipeline-header:hover .zhc-badge--issue-count { visibility: hidden; }
      .zhc-pipeline-header .zhu-sort-arrow { display: none; position: relative; top: 3px; right: 0; color: #888; }
      .zhc-pipeline-header .zhu-sort-arrow.desc { bottom: -6px; top: auto; }
      .pipeline-sort-menu { display: none; position: absolute; z-index: 1000; top: -4px; width: 115px; cursor: auto; }
      .zhu-sort-arrow-wrapper:hover .pipeline-sort-menu { display: block; }
      /* using class name from GitHub-Dark script so the color matches */
      .zhc-pipeline-header .ghd-icon-active { color: #4183C4; }
    `);

    bindEvents();
  }

  // no need to support older IE
  function closest(el, name) {
    while (el && el.nodeName !== "BODY" && !el.classList.contains(name)) {
      el = el.parentNode;
    }
    return el.classList.contains(name) ? el : null;
  }

  function initSort(event) {
    if (document.querySelector(".zhu-sort-arrow-wrapper")) {
      let opts,
        target = event.target;
      if ((target.nodeName || "").toLowerCase() === "path") {
        // make sure we target the SVG and not the path element
        target = event.target.parentNode;
      }
      if (target.classList.contains("zhu-sort-arrow")) {
        let sortType, selector,
          direction = target.classList.contains("asc"),
          wrapper = closest(target, "zhu-sort-arrow-wrapper"),
          list = closest(target, "zhc-pipeline"),
          issues = list ? list.querySelectorAll(".zhc-issue-card") : null;
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
          // include a issue number secondary sort
          tinysort(issues, opts);
          /*, {
            useFlex  : false,
            selector : sortTarget.number,
            order    : direction ? "asc" : "desc",
            place    : "start"
          });
          */
        }
      }
    }
  }

  function bindEvents() {
    document.body.addEventListener("click", initSort);
    document.body.addEventListener("DOMNodeInserted", () => {
      if (!busy && document.querySelector(".zh-board")) {
        addSortArrows();
      }
    });
  }

  // sort arrows
  const asc = "<svg class='zhu-sort-arrow asc' xmlns='http://www.w3.org/2000/svg' viewbox='0 0 14 10' width='14px' height='8px'><path d='M7,0L0,10h14L7,0z' fill='currentColor'/></svg>",
  desc = "<svg class='zhu-sort-arrow desc' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 10' width='14px' height='8px'><path d='M14,0H0l7,10L14,0z' fill='currentColor'/></svg>",

  menu = `
    <div class="pipeline-sort-menu dropdown-menu dropdown-menu-e">
      <div class="dropdown-header header-nav-current-user css-truncate">Sort By:</div>
      <div class="dropdown-divider"></div>
      <label class="dropdown-item"><input type="radio" name="pipeline-sort-group-{id}" value="number" checked> Number</label>
      <label class="dropdown-item"><input type="radio" name="pipeline-sort-group-{id}" value="title"> Title</label>
      <label class="dropdown-item"><input type="radio" name="pipeline-sort-group-{id}" value="assignee"> Assignee</label>
      <label class="dropdown-item"><input type="radio" name="pipeline-sort-group-{id}" value="repo"> Repo</label>
      <label class="dropdown-item"><input type="radio" name="pipeline-sort-group-{id}" value="estimate"> Estimate</label>
    </div>
  `;

  function addSortArrows() {
    // set busy flag to ignore DOMNodeInserted firing while adding new content
    busy = true;
    let el,
      headers = document.querySelectorAll(".zhc-pipeline-header__actions"),
      indx = headers.length;
    // look for ZenHub pipeline
    if (indx && indx !== document.querySelectorAll(".zhu-sort-arrow-wrapper").length) {
      while (indx--) {
        if (!headers[indx].querySelector(".zhu-sort-arrow-wrapper")) {
          el = document.createElement("div");
          el.className = "zhu-sort-arrow-wrapper";
          el.innerHTML = asc + desc + menu.replace(/\{id\}/g, indx);
          headers[indx].appendChild(el);
        }
      }
    }
    busy = false;
  }

  // initialize if ZenHub active
  if (document.querySelector(".zhio, .zhe")) {
    init();
  }

})();
