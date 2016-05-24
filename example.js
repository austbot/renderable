//Create sub class that implements renderable.
function View(parent, message) {
  this.message = message;
  Renderable.call(this, parent, "<div>{{message}}</div>");
}

View.prototype = Object.create(Renderable.prototype);
View.prototype.constructor = Renderable;

ViewModel.prototype.data = function() {
  return {
    message: this.message;
  };
};
module.exports = View;

//Create the view and render
var view = new View(document.body, "hello world");
view.render();
