(function (root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var MovingObject = Asteroids.MovingObject = function () {};
	
	MovingObject.prototype.velocity = {x: 0, y: 0};
	MovingObject.prototype.position = {x: 0, y: 0};
	MovingObject.prototype.size = {width: 0, height: 0};
	MovingObject.prototype.rotation = 0;
	
	MovingObject.prototype.update = function () {
		this.rotation %= 360;
		this.position["x"] += this.velocity["x"];
		this.position["y"] += this.velocity["y"];
	
		if (this.position["x"] + (this.size["width"] / 2) <= 0 ) {
			this.position["x"] = screenWidth + (this.size["width"] / 2)
		} else if (this.position["x"] - (this.size["width"] / 2) >= screenWidth ) {
			this.position["x"] = 0 - (this.size["width"] / 2)
		}

		if (this.position["y"] + (this.size["height"] / 2) <= 0 ) {
			this.position["y"] = screenHeight + (this.size["height"] / 2)
		} else if (this.position["y"] - (this.size["height"] / 2) >= screenHeight ) {
			this.position["y"] = 0 - (this.size["height"] / 2)
		}
	};
})(this);	