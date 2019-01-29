import '@polymer/polymer/polymer-legacy.js';
import 'd2l-fetch-siren-entity-behavior/d2l-fetch-siren-entity-behavior.js';
import './localize-behavior.js';
import './src/d2l-dashboard-editor.js';
import './src/d2l-dashboard-tile.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-my-dashboards">
	<template strip-whitespace="">
		<style>
			:host {
				display: block;
			}
			.dashboards-tile-grid {
				display: -ms-grid;
				display: grid;
				grid-column-gap: 15px;
			}
			.dashboards-tile-grid-bottom-padding {
				padding-bottom: 25px;
			}
			.dashboards-tile-grid.columns-3 {
				grid-template-columns: repeat(3, 1fr);
				-ms-grid-columns: 1fr 15px 1fr 15px 1fr;
			}
			.dashboards-tile-grid.columns-2 {
				grid-template-columns: repeat(2, 1fr);
				-ms-grid-columns: 1fr 15px 1fr;
			}
			.dashboards-tile-grid.columns-1 {
				grid-template-columns: 100%;
				-ms-grid-columns: 100%;
			}
			d2l-dashboard-tile {
				width: 100%;
			}
		</style>

		<d2l-dashboard-editor hidden="[[_dashboardEditorHidden]]" editor-context="[[_editorContext]]">
		</d2l-dashboard-editor>

		<div id="dashboard-tile-container" class="dashboards-tile-grid dashboards-tile-grid-bottom-padding columns-3">
			<template is="dom-repeat" id="listOfDashboards" items="[[_dashboards]]" as="dashboard">
				<div>
					<d2l-dashboard-tile index="[[index]]" dashboard="[[dashboard]]"></d2l-dashboard-tile>
				</div>
			</template>
		</div>
	</template>

	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
if (typeof Object.assign !== 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, 'assign', {
		value: function assign(target) { // .length of function is 2
			'use strict';
			if (target === null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource !== null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}
/* For IE11 */
/**
`d2l-my-dashboards`

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
Polymer({
	is: 'd2l-my-dashboards',
	properties: {
		dashboardsUrl: {
			type: String
		},
		_dashboards: {
			type: Array,
			observer: '_toggleGap'
		},
		_dashboardEditorHidden: {
			type: Boolean,
			value: true
		},
		_editorContext: {
			type: Object,
			value: {}
		}
	},
	behaviors: [
		D2L.PolymerBehaviors.AnalyticsDashboards.LocalizeBehavior,
		D2L.PolymerBehaviors.FetchSirenEntityBehavior
	],
	listeners: {
		'dashboard-editor-closed': '_closeEditDashboardView',
		'dashboard-editor-opened': '_openEditDashboardView',
		'dashboard-name-updated': '_updateDashboardName'
	},
	attached: function() {
		window.addEventListener('resize', this._boundOnResize);
		afterNextRender(this, /* @this */ function() {
			this._onResize();
		});
	},
	detached: function() {
		window.removeEventListener('resize', this._boundOnResize);
	},
	ready: function() {
		this._boundOnResize = this._onResize.bind(this);
		this._fetchDashboards();
	},
	_closeEditDashboardView: function() {
		this.set('_dashboardEditorHidden', true);
	},
	_fetchDashboards: function() {
		return this._fetchEntity(this.dashboardsUrl)
			.then(function(data) {
				var getDashboardEntities = data.getSubEntitiesByRel('https://api.brightspace.com/rels/analytics-dashboards').map(function(e) {
					return this._fetchEntity(e.href);
				}.bind(this));
				return Promise.all(getDashboardEntities);
			}.bind(this))
			.then(function(dashboardEntities) {
				this.set('_dashboards', dashboardEntities);
			}.bind(this));
	},
	_getContainerWidth: function() {
		return this.offsetWidth;
	},
	_getDashboardTileDivs: function() {
		return dom(this.root).querySelectorAll('.dashboards-tile-grid > div');
	},
	_openEditDashboardView: function(e) {
		var editorContext = e.detail ? e.detail : {};

		this.set('_editorContext', editorContext);
		this.set('_dashboardEditorHidden', false);
	},
	_styleTilesForInternetExplorer: function(numberOfColumns, ie11retryCount) {
		var dashboardTileDivs = this._getDashboardTileDivs();
		if (
			ie11retryCount < 10 &&
			dashboardTileDivs.length === 0
		) {
			// If dashboard tiles haven't yet rendered, try again for up to one second
			// (only happens sometimes in IE)
			setTimeout(function() {
				return this._styleTilesForInternetExplorer(numberOfColumns, ++ie11retryCount);
			}.bind(this), 100);
			return;
		}

		for (var i = 0; i < dashboardTileDivs.length; i++) {
			var div = dashboardTileDivs[i];
			var column = (i % numberOfColumns + 1) * 2 - 1;
			var row = Math.floor(i / numberOfColumns) + 1;

			div.style['-ms-grid-column'] = column;
			div.style['-ms-grid-row'] = row;
		}
	},
	_onResize: function() {
		var containerWidth = this._getContainerWidth();
		var dashboardTileContainer = dom(this.root).querySelector('#dashboard-tile-container');

		var numColumns = Math.min(Math.floor(containerWidth / 385) + 1, 3);
		var dashboardTileContainerClass = 'columns-' + numColumns;

		if (dashboardTileContainer.classList.toString().indexOf(dashboardTileContainerClass) === -1) {
			dashboardTileContainer.classList.remove('columns-1');
			dashboardTileContainer.classList.remove('columns-2');
			dashboardTileContainer.classList.remove('columns-3');
			dashboardTileContainer.classList.add(dashboardTileContainerClass);
		}

		this._styleTilesForInternetExplorer(numColumns, 0);
	},
	_toggleGap: function() {
		var dashboardTileContainer = dom(this.root).querySelector('#dashboard-tile-container');
		dashboardTileContainer.classList.remove('dashboards-tile-grid-bottom-padding');
		if (this._dashboards && this._dashboards.length > 0) {
			dashboardTileContainer.classList.add('dashboards-tile-grid-bottom-padding');
		}
	},
	_updateDashboardName: function(e) {
		var index = e.detail.index;
		var updatedDisplayName = e.detail.displayName;
		var dashboardToModify = this._dashboards[index];

		var updatedDashboard = Object.assign(Object.create(Object.getPrototypeOf(dashboardToModify)), dashboardToModify);
		updatedDashboard.properties.name = updatedDisplayName;

		this.set('_dashboards.' + index, updatedDashboard);
	}
});
