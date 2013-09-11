(function (root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function(x, y, vx, vy, radius) {
		this.radius = radius;
		this.size = {width: 2 * radius, height: 2 * radius};
		this.position = {x: x, y: y};
		this.velocity = {x: vx, y: vy};
	};
	Asteroid.inherits(Asteroids.MovingObject);
	
	Asteroid.prototype.draw = function (context) {
		context.strokeStyle = "white";
		context.lineWidth = 3;
		context.beginPath();
		context.arc(this.position["x"], this.position["y"], this.radius, 0, Math.PI * 2);
		context.closePath();
		context.stroke();
	};

	Asteroid.prototype.isHit = function (bullet) {
		var xdiff = Math.abs(bullet.position["x"] - this.position["x"]);
		var ydiff = Math.abs(bullet.position["y"] - this.position["y"]);
		var totalDiff = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
		return totalDiff <= (bullet.radius + this.radius);
	};

	Asteroid.prototype.fragment = function (asteroids) {
		var fragments = 2;
		if (this.radius > 5) {
			for (var i = 0; i < fragments; i++) {
				asteroids.push(new Asteroid(
					this.position["x"], 
					this.position["y"],
					(Math.random() * 6) - 3, 
					(Math.random() * 6) - 3, 
					this.radius / 2 )
				);
			}
		}
	};
})(this);