Ajax Model
==========

**Author:** Michael Turnwall

**Copyright (c) 2012 Michael Turnwall - Digitaria, Inc.**

**Released under a GPLv3 license.**

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

This is a javascript class for ajax requests. It reduces the need to always write custom ajax handlers and custom callbacks since the json is always structured the same way. The ajax class contains the built in functionality to update and replace content and code on the page. The selectors for the areas being update by the ajax call are included in the ajax json as a hash table along with the new content.

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
			},
			"append": {
				"after": [
					{
						"id": "main",
						"value": [
							"<br><br><div>First div that is appended</div>",
							"<div>Another appended div element</div>"
						]
					}
				],
				"before": [
					{
						"id": "mainPara",
						"value": [
							"<div><strong>This div is appended before an element.</strong></div>"
						]
					}
				]
			}
		}
	}