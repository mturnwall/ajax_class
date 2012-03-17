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
				{   // this object does updates large blocks of code
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

var Digi = Digi || {};

/** debug default state is false */
Digi.debug = true;

Digi.logger = function (message, type) {
    if (this.debug && typeof console !== 'undefined') {
        switch (type) {
            case 'error':
                console.error(message);
                break;
            case 'object':
                console.dir(message);
                break;
            case 'log':
            default:
                console.log(message);
        }
        return true;
    }
    return false;
};

Digi.ajax = (function () {
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
			var el, i;
			for (i=0,z=html.length; i<z; i++) {
				try {
					el = $('#' + html[i].id);
					if (!el.length) {
						throw new Error('Couldn\'t find an element with an ID of ' + html[i].id);
					}
					el.html(html[i].value);
				} catch (err) {
					console.error(err.name + ' ' + err.message);
				}
			}
		},
		replaceContent: function (replace) {
			var forms, content, i;
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
			this.updateContent(this.data.body.update.html);
			this.replaceContent(this.data.body.replace);
		},
		handleError: function () {
			console.log('handleError');
		},
		getData: function (url, method, parameters) {
			var that = this;
			$.ajax({
				type: method.toUpperCase(),
				url: url,
				data: parameters || '',
				dataType: 'json',
				success: function (data) {
					that.handleResponse(data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					Digi.logger('error ' + errorThrown);
					that.handleError();
				}
			});
		},
		version: '0.1'
	};
})();