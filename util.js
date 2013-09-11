Function.prototype.inherits = function (parentObject) {
	function Surrogate() {};
	Surrogate.prototype = parentObject.prototype;
	this.prototype = new Surrogate ();
}