"use strict";

function BackgroundSystem(ID, camera, view) {
	this.ID = ID;
	this.name = "Background";
	this.type = SystemType.staticSystem;

	this.pre = function (state) {
		sm.gfx.preDraw();
		sm.gfx.clear(state.bgColor);
		sm.gfx.postDraw();
	};
}