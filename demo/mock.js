
function mockRoutes( mockedRoutes ) {
  window.d2lfetch = {
    fetch: function(req) {
      return Promise.resolve({
        ok: true,
        headers: {
          get: function(mockForDate) {
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
  "https://tenant.analytics.api.dev.brightspace.com/dashboards": {
    "entities": [
      {
        "class": [
          "dashboard"
        ],
        "rel": [
          "https://api.brightspace.com/rels/analytics-dashboards"
        ],
        "href": "https://tenant.analytics.api.dev.brightspace.com/dashboards/1"
      },
      {
        "class": [
          "dashboard"
        ],
        "rel": [
          "https://api.brightspace.com/rels/analytics-dashboards"
        ],
        "href": "https://tenant.analytics.api.dev.brightspace.com/dashboards/2"
      },
      {
        "class": [
          "dashboard"
        ],
        "rel": [
          "https://api.brightspace.com/rels/analytics-dashboards"
        ],
        "href": "https://tenant.analytics.api.dev.brightspace.com/dashboards/3"
      }
    ]
  },
  "https://tenant.analytics.api.dev.brightspace.com/dashboards/1": {
    "properties": {
      "name": "DisplayName1",
      "link": "https://www.d2l.com/"
    },
    "entities": [
      {
        "class": [
          "anlytics-dashboard-image"
        ],
        "rel": [
          "https://api.brightspace.com/rels/analytics-dashboard-image"
        ],
        "href": "./static/dashboard_1.jpg"
      },
    ],
    "actions": [
      {
        "href":"https://84d0c96f-cf9f-478f-8d0d-2582239eb1ce.organizations.api.dev.brightspace.com/dashboards/1/displayName",
        "name":"update-display-name",
        "method":"PUT",
        "fields":[
           {
              "type":"text",
              "name":"displayName",
              "value":""
           }
        ]
     }
    ]
  },
  "https://tenant.analytics.api.dev.brightspace.com/dashboards/2": {
    "properties": {
      "name": "DisplayName2",
      "link": "https://www.d2l.com/"
    },
    "entities": [
      {
        "class": [
          "anlytics-dashboard-image"
        ],
        "rel": [
          "https://api.brightspace.com/rels/analytics-dashboard-image"
        ],
        "href": "./static/dashboard_2.jpg"
      },
    ]
  },
  "https://tenant.analytics.api.dev.brightspace.com/dashboards/3": {
    "properties": {
      "name": "DisplayName3",
      "link": "https://www.d2l.com/"
    },
    "entities": [
      {
        "class": [
          "anlytics-dashboard-image"
        ],
        "rel": [
          "https://api.brightspace.com/rels/analytics-dashboard-image"
        ],
        "href": "./static/dashboard_3.jpg"
      },
    ]
  }
};
mockRoutes(mockedRoutes);

