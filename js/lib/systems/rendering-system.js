"use strict";

function RenderingSystem(ID, camera, view) {
	this.ID = ID;
	this.name = "Rendering";
	this.view = view;
	this.camera = camera;

	this.componentFilter = [
		ComponentType.polygon,
		ComponentType.position
	];

	this.pre = function () {
		// sm.ctx.save();
		// ctx.save();
		// sm.ctx.beginPath();
		// sm.ctx.rect(
		// this.view.canvPos.x - this.view.canvWidth / 2,
		// this.view.canvPos.y - this.view.canvHeight / 2,
		// this.view.canvWidth,
		// this.view.canvHeight);
		// sm.ctx.clip();
		// sm.gfx.clear();
		// sm.ctx.lineWidth = ".025";
		// sm.gfx.setStrokeColor("#005500");
	};

	this.processEntity = function (entity) {
		sm.log.notify(entity.ID, "rendering");
		// ctx.strokeStyle = "#FFFFFF";
		// view.renderPoly(
		// 	entity.components[ComponentType.polygon].polygon,
		// 	entity.components[ComponentType.position].position,
		// 	worldCam
		// );
		// ctx.setStrokeColor();
	};

	this.post = function () {
		// sm.ctx.restore();
	};
}