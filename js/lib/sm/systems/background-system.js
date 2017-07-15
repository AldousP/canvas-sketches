"use strict";

function BackgroundSystem(ID) {
	this.ID = ID;
	this.name = "Background";
	this.type = SystemType.staticSystem;

	this.pre = function (state) {
		sm.gfx.clear(state.bgColor);
		if (sm.conf.debug.active) {
      sm.gfx.setStrokeColor(Color.white);
      sm.gfx.drawLine(-sm.gfx.width, 0, sm.gfx.width, 0);
      sm.gfx.drawLine(0, -sm.gfx.height, 0, sm.gfx.height);
    }
	};
}