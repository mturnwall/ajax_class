(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['test'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<header>\n	<h1 id=\"mainTitle\">";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</h1>\n</header>\n<p id=\"mainPara\">";
  foundHelper = helpers.content;
  stack1 = foundHelper || depth0.content;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "content", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</p>\n<p>\n	Here is a value that will get updated: <span id=\"updateMe\">10,000</span>\n</p>\n<form id=\"ajaxForm\" method=\"post\" action=\"\">\n	<label for=\"name\">Name</label><input type=\"text\" name=\"name\" value=\"";
  foundHelper = helpers.formValue;
  stack1 = foundHelper || depth0.formValue;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "formValue", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\" id=\"name\">\n	<input type=\"submit\" name=\"some_name\" value=\"Submit\" id=\"some_name\">\n</form>\n<br>\n<a href=\"#\" class=\"updatePage\">Update Page</a> \n<a href=\"#\" class=\"updateTemplate\">Update Template</a>";
  return buffer;});
})();