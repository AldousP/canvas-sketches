"use strict";

/**
 * Generate a new Polygon
 * @param vertCount
 * @param radius
 * @param startingDegree
 */
function generatePolygon(vertCount, radius, startingDegree) {
  startingDegree = startingDegree ? startingDegree : 0;
  var circDiv = (2 * Math.PI)  / vertCount;
  var polygon = new Polygon();
  for (var i = 0; i < vertCount; i++ ) {
	polygon.pts.push(
		new Vector (
			Math.cos(startingDegree + circDiv * i) * radius,
			Math.sin(startingDegree + circDiv * i) * radius
		)
	)
  }
  return polygon;
}

// Geometry Classes
function Polygon() {
  this.pts = [];
}