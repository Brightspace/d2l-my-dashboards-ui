/**
`d2l-dashboard-tile`

@demo demo/index.html
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-card/d2l-card.js';
import 'd2l-card/d2l-card-content-title.js';
import 'd2l-card/d2l-card-content-meta.js';
import 'd2l-dropdown/d2l-dropdown-more.js';
import 'd2l-dropdown/d2l-dropdown-menu.js';
import 'd2l-menu/d2l-menu.js';
import 'd2l-menu/d2l-menu-item.js';
import '../localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import 'd2l-typography/d2l-typography.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-dashboard-tile">
	<template strip-whitespace="">
		<style include="d2l-typography">
			:host {
				display: inline-block;
			}
			d2l-card {
				width: 100%;
				height: 100%;
			}
			.d2l-dashboard-tile-image {
				background-position: left;
				height: 107px;
				width: 100%;
			}
			#card-title {
				margin: 0;
			}
			.d2l-my-dashboards-card-content {
				padding: 6px 8px 6px 8px;
			}
			d2l-card-content-meta {
				margin-top: 0.6rem;
			}
			.d2l-my-dashboards-metric-list {
				display: flex;
				flex-flow: row wrap;
			}
			.d2l-my-dashboards-metric {
				flex-basis: 100%;
			}
			.metric-inner {
				/* hanging indent */
				padding-left: .95em;
    			text-indent: -.95em;
			}
			@media all and (min-width: 1230px) {
				.metric {
					flex-basis: 50%;
				}	
			}
		</style>
		<d2l-card href="[[_link]]" text="[[_name]]" subtle>

			<div slot="header" alt="" class="d2l-dashboard-tile-image" style$="background-image: url('[[_imgUrl]]')"></div>

			<d2l-dropdown-more slot="actions" translucent="" visible-on-ancestor="" text="Options">
				<d2l-dropdown-menu>
					<d2l-menu label="Options">
						<d2l-menu-item id="change-display-name-option" text="[[localize('changeDisplayName')]]" on-d2l-menu-item-select="_changeDisplayName">
					</d2l-menu-item></d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-more>

			<div slot="content" class="d2l-typography d2l-my-dashboards-card-content">
				<d2l-card-content-title class="d2l-heading-2" id="card-title">[[_name]]</d2l-card-content-title>
				<d2l-card-content-meta class="d2l-body-compact">[[_description]]</d2l-card-content-meta>
				<d2l-card-content-meta class="d2l-my-dashboards-metric-list d2l-body-compact">
					<template is="dom-repeat" id="listOfMetrics" items="[[_metrics]]" as="metric">
						<div class="d2l-my-dashboards-metric"><div class="metric-inner">• [[metric]]</div>	</div>			
					</template>
				</d2l-card-content-meta>
			</div>

		</d2l-card>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-dashboard-tile',
	properties: {
		dashboard: {
			type: Object,
			observer: '_configureDashboard'
		},
		index: {
			type: Number
		},
		_link : {
			type: String
		},
		_name : {
			type: String
		},
		_description : {
			type: String
		},
		_imgUrl : {
			type: String
		},
		_metrics: {
			type: Array
		}
	},
	behaviors: [
		D2L.PolymerBehaviors.AnalyticsDashboards.LocalizeBehavior
	],
	ready: function() {
		this._configureDashboard();
	},
	_configureDashboard: function() {
		if (!this.dashboard) {
			return;
		}

		var imageEntity = this.dashboard.getSubEntityByRel('https://api.brightspace.com/rels/analytics-dashboard-image');
		var imageUrl = imageEntity ? imageEntity.href : undefined;

		this.set('_link', this.dashboard.properties.link);
		this.set('_name', this.dashboard.properties.name);
		this.set('_description', this.dashboard.properties.description);
		this.set('_imgUrl', imageUrl);
		this.set('_metrics', this.dashboard.properties.metrics);
	},
	_changeDisplayName: function() {
		this.fire('dashboard-editor-opened', {
			displayName: this._name,
			description: this._description,
			index: this.index,
			updateDisplayName: this._generateUpdateAction(this.dashboard.getActionByName('update-display-name')).bind(this)
		});
	},
	_generateUpdateAction: function(action) {
		return function(updatedDisplayName) {
			return new Promise(function(resolve) {
				var fields = action.fields;
				var body = '';

				fields.forEach(function(field) {
					body = body + encodeURIComponent(field.name) + '=' + encodeURIComponent(updatedDisplayName) + '&';
				});

				resolve(window.d2lfetch
					.fetch(action.href, {
						method: action.method,
						headers: {
							'content-type':'application/x-www-form-urlencoded'
						},
						body: body
					})
				);
			});
		};
	}
});
