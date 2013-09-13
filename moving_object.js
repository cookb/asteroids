(function (root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var MovingObject = Asteroids.MovingObject = function () {};
	
	MovingObject.prototype.velocity = {x: 0, y: 0};
	MovingObject.prototype.position = {x: 0, y: 0};
	MovingObject.prototype.size = {width: 0, height: 0};
	MovingObject.prototype.rotation = 0;
	
	MovingObject.prototype.screenWrap = function (axis, diameter, screenDim) {
		if (this.position[axis] + (diameter / 2) <= 0 ) {
			this.position[axis] = screenDim + (diameter / 2)
		} else if (this.position[axis] - (diameter / 2) >= screenDim ) {
			this.position[axis] = 0 - (diameter / 2)
		}
	};
	
	MovingObject.prototype.update = function () {
		this.rotation %= 360;
		this.position["x"] += this.velocity["x"];
		this.position["y"] += this.velocity["y"];
		this.screenWrap("x", this.size["width"], screenWidth);
		this.screenWrap("y", this.size["height"], screenHeight);
	};
})(this);	