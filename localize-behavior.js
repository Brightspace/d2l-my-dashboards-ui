import '@polymer/polymer/polymer-legacy.js';
import 'd2l-localize-behavior/d2l-localize-behavior.js';
import './namespace.js';
import './lang/all.js';
/* @polymerBehavior */
D2L.PolymerBehaviors.AnalyticsDashboards.LocalizeBehaviorImpl = {
	properties: {
		resources: {
			value: function() {
				return window.D2L.PolymerBehaviors.AnalyticsDashboards.LangTerms;
			}
		}
	}
};

/* @polymerBehavior */
D2L.PolymerBehaviors.AnalyticsDashboards.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.AnalyticsDashboards.LocalizeBehaviorImpl
];
