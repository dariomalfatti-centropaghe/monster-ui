define(function(require) {
	var $ = require('jquery'),
		_ = require('lodash'),
		monster = require('monster');

	var app = {
		name: 'localtrunks',

		css: [ 'app' ],

		i18n: {
			'en-US': { customCss: false }
		},

		// Defines API requests not included in the SDK
		requests: {},

		// Define the events available for other apps
		subscribe: {},

		// Method used by the Monster-UI Framework, shouldn't be touched unless you're doing some advanced kind of stuff!
		load: function(callback) {
			var self = this;

			self.initApp(function() {
				callback && callback(self);
			});
		},

		// Method used by the Monster-UI Framework, shouldn't be touched unless you're doing some advanced kind of stuff!
		initApp: function(callback) {
			var self = this;

			// Used to init the auth token and account id of this app
			monster.pub('auth.initApp', {
				app: self,
				callback: callback
			});
		},

		// Entry Point of the app
		render: function(container) {

			var self = this,
				$container = _.isEmpty(container) ? $('#monster_content') : container,
				$layout = $(self.getTemplate({
					name: 'layout'
				}));
	
			self.bindEvents({
				template: $layout
			});
		
			$container
				.empty()
				.append($layout);

		},
		
		bindEvents: function(args) {

			var self = this,
				$template = args.template;
		
			$template.find('#search').on('click', function(e) {
				self.searchNumbers(415, 30, function(listNumbers) {
				var $results = $(self.getTemplate({
					name: 'results',
					data: {
					numbers: listNumbers
					}
				}));
		
				$template
					.find('.results')
					.empty()
					.append($results);
				});
			});

		},
	
		searchNumbers: function(pattern, size, callback) {

			var self = this;
		
			self.callApi({
				resource: 'numbers.search',
				data: {
				accountId: self.accountId,
				pattern: pattern,
				limit: size,
				offset: 5
				},
				success: function(data) {
				callback(data.data);
				},
				error: function(parsedError) {
				callback([]);
				}
			});

		},

		renderWelcome: function(pArgs) {

			var self = this,
				args = pArgs || {},
				parent = args.container || $('#skeleton_app_container .app-content-wrapper'),
				template = $(self.getTemplate({
					name: 'layout',
					data: {
						user: monster.apps.auth.currentUser
					}
				}));

			parent
				.fadeOut(function() {
					$(this)
						.empty()
						.append(template)
						.fadeIn();
				});
				
		}
	};

	return app;
});
