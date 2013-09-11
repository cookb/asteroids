(function (root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Ship = Asteroids.Ship = function(x, y, radius) {
		this.radius = radius;
		this.size = {width: radius, height: radius};
		this.position = {x: x, y: y}
		this.velocity = {x: 0, y: 0}
		this.rotation = 0;
		this.power = 2;
		this.warpCharge = 0;
		this.warpCharged = 300;
		this.intangibleTime = 0;
	};
	Ship.inherits(Asteroids.MovingObject);

	Ship.prototype.limitSpeed = function () {
		var velocityMax = 10;
		if (this.velocity["x"] > velocityMax) {
			this.velocity["x"] = velocityMax;
		} else if (this.velocity["x"] < -velocityMax) {
			this.velocity["x"] = -velocityMax;
		}

		if (this.velocity["y"] > velocityMax) {
			this.velocity["y"] = velocityMax;
		} else if (this.velocity["y"] < -velocityMax) {
			this.velocity["y"] = -velocityMax;
		}
	};

	Ship.prototype.draw = function (context) {
		// // shield
		// context.fillStyle = "red";
		// context.beginPath();
		// context.arc(this.position["x"], this.position["y"], this.radius, 0, Math.PI * 2);
		// context.closePath();
		// context.fill();

		// ship draw
		context.save();
		context.translate(this.position["x"], this.position["y"]);
		context.rotate(this.rotation * Math.PI / 180);

		context.strokeStyle = (this.intangibleTime > 0 ? "grey" : "white");
		context.lineWidth = 2;
		context.beginPath();
	  context.moveTo(0, 0 - this.radius * 0.9);
	  context.lineTo(0 + this.radius * 0.6, 0 + this.radius * 0.6);
	  context.lineTo(0 - this.radius * 0.6, 0 + this.radius * 0.6);
	  context.closePath();
	  context.stroke();
		context.restore();
	};

	Ship.prototype.isHit = function (asteroid, radius) {
		var xdiff = Math.abs(asteroid.position["x"] - this.position["x"]);
		var ydiff = Math.abs(asteroid.position["y"] - this.position["y"]);
		var totalDiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
		if (this.intangibleTime > 0) { return false; }
		return totalDiff <= (radius + this.radius);
	};
})(this);		
	