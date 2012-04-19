/*jshint onevar: true, sub: true, curly: true */
/*global Handlebars: true*/
var ajaxModel = {
	"head": {
		"status": 200, // is the http status code for the ajax call, can convey errors to the front-end
		"data": {
			"code": 400,    // can be custom status messages
			"message": "message that can be displayed in the browser, useful when an error occurs"
		}
	},
	"body": {
		"update": {
			"html": [
				{   // this object updates large blocks of code
					"id": "mainTitle",
					"value": "Title Was Updated"
				},
				{
					"id": "mainPara",
					"value": "This paragraph was updated and and it now contains some <strong>HTML</strong>."
				}
			]
		},
		"replace": {    // this object replaces data or smaller blocks of content but no code updates
			"forms": [
				{
					"id": "name",
					"value": "Michael Turnwall"
				}
			],
			"content": [
				{
					"id": "updateMe",
					"value": "1234567890"
				}
			]
		}
	}
};

/**
*	Polyfill for Object.create()
*	use this to create new objects
*/
if (!Object.create) {
	Object.create = function (o) {
		if (arguments.length > 1) {
			throw new Error('Sorry the polyfill Object.create only accepts the first parameter.');
		}
		function F() {}
		F.prototype = o;
		return new F();
	};
}
/**
This is model for ajax requests. It reduces the need to always write custom ajax handlers and custom callbacks since the json is always structured the
same way. The ajax class contains the built in functionality to update and replace content and code on the page. The selectors for the areas being
update by the ajax call are included in the ajax json as a hash table along with the new content.
*/
var Digi = Digi || {};

/** debug default state is false */
Digi.debug = false;

/**
*	debug console that won't break in early versions of IE
*	@param {String|Object} message the debug message to be displayed in the browser's console
*	@param {String} [type="log"] type of message that is being displayed. Options are
*									log, object, error
*	@param {String} [quiet] when displaying an error setting this value to true will act like a warning
*							this is helpful when you don't want an error to stop javascript executing
*	@author Michael Turnwall
*/
Digi.logger = function (message, type) {
    if (this.debug && typeof console !== 'undefined') {
        switch (type) {
            case 'error':
				if (typeof arguments[2] === 'undefined') {
					throw new Error(message);
				} else {
					console.warn(message);
				}
                break;
            case 'object':
                console.dir(message);
                break;
            default:
                console.log(message);
        }
        return true;
    }
    return false;
};

/**
*	This is model for ajax requests. It reduces the need to always write custom ajax handlers and custom callbacks since the json is always structured the
*	same way. The ajax class contains the built in functionality to update and replace content and code on the page. The selectors for the areas being
*	update by the ajax call are included in the ajax json as a hash table along with the new content.
*	@author Michael Turnwall
*	@namespace Digi.ajax
*/
Digi.ajax = (function () {
	var that;
	/**
	*	convert JSON from a string to object and back again
	*	@param data JSON data to be converted
	*	@param dir the direction to convert the JSON
	*	@author Michael Turnwall
	*/
	function convert(data, dir) {
		if (dir === 'toJSON') {
			return JSON.parse(data);
		} else {
			return JSON.stringify(data);
		}
	}
	return {
		data: {},
		bodyObj: '',
		updateContent: function (html) {
			var el, i, z;
			if (typeof html === 'undefined') {
				return false;
			}
			for (i=0,z=html.length; i<z; i++) {
				try {
					el = $('#' + html[i].id);
					if (!el.length) {
						Digi.logger('Line 72 - Couldn\'t find an element with an ID of ' + html[i].id, 'error', true);
					}
					el.html(html[i].value);
				} catch (err) {
					Digi.logger(err.name + ' ' + err.message, 'error');
				}
			}
		},
		replaceContent: function (replace) {
			var forms, content, i, z;
			forms = replace.forms;
			content = replace.content;
			if (typeof forms !== 'undefined') {
				for (i=0,z=forms.length; i<z; i++) {
					$('#' + forms[i].id).val(forms[i].value);
				}
			}
			if (typeof content !== 'undefined') {
				for (i=0,z=content.length; i<z; i++) {
					$('#' + content[i].id).text(content[i].value);
				}
			}
			
		},
		handleResponse: function (data) {
			this.data = data;
			if (this.data.body.update.html) {
				this.updateContent(this.data.body.update.html);
			}
			if (this.data.body.replace) {
				this.replaceContent(this.data.body.replace);
			}
		},
		handleError: function () {
			
		},
		/**
		*	make an ajax call to get json data for page update
		*	@param {String} url the url the ajax will get data from
		*	@param {String} method type of ajax call GET | POST
		*	@param {Object }[parameters] query string to send to the server as an object
		*/
		getData: function (url, method, parameters) {
			var type = (typeof method !== 'undefined') ? method.toUpperCase() : 'GET';
			that = this;
			// if user is making changes quickly abort the previous request
			if (this.jxhr) {
				this.jxhr.abort();
			}
			this.jxhr = $.ajax({
				type: type,
				url: url,
				data: parameters || '',
				dataType: 'json',
				success: function (data) {
					that.handleResponse(data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					Digi.logger('(Line 97) ' + jqXHR.status + ': ' + errorThrown, 'error');
					that.handleError(textStatus, errorThrown);
				}
			});
		},
		version: '0.2'
	};
})();

/**
 *	download handlebar templates and cache them for ajax calls
 *	@author Michael Turnwall
 *	@namespace Digi.template
 */
Digi.template = (function () {
	var ajax = Object.create(Digi),
	// testing content
		content = {
			title: 'Page Updated',
			content: 'This is new content',
			formValue: 'Jane Doe'	
		};
	return {
		version: '0.1',
		cache: {},
		path: 'js/handlebars/templates/',	// needs trailing slash
		extension: '.handlebars',			// needs the period
		fetch: function (name) {
			var that = this,
				url = this.path + name + this.extension;
			if (this.isCached(name)) {
				console.log(this.cache[name]);
				content.title = 'Template Cached';
				this.render(this.cache[name], name);
			} else {
				content.title = 'Template Not Cached';
				$.get(url, function (data) {
					that.render(data, name);
				});
			}
		},
		render: function (data, name, callback) {
			var source = data,
				template = Handlebars.compile(data);
			$('#main').html(template(content));
			if (!this.isCached(name)) {
				this.setCache(name, data);
			}
		},
		isCached: function (name) {
			return !!this.cache[name];
		},
		setCache: function (key, value) {
			this.cache[key] = value;
		}
	};
})();