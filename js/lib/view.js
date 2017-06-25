"use strict";

function View(canvWidth, canvHeight) {
  this.canvPos = new Vector(0 , 0);
  this.worldWidth = 1;
  this.worldHeight = 1;
  this.canvWidth = canvWidth;
  this.canvHeight = canvHeight;

  this.renderPoly = function (poly, pos, cam) {
		var viewAspectRatio = this.canvHeight / this.canvWidth;
		var canvasAspectRatio = sm.canvas.height / sm.canvas.width;

		var hDiff = this.canvWidth / sm.canvas.width;
		var vDiff = this.canvHeight / sm.canvas.height;

		var canHDiff = sm.canvas.width/ this.worldWidth;
		var canVDiff = sm.canvas.height / this.worldHeight;

		sm.ctx.setTransform(
			hDiff * canHDiff,
			0,
			0,
			vDiff * canVDiff,
			canvas.width / 2 + this.canvPos.x,
			canvas.height / 2 + this.canvPos.y
		);

		var worldFlip = cpyVec(pos);
		worldFlip.y = -worldFlip.y;
		sm.gfx.setStrokeColor(Color.white);
		sm.gfx.drawPolygon(poly, worldFlip);
  }
}