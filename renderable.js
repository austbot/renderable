/**
 * Renderable
 * @description Describes a usable interface that renders a template within the context of a parent element. Using handlebars we render or rerender a template using the this.date() function to pass tha data into the template. Many classes will inherit from this class
 * @module renderable.js
 * @author Austin Adams
 */
var Handlebars = require('handlebars');
var helpers = require('./handlebars-helpers')(Handlebars);
//Pre Compiled handlbars templates.
var Templates = require('./templates/templates-compiled')(Handlebars);
var uuid = require('./uuid');
//TODO -LOW- get all templated modules on this function.

//Send in a vanilla js parent, and a string as a template.

/**
 * Renderable - Constructs a rederable object.
 *
 * @param  {htmlElement} parent   the parent element that the template needs to be rendered into.
 * @param  {handlebars_template} template a precompiles handlebars template
 * @return {this}
 */
function Renderable(parent, template) {
    //Generate a unique id or get it from the child.
    this.id = this.id || "renderable-" + uuid.generate();
    //We dont want to use jquery as a dependancy for this class so we convert if we need to.
    if (parent) {
      this.parent = parent;
      this.checkParentType();
    }
    //Initialize class vars
    this.element = undefined;
    //The key name of the template
    this.template_str = template;
    //State Variable
    this.rendered = false;
    //Load template from this.template
    this.getTemplate();
  }
  /**
   * Renderable.prototype.checkParentType - Makes sure the parent is a vanailla HTMLElement. Strips the jquery from the element if it exists.
   */
Renderable.prototype.checkParentType = function() {
  if (this.parent.jquery && this.parent.length > 0) this.parent = this.parent[0];
};
/**
 * Renderable.prototype.data - Children override this function to pass data into the render function.
 *
 * @return {object}  template variables
 */
Renderable.prototype.data = function() {
  return {
    id: this.id
  };
};

/**
 * Renderable.prototype.getTemplate - sets the this.template as the handlebars template function from the TEMPLATES constant
 *
 * @return {type}  description
 */
Renderable.prototype.getTemplate = function() {
  //Try to return the template, but spit out and error if we cant find it.
  try {
    this.template = Templates[this.template_str];
  } catch (error) {
    var err = "Missing template for " + this.__proto__.constructor.name + " " + error + error.message;
    this.error(error);
  }
};

//Renders the template by passing in the data object to the template function.

/**
 * Renderable.prototype.render - Render takes the this.data of the current object or the child, implementing the Renderable interface and renders it into the parent.
 * @throws Render error if the render fails for any reason.
 */
Renderable.prototype.render = function() {
  if (!this.parent) throw "You cannot use render without a parent, use renderedString instead";
  try {
    //Get the rendered string
    var string = this.template(this.data());
    //Create a doc fragment to put the template in
    var frag = document.createDocumentFragment(),
      //Create a parent node in the document, we need this top level node in memory so we can have a parent for the child to append into the fragment.
      tmp = document.createElement('body'),
      //Init a child element for the fragment
      child;
    //Add the template string to the tmp body
    tmp.innerHTML = string;
    //The child is now the rendered template as a dom HTMLElement object
    child = tmp.firstChild;
    //The child id
    child.id = this.id;
    //add the rendered template to the fragment
    frag.appendChild(child);
    //Delete the tmp body
    tmp = null;
    if (this.rendered) {
      //Replace the this.element with the fragment.
      this.element.parentNode.replaceChild(frag, this.element);
    } else {
      //Add the fragment which is now the rendered template into the real dom
      this.parent.appendChild(frag);
    }
    //Set the this.element as our newly rendered element
    this.element = document.getElementById(this.id);
    //Take out the frag so it can be garbage collected.
    frag = null;
    //Rendered state
    this.rendered = true;
    //Return true, just for fun.
    return true;
  } catch (error) {
    this.error(error);
  }
};

Renderable.prototype.renderedString = function() {
  //Get the rendered string
  try {
    var string = this.template(this.data());
    this.rendered = true;
    return string;
  } catch (error) {
    this.error(error);
  }
};

/**
 * Renderable.prototype.remove - removes the rendered template element.
 */
Renderable.prototype.remove = function() {
  if(this.rendered){
    this.parent.removeChild(this.element);
    this.rendered = false;
  }
};

Renderable.prototype.error = function(error) {
  var err = "Render Error on " + this.__proto__.constructor.name + " " + error;
  console.log(err);
};
//@exports Renderable
module.exports = Renderable;
