{
	"head": {
		"status": 200, // is the http status code for the ajax call, can convey errors to the front-end
		"data": {
			"code": 400,	// can be custom status messages
			"message": "message that can be displayed in the browser, useful when an error occurs"
		}
	},
	"body": {
		"update": {
			"html": {	// this object does updates large blocks of code
				"id": "elementSelector",
				"value": "This is the html that will get updated"
			}
		},
		"replace": {	// this object replaces data or smaller blocks of content but no code updates
			
		}
	}
}