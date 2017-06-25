"use strict";

function RenderTestSystem(ID, camera, view) {
	this.ID = ID;
	this.name = "Rendering";
	this.view = view;
	this.camera = camera;

	this.pre = function (state) {
		var viewPortW = sm.canvas.width;
		var viewPortH = sm.canvas.height;
		sm.gfx.setFillColor("#FFFFFF");
		sm.gfx.setStrokeColor("#FFFFFF");
		sm.gfx.drawRect(0, 0, 50, 50, false);
		sm.gfx.setStrokeColor(Color.green);
		sm.gfx.drawRect(0, 0, 50, 50, false, Align.center);
		sm.gfx.text(true, "Sample Text", 0, 0, 16);
		sm.gfx.setStrokeColor(Color.white);
		sm.gfx.text(false, viewPortW, - viewPortW / 4, viewPortH / 4);
		sm.gfx.text(false, viewPortH, - viewPortW / 3, viewPortH / 3);
		sm.gfx.setStrokeWidth(2.5);
		sm.gfx.drawCircle(0, 0, 100);
		sm.gfx.setStrokeWidth(1.5);
		sm.gfx.drawCircle(0, 0, 75);
		sm.gfx.setStrokeWidth(1);
		sm.gfx.drawCircle(0, 0, 50);
		sm.gfx.drawLine(viewPortW / 2, viewPortH / 4, -viewPortW / 2, viewPortH / 4);
		sm.gfx.drawLine(-viewPortW / 3, -viewPortH / 2, -viewPortW / 3, viewPortH / 2);
		sm.gfx.drawImage(state.sawTooth, 0 , 0, 64, 64, Align.center);
	};

	this.processEntity = function (entity) {

	};

	this.post = function () {

	};
}