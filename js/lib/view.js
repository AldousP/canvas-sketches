"use strict";

function View(canvWidth, canvHeight) {
  this.canvPos = new Vector(0 , 0);
  this.worldWidth = 1;
  this.worldHeight = 1;
  this.canvWidth = canvWidth;
  this.canvHeight = canvHeight;

  this.renderPoly = function (poly, pos, cam) {
	var viewAspectRatio = this.canvHeight / this.canvWidth;
	var canvasAspectRatio = canvas.height / canvas.width;

	var hDiff = this.canvWidth / canvas.width;
	var vDiff = this.canvHeight / canvas.height;

	var canHDiff = canvas.width/ this.worldWidth;
	var canVDiff = canvas.height / this.worldHeight;

	ctx.setTransform(
		hDiff * canHDiff,
		0,
		0,
		vDiff * canVDiff,
		canvas.width / 2 + this.canvPos.x,
		canvas.height / 2 + this.canvPos.y
	);
	var worldFlip = cpyVec(pos);
	worldFlip.y = -worldFlip.y;
	drawPolygon(poly, worldFlip);
  }
}