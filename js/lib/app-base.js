"use strict";

function drawPolygon(polygon, pos) {
  ctx.beginPath();
  if (!polygon.pts) {
	console.error('No property of name [pts] found on polygon parameter.');
  } else {
	var firstPt = polygon.pts[0];
	ctx.moveTo(firstPt.x + pos.x, firstPt.y + pos.y);
	polygon.pts.forEach(function (pt) {
	  if (pt !== firstPt) {
		ctx.lineTo(pt.x + pos.x, pt.y + pos.y);
	  }
	});
	ctx.lineTo(firstPt.x + pos.x, firstPt.y + pos.y);
  }
}

function copyState() {
  storedState = JSON.stringify(entityHandler.entities);
}

function restoreState() {
  entityHandler.entities = JSON.parse(storedState);
}
