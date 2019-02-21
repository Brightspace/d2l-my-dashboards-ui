import '@polymer/polymer/polymer-legacy.js';
import 'd2l-fetch-siren-entity-behavior/d2l-fetch-siren-entity-behavior.js';
import './localize-behavior.js';
import './src/d2l-dashboard-editor.js';
import './src/d2l-dashboard-tile.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
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
				grid-column-gap: 18px;
				grid-template-columns: 100%;
				-ms-grid-columns: 100%;
				justify-items: center;
				align-items: stretch;
			}	
			.d2l-dashboard-tile-cell {
				margin-bottom: 18px;		
				-ms-grid-column-align: center;
			}		
			d2l-dashboard-tile {
				width: 284px;
				height: 100%;
			}
			.dashboards-tile-grid-bottom-padding {
				padding-bottom: 79px;
			}
			@media all and (min-width: 615px) {
				.dashboards-tile-grid {
					grid-template-columns: repeat(2, 1fr);
					justify-items: stretch;
					-ms-grid-columns: 1fr 18px 1fr;
				}	
				.d2l-dashboard-tile-cell {			
					-ms-grid-column-align: stretch;
				}			
				d2l-dashboard-tile {
					width: 100%;
				}
			}
			@media all and (min-width: 913px) {
				.dashboards-tile-grid {
					grid-template-columns: repeat(3, 1fr);
					justify-items: stretch;
					-ms-grid-columns: 1fr 18px 1fr 18px 1fr;
				}	
				.d2l-dashboard-tile-cell {			
					-ms-grid-column-align: stretch;
				}		
				d2l-dashboard-tile {
					width: 100%;
				}
			}
		</style>
		
		<d2l-dashboard-editor hidden="[[_dashboardEditorHidden]]" editor-context="[[_editorContext]]">
		</d2l-dashboard-editor>

		<div id="dashboard-tile-container" class="dashboards-tile-grid dashboards-tile-grid-bottom-padding columns-3">
			<template is="dom-repeat" id="listOfDashboards" items="[[_dashboards]]" as="dashboard">
				<div class="d2l-dashboard-tile-cell">
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
/**
`d2l-my-dashboards`

@demo demo/index.html
*/
Polymer({
	is: 'd2l-my-dashboards',
	properties: {
		dashboardsUrl: {
			type: String
		},
		_dashboards: {
			type: Array
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
	ready: function() {
		this._fetchDashboards();
		window.matchMedia('(min-width: 615px)').addListener(this._styleTilesForInternetExplorer.bind(this));
		window.matchMedia('(min-width: 924px)').addListener(this._styleTilesForInternetExplorer.bind(this));
		this._styleTilesForInternetExplorer();
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
	_getDashboardTileDivs: function() {
		return dom(this.root).querySelectorAll('.dashboards-tile-grid > div');
	},
	_openEditDashboardView: function(e) {
		var editorContext = e.detail ? e.detail : {};

		this.set('_editorContext', editorContext);
		this.set('_dashboardEditorHidden', false);
	},
	_styleTilesForInternetExplorer: function(ie11retryCount) {
		ie11retryCount = ie11retryCount || 0;
		var dashboardTileDivs = this._getDashboardTileDivs();
		var numberOfColumns = 1;
		if (window.matchMedia('(min-width: 615px)').matches) numberOfColumns = 2;
		if (window.matchMedia('(min-width: 924px)').matches) numberOfColumns = 3;

		if (
			ie11retryCount < 10 &&
			dashboardTileDivs.length === 0
		) {
			// If dashboard tiles haven't yet rendered, try again for up to one second
			// (only happens sometimes in IE)
			setTimeout(function() {
				return this._styleTilesForInternetExplorer(ie11retryCount + 1);
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
	_updateDashboardName: function(e) {
		var index = e.detail.index;
		var updatedDisplayName = e.detail.displayName;
		var dashboardToModify = this._dashboards[index];

		var updatedDashboard = Object.assign(Object.create(Object.getPrototypeOf(dashboardToModify)), dashboardToModify);
		updatedDashboard.properties.name = updatedDisplayName;

		this.set('_dashboards.' + index, updatedDashboard);
	}
});
