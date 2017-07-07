"use strict";

function BackgroundSystem(ID) {
	this.ID = ID;
	this.name = "Background";
	this.type = SystemType.staticSystem;

	this.pre = function (state) {
		// sm.log.notify("Background Rendering...", this.name);
		sm.gfx.preDraw();
		sm.gfx.clear(state.bgColor);
		sm.gfx.postDraw();
	};
}