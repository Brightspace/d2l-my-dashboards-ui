# d2l-my-dashboards
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/Brightspace/d2l-my-dashboard-ui)
[![Bower version][bower-image]][bower-url]
[![Build status][ci-image]][ci-url]

## Installation

`d2l-my-dashboards` can be installed from [Bower][bower-url]:
```shell
bower install d2l-my-dashboards
```

## Usage

Include the [webcomponents.js](http://webcomponents.org/polyfills/) "lite" polyfill (for browsers who don't natively support web components), then import `d2l-my-dashboards.html`:

```html
<head>
	<script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
	<link rel="import" href="bower_components/d2l-my-dashboards/d2l-my-dashboards.html">
</head>
```

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../d2l-typography/d2l-typography.html">
    <link rel="import" href="d2l-my-dashboards.html">
    <custom-style include="d2l-typography">
      <style is="custom-style" include="d2l-typography"></style>
    </custom-style>
    <style>
      html {
        font-size: 20px;
        font-family: 'Lato', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
      }
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<d2l-my-dashboards>My element</d2l-my-dashboards>
```

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

To lint ([eslint](http://eslint.org/) and [Polymer lint](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#lint)):

```shell
npm run lint
```

To run unit tests locally using [Polymer test](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#tests):

```shell
npm run test:polymer:local
```

To lint AND run local unit tests:

```shell
npm test
```

## Publish updated version to LMS

- Merge changes into `d2l-my-dashbaords-ui`
- Publish new release of `d2l-my-dashbaords-ui`
- Create PR to publish/[bump](https://github.com/Brightspace/brightspace-integration/pull/928/files) `d2l-my-dashbaords-ui` in [BSI](https://github.com/Brightspace/brightspace-integration)
  * follow steps [here](https://github.com/Brightspace/brightspace-integration#bower-locking)
- Publish new release of [BSI](https://github.com/Brightspace/brightspace-integration)
  * publish a release contains latest `d2l-my-dashbaords-ui` with polymer version 1
  * publish a pre-release contains latest `d2l-my-dashbaords-ui` of BSI with polymer version 2 (only do once when create a new web component)
- Update LMS (*lp/_config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json*) to use the latest BSI
  * update `daylight-polymer-1` with latest release of BSI with polymer version 1, i.e. [PR](https://git.dev.d2l/projects/CORE/repos/lp/pull-requests/10442/diff)
  * update `daylight-polymer-2` and `daylight-polymer-3` with latest pre-release pf BSI with polymer version 2 i.e. [PR](https://git.dev.d2l/projects/CORE/repos/lp/pull-requests/10399/overview) (only do once when create a new web component)
  * Note: polymer 2 only used in [testing](http://search.dev.d2l/source/xref/Lms/lp/framework/web/D2L.LP.Web.IntegrationTests/UI/Html/Bsi/BsiAssetVerificationTests.cs#40), polymer 3 is still in a POC stage, so only have to update with polymer 2 &/ 3 once when create a new web component.
- Update local LMS instance to use the latest BSI for **testing purpose**
  * edit *{instance}/config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json*
  * update `daylight-polymer-1` with latest release of BSI with polymer version 1
  * Restart IIS

## Testing changes on local LMS instance

- run local BSI
  * go to `d2l-my-dashboards-ui` project directory with your local changes and run `bower link`
  * go to BSI(`brightspace-integration`) project directory and run `bower link d2l-my-dashboards`
  * run BSI locally `npm run serve`, get your local BSI serve i.e. `http://127.0.0.1:8080`
- Point local LMS instance with local BSI
  * edit *{instance}/config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json*
  * update `daylight-polymer-1` with your local BSI
  * Restart IIS


[bower-url]: http://bower.io/search/?q=d2l-my-dashboards
[bower-image]: https://badge.fury.io/bo/d2l-my-dashboards.svg
[ci-url]: https://travis-ci.org/Brightspace/d2l-my-dashboards-ui
[ci-image]: https://travis-ci.org/Brightspace/d2l-my-dashboards-ui.svg?branch=master
