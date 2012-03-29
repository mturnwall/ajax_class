Ajax Model
==========

**Author:** Michael Turnwall

This is model for ajax requests. It reduces the need to always write custom ajax handlers and custom callbacks since the json is always structured the
same way. The ajax class contains the built in functionality to update and replace content and code on the page. The selectors for the areas being
update by the ajax call are included in the ajax json as a hash table along with the new content.

Here's a small example of the ajax json:
{
	"head": {
		"status": 200,
		"data": {
			"code": 400,
			"message": "message that can be displayed in the browser, useful when an error occurs"
		}
	},
	"body": {
		"update": {
			"html": [
				{
					"id": "mainTitle",
					"value": "Title Was Updated"
				},
				{
					"id": "mainPara",
					"value": "This paragraph was updated and and it now contains some <strong>HTML</strong>."
				}
			]
		},
		"replace": {
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
}