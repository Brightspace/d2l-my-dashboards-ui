/**
`d2l-dashboard-editor`

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-alert/d2l-alert.js';
import 'd2l-button/d2l-button.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-simple-overlay/d2l-simple-overlay.js';
import 'd2l-inputs/d2l-input-text.js';
import 'd2l-tooltip/d2l-tooltip.js';
import '../localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-dashboard-editor">
	<template strip-whitespace="">
		<style>
			d2l-tooltip {
				--d2l-tooltip-background-color: var(--d2l-color-cinnabar);
				--d2l-tooltip-border-color: var(--d2l-color-cinnabar);
			}
			d2l-button {
				padding-top: 5px;
				padding-right: 5px;
			}
			.dashboard-description {
				padding-top: 10px;
				padding-bottom: 10px;
				word-wrap: break-word; /* IE/Edge */
				overflow-wrap: break-word; /* replaces 'word-wrap' in Firefox, Chrome, Safari */
			}
		</style>

		<d2l-simple-overlay id="dashboard-edit-overlay" title-name="[[localize('dashboardEditorTitle')]]" close-simple-overlay-alt-text="close">

			<div id="display-name-error" hidden="[[!_displayNameError]]">
				<d2l-alert type="error">
					[[localize('displayNameError')]]
				</d2l-alert>
			</div>

			[[localize('dashboardDisplayNameLabel')]]

			<d2l-input-text id="display-name-input" name="dashboardDisplayName" aria-invalid$="[[_boolToString(_invalidDisplayName)]]">
			</d2l-input-text>

			<div class="dashboard-description">
				[[editorContext.description]]
			</div>

			<template is="dom-if" if="[[_invalidDisplayName]]">
				<d2l-tooltip id="display-name-error-tip" for="display-name-input" position="top">
					[[localize('emptyValueError')]]
				</d2l-tooltip>
			</template>

			<d2l-button id="display-name-update-button" primary="">
				[[localize('save')]]
			</d2l-button>
			<d2l-button id="display-name-cancel-button">
				[[localize('cancel')]]
			</d2l-button>

		</d2l-simple-overlay>
	</template>

	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-dashboard-editor',
	properties: {
		hidden: {
			type: Boolean,
			value: true,
			observer: '_toggleVisibility'
		},
		editorContext: {
			type: Object,
			value: {}
		},
		_const : {
			type: Object,
			value: {
				updateButtonId: '#display-name-update-button'
			}
		},
		_displayNameError: {
			type: Boolean,
			value: false
		},
		_invalidDisplayName: {
			type: Boolean,
			value: false
		}
	},
	behaviors: [
		D2L.PolymerBehaviors.AnalyticsDashboards.LocalizeBehavior
	],
	listeners: {
		'd2l-simple-overlay-closed': '_resetEditDashboardView',
		'dashboard-editor-closed': '_closeEditDashboardView'
	},
	attached: function() {
		var updateDisplayNameButton = dom(this.root).querySelector(this._const.updateButtonId);
		updateDisplayNameButton.addEventListener('click', this._boundUpdateDashboardName);

		var cancelDisplayNameButton = dom(this.root).querySelector('#display-name-cancel-button');
		cancelDisplayNameButton.addEventListener('click', this._boundFireClosed);
	},
	detached: function() {
		var updateDisplayNameButton = dom(this.root).querySelector(this._const.updateButtonId);
		updateDisplayNameButton.removeEventListener('click', this._boundUpdateDashboardName);

		var cancelDisplayNameButton = dom(this.root).querySelector('#display-name-cancel-button');
		cancelDisplayNameButton.removeEventListener('click', this._boundFireClosed);
	},
	ready: function() {
		this._boundUpdateDashboardName = this._updateDashboardName.bind(this);
		this._boundFireClosed = this._fireClosed.bind(this);
	},
	_fireClosed: function() {
		this.fire('dashboard-editor-closed');
	},
	_boolToString: function(bool) {
		return new Boolean(bool).toString();
	},
	_closeEditDashboardView: function() {
		var overlay = dom(this.root).querySelector('#dashboard-edit-overlay');
		overlay.close();
	},
	_resetEditDashboardView: function() {
		this.set('_displayNameError', false);
		this.set('_invalidDisplayName', false);
		this.fire('dashboard-editor-closed');
	},
	_toggleVisibility: function(isHidden) {
		if (isHidden === false) {
			var dashboardEditor = dom(this.root).querySelector('#dashboard-edit-overlay');
			dom(dashboardEditor).querySelector('#display-name-input').value = this.editorContext.displayName;

			dashboardEditor.open();
		}
	},
	_updateDashboardName: function() {
		var index = this.editorContext.index;

		var dashboardEditor = dom(this.root).querySelector('#dashboard-edit-overlay');
		var userInput = dom(dashboardEditor).querySelector('#display-name-input');
		var updatedDisplayName = userInput.value;

		if (!updatedDisplayName) {
			this.set('_invalidDisplayName', true);
			return Promise.resolve();
		}

		return this.editorContext.updateDisplayName(updatedDisplayName)
			.then(function() {
				this.fire('dashboard-name-updated', {
					index: index,
					displayName: updatedDisplayName
				});
				this.fire('dashboard-editor-closed');
			}.bind(this))
			.catch(function() {
				this.set('_displayNameError', true);
			}.bind(this));
	}
});
