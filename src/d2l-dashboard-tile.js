/**
`d2l-dashboard-tile`

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
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
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-dashboard-tile">
	<template strip-whitespace="">
		<style>
			:host {
				display: inline-block;
			}
			d2l-card {
				width: 100%;
			}
			.d2l-dashboard-tile-image {
				object-fit: cover;
				height: 125px;
				width: 100%;
			}
			d2l-card-content-title {
				text-align: center;
			}
			d2l-card-content-meta {
				margin-top: 12px;
			}
		</style>
		<d2l-card href="[[_link]]" text="[[_name]]">

			<img slot="header" alt="" class="d2l-dashboard-tile-image" src="[[_imgUrl]]">

			<d2l-dropdown-more slot="actions" translucent="" visible-on-ancestor="" text="Options">
				<d2l-dropdown-menu>
					<d2l-menu label="Options">
						<d2l-menu-item id="change-display-name-option" text="[[localize('changeDisplayName')]]" on-d2l-menu-item-select="_changeDisplayName">
					</d2l-menu-item></d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-more>

			<div slot="content">
				<d2l-card-content-title>[[_name]]</d2l-card-content-title>
				<d2l-card-content-meta>[[_description]]</d2l-card-content-meta>
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
