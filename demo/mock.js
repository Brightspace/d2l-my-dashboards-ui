import 'd2l-fetch/d2l-fetch.js';

function mockRoutes(mockedRoutes) {
	window.d2lfetch = {
		fetch: function(req) {
			return Promise.resolve({
				ok: true,
				headers: {
					get: function(/* mockForDate */) {
					}
				},
				json: function() {
					return Promise.resolve(mockedRoutes[req.url]);
				}
			});
		}
	};
}

var mockedRoutes = {
	'https://tenant.analytics.api.dev.brightspace.com/dashboards': {
		'entities': [
			{
				'class': [
					'dashboard'
				],
				'rel': [
					'https://api.brightspace.com/rels/analytics-dashboards'
				],
				'href': 'https://tenant.analytics.api.dev.brightspace.com/dashboards/1'
			},
			{
				'class': [
					'dashboard'
				],
				'rel': [
					'https://api.brightspace.com/rels/analytics-dashboards'
				],
				'href': 'https://tenant.analytics.api.dev.brightspace.com/dashboards/2'
			}
		]
	},
	'https://tenant.analytics.api.dev.brightspace.com/dashboards/1': {
		'properties': {
			'name': 'DisplayName1',
			'link': 'https://www.d2l.com/',
			'description': 'The Adoption Dashboard visualizes key information around tool usage, logins & course access and enrollments'
		},
		'entities': [
			{
				'class': [
					'anlytics-dashboard-image'
				],
				'rel': [
					'https://api.brightspace.com/rels/analytics-dashboard-image'
				],
				'href': './static/dashboard_1.jpg'
			},
		],
		'actions': [
			{
				'href':'https://tenant.analytics.api.dev.brightspace.com/dashboards/1/displayName',
				'name':'update-display-name',
				'method':'PUT',
				'fields':[
					{
						'type':'text',
						'name':'displayName',
						'value':''
					}
				]
			}
		]
	},
	'https://tenant.analytics.api.dev.brightspace.com/dashboards/2': {
		'properties': {
			'name': 'DisplayName2',
			'link': 'https://www.d2l.com/',
			'description': 'The Engagement Dashboard visualizes actionable metrics such as discussion, assignments, content and course engagement'
		},
		'entities': [
			{
				'class': [
					'anlytics-dashboard-image'
				],
				'rel': [
					'https://api.brightspace.com/rels/analytics-dashboard-image'
				],
				'href': './static/dashboard_2.jpg'
			},
		]
	},
	'https://tenant.analytics.api.dev.brightspace.com/dashboards/3': {
		'properties': {
			'name': 'DisplayName3',
			'link': 'https://www.d2l.com/',
			'description': 'The Dashboard visualizes test information'
		},
		'entities': [
			{
				'class': [
					'anlytics-dashboard-image'
				],
				'rel': [
					'https://api.brightspace.com/rels/analytics-dashboard-image'
				],
				'href': './static/dashboard_3.jpg'
			},
		]
	}
};
mockRoutes(mockedRoutes);

