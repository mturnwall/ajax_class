/*jshint onevar: true, sub: true, curly: true */
/*global Handlebars: true, console: true, $: true, jQuery: true*/

var Digi = Digi || {};

/**
*	This is a class for ajax requests. It reduces the need to always write custom ajax handlers and custom callbacks since the json is always structured the
*	same way. The ajax class contains the built in functionality to update and replace content and code on the page. The selectors for the areas being
*	update by the ajax call are included in the ajax json as a hash table along with the new content.
*	@author Michael Turnwall
*	@namespace Digi.ajax
*/
/*
	TODO make this object purely native JS so there is no reliance of an outside framework like jQuery
*/
Digi.ajax = (function ($) {
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
		/**
		 *	updates multiple portions of a page based on an element's ID
		 *	this function is designed to update blocks of HTML rather than just content
		 *	@param {Object} html an object that holds the JSON key:value pairs for the updates
		 *	@author Michael Turnwall
		 */
		updateContent: function (html) {
			var el, i, z;
			if (typeof html === 'undefined') {
				return false;
			}
			for (i in html) {
				if (html[i].hasOwnProperty('id')) {
					// console.log('id found');
				}
				if (html[i].hasOwnProperty('class')) {
					// console.log('class found');
				}
			}
			for (i=0,z=html.length; i<z; i++) {
				try {
					el = $('#' + html[i].id);
					if (!el.length) {
						throw new Error('Line 54 - Couldn\'t find an element with an ID of ' + html[i].id);
					}
					el.html(html[i].value);
				} catch (err) {
					console.error(err.name + ' ' + err.message);
				}
			}
		},
		/**
		 *	updates multiple pieces of content of an HTML element based on the element's ID
		 *	this function is designed to update blocks of content rather than HTML code
		 *	@param {Object} replace an object that holds the JSON key:value pairs for the updates
		 *	@author Michael Turnwall
		 */
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
		/**
		 *	appends content to the page either before or after an element
		 *	@param {Object} data json object that contains the JSON key:value pairs for elements that will get added to the page
		 *	@example
		 *	Here is an example of the json is structured
		 *	"after": [
		 *		{
		 *			"id": "main",
		 *			"value": [
		 *				"<br><br><div>First div that is appended</div>",
		 *				"<div>Another appended div element</div>"
		 *			]
		 *		}
		 *	],	
		 */
		appendContent: function (data) {
			var after, before, el, values, i, j, x, z;
			if (data.after) {
				after = data.after;
				for (i=0, z=after.length; i<z; i++) {
					el = $('#' + after[i].id);
					values = after[i].value;
					for (j=0, x=values.length; j<x; j++) {
						el.append(values[j]);
					}
				}
			}
			if (data.before) {
				before = data.before;
				for (i=0, z=before.length; i<z; i++) {
					el = $('#' + before[i].id);
					values = before[i].value;
					for (j=0, x=values.length; j<x; j++) {
						el.before(values[j]);
					}
				}
			}
			
		},
		updateAttributes: function (attributes) {
			var el, i, z;
			if (typeof attributes !== 'undefined') {
				z = attributes.length;
				for (i = 0; i < z; i++) {
					el = document.getElementById(attributes[i].id);
					el.setAttribute(attributes[i].attribute, attributes[i].value);
				}
			}
		},
		/**
		 *	determines which update functions to call based on what is in the JSON object
		 *	returned from the server
		 *	@param {JSON} data json object received from the server
		 *	@author Michael Turnwall
		 */
		handleResponse: function (data) {
			this.data = data;
			if (this.data.body.update.html) {
				this.updateContent(this.data.body.update.html);
			}
			if (this.data.body.replace) {
				this.replaceContent(this.data.body.replace);
			}
			if (this.data.body.append) {
				this.appendContent(this.data.body.append);
			}
			if (this.data.body.attributes) {
				this.updateAttributes(this.data.body.attributes);
			}
			/*
			if (this.data.body.templates) {
				Digi.template.fetch(this.data.body.templates[0].templateName);
			}
			*/
		},
		handleError: function () {
			/*
				TODO add error handling along with allowing it to be customized
			*/
		},
		/**
		*	make an ajax call to get json data for page update
		*	this is the only method that needs to be called publicly
		*	@param {String} url the url the ajax will get data from
		*	@param {String} method type of ajax call GET | POST
		*	@param {Object }[parameters] query string to send to the server as an object
		*/
		getData: function (url, method, parameters) {
			var type,
				date,
				that;
			
			// default request type is GET
			type = (typeof method !== 'undefined') ? method.toUpperCase() : 'GET';
			date = +new Date();
			that = this;
			
			/*
			if (this.expires && (date < this.expires)) {
				console.log('still cached');
				return false;
			}
			*/
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
					data.head.expires = +new Date() + 60000;
					if (data.head.expires) {
						that.expires = data.head.expires;
					}
					that.handleResponse(data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					Digi.logger('(Line 114) ' + jqXHR.status + ': ' + errorThrown, 'error');
					that.handleError(textStatus, errorThrown);
				}
			});
			return true;
		},
		version: '0.2.1'
	};
})(jQuery);
