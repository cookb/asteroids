(function (root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Bullet = Asteroids.Bullet = function(x, y, vx, vy, rotation) {
		this.radius = 3;
		this.speed = 12;
		this.lifetime = 80;
		this.rotation = rotation;
		this.size = {width: this.radius * 2, height: this.radius * 2};
		this.position = {x: x, y: y};
		this.velocity = {x: vx, y: vy };
		this.velocity["x"] += this.speed * Math.sin(this.rotation * Math.PI / 180);
		this.velocity["y"] -= this.speed * Math.cos(this.rotation * Math.PI / 180);
	};
	Bullet.inherits(Asteroids.MovingObject);

	Bullet.prototype.draw = function (context) {
		context.save();
		context.fillStyle = "white";
		context.translate(this.position["x"], this.position["y"]);
		context.rotate(this.rotation * Math.PI / 180);
		context.fillRect(0 - this.radius / 2, 0 - this.radius, this.radius, this.radius * 2 );
		context.restore();
	};

	Bullet.prototype.isOffScreen = function () {
		if ((this.position["x"] + (this.size["width"] / 2) <= 0 )   ||
			  (this.position["x"] - (this.size["width"] / 2) >= screenWidth ) ||
			  (this.position["y"] + (this.size["height"] / 2) <= 0 )  ||
				(this.position["y"] - (this.size["height"] / 2) >= screenHeight )) {
			return true;
		}
		return false;
	};
})(this);