"use strict";

function RenderTestSystem(ID, camera, view) {
	this.ID = ID;
	this.name = "Rendering";
	this.view = view;
	this.camera = camera;

	this.pre = function (state) {
		sm.gfx.setFillColor(Color.white);
		sm.gfx.setStrokeColor(Color.white);
		sm.gfx.drawRect(0, 0, 25, 25, false);
		sm.gfx.drawRect(0, 0, 50, 50, false, Align.center);
		sm.gfx.text(true, "(0, 0)", 0, 0, 8);
		sm.gfx.setStrokeWidth(2.5);
		sm.gfx.drawCircle(0, 0, 100);
		sm.gfx.setStrokeWidth(1.5);
		sm.gfx.drawCircle(0, 0, 75);
		sm.gfx.setStrokeWidth(1);
		sm.gfx.drawCircle(0, 0, 50);
	};

	this.processEntity = function (entity) {

	};

	this.post = function () {

	};
}