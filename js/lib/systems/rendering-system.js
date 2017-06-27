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

	this.pre = function (state) {
		sm.ctx.save();
		sm.ctx.beginPath();
		sm.ctx.rect(
		this.view.canvPos.x - this.view.canvWidth / 2,
		this.view.canvPos.y - this.view.canvHeight / 2,
		this.view.canvWidth,
		this.view.canvHeight);
		sm.ctx.clip();
		sm.gfx.clear(state.bgColor);
	};

	this.processEntity = function (entity, state) {
		sm.gfx.setStrokeColor(Color.white);
		var poly = entity.components[ComponentType.polygon].polygon;
		var pos = entity.components[ComponentType.position].position;
		this.view.renderPoly(poly, pos, this.worldCam);
	};

	this.post = function () {
		sm.ctx.restore();
	};
}