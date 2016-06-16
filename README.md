# [ZenHub](https://www.zenhub.io/) userscripts

This repository currently contains the following userscript(s)... more may be added in the future:

* [ZenHub sort issues](#zenhub-sort-issues)
* [ZenHub toggle meta](#zenhub-toggle-meta) (labels)

# Installation

1. Make sure you have user scripts enabled in your browser (these instructions refer to the latest versions of the browser):

  * Firefox - install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).
  * Chrome - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=chrome) or [NinjaKit](https://chrome.google.com/webstore/detail/gpbepnljaakggeobkclonlkhbdgccfek).
  * Opera - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=opera) or [Violent Monkey](https://addons.opera.com/en/extensions/details/violent-monkey/).
  * Safari - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=safari) or [NinjaKit](http://ss-o.net/safari/extension/NinjaKit.safariextz).
  * Dolphin - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=dolphin).
  * UC Browser - install [Tampermonkey](https://tampermonkey.net/?ext=dhdg&browser=ucweb).

2. Install the userscript by clicking on the link:

  * [ZenHub sort issues](https://raw.githubusercontent.com/Mottie/ZenHub-userscripts/master/zenhub-sort-issues.user.js) ([GreasyFork](https://greasyfork.org/en/scripts/18116-zenhub-sort-issues)).
  * [ZenHub toggle meta](https://raw.githubusercontent.com/Mottie/ZenHub-userscripts/master/zenhub-toggle-meta.user.js) ([GreasyFork](https://greasyfork.org/en/scripts/18119-zenhub-toggle-meta)).

3. If you need to use these scripts on GitHub Enterprise sites, you'll need to modify the userscript by adding *your Enterprise URL* near the top:

      ```js
      // @include https://github-enterprise.dev/*
      ```

   You might also want to disable the automatic updating of the userscript to prevent removal of the above line after an update. Remove these two lines from near the top of the userscript:

      ```js
      // @updateURL   ...
      // @downloadURL ...
      ```

# Description

## ZenHub Sort Issues:

Hover over the pipeline header to reveal the sort arrows. In the latest update, issues may be sorted based on a selected set of data.

![zenhub-sort-issues](https://cloud.githubusercontent.com/assets/136959/14061332/ec60109a-f34b-11e5-8ae8-118ab64a45a8.gif)

## ZenHub Toggle Meta:

Click on the label icon to show or hide the pipeline meta data (labels & other data)

![zenhub-toggle-meta](https://cloud.githubusercontent.com/assets/136959/13901479/04dbfeb2-edf3-11e5-9e97-467fd929907c.gif)

# Related Userscripts

* [GitHub issue comments](https://github.com/Mottie/GitHub-userscripts/wiki/GitHub-issue-comments) (Hide ZenHub pipeline changes)
