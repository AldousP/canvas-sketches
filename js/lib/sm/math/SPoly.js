'use strict';

var SPoly = {
  /**
   * Conversion constant for degrees-to-radians.
   */
  DEG_RAD: 57.2958,

  /**
   * Polygon class. Pts describing local position.
   * @param pts of the Polygon
   * @constructor
   */
  Polygon: function (pts) {
    this.pts = pts ? pts : [];
  },

  project: function (polygon, pos, axis) {
    var norm = SVec.normVec(SVec.cpyVec(axis));
    var min = SVec.dot(polygon.pts[0], norm);
    var max = min;

    for (var i = 0; i < polygon.pts.length; i++) {
      var pt = SVec.addVecVec(SVec.cpyVec(polygon.pts[i]), pos);
      var proj = SVec.dot(pt, norm);
      if (proj < min) {
        min = proj;
      }

      if (proj > max) {
        max = proj;
      }
    }

    return new SVec.Vector(min, max);
  },

  /**
   * Generate a new Polygon
   * @param vertCount the amount of vertices in the polygon
   * @param radius the radius of the polygon
   * @param startingDegree beginning rotation in radians
   * @param scaleX horizontal scaling
   * @param scaleY vertical scaling
   */
  generatePolygon: function (vertCount, radius, startingDegree, scaleX, scaleY) {
    startingDegree = startingDegree ? startingDegree : 0;
    var circDiv = (2 * Math.PI)  / vertCount;
    var polygon = new SPoly.Polygon();
    for (var i = 0; i < vertCount; i++ ) {
      polygon.pts.push(
          new SVec.Vector (
              (Math.cos(startingDegree + circDiv * i) * radius) * (scaleX ? scaleX : 1),
              (Math.sin(startingDegree + circDiv * i) * radius) * (scaleY ? scaleY : 1)
          )
      )
    }
    return polygon;
  },

  /**
   * Convenience method for generating a square for a given width.
   * @param width of the square
   * @returns a Polygon with four vertices at the designated width.
   */
  polySquare: function (width) {
    return this.generatePolygon(4, width / 2, 45 / this.DEG_RAD, 1.25, 1.2)
  },

  /**
   * Scale the contents of a polygon by a scalar vector
   * @param poly the polygon to scale
   * @param scalar the scaling value
   */
  scalePoly: function (poly, scalar) {
    poly.pts.forEach(function (pt) {
      SVec.multVec(pt, scalar);
    });
  },

  /**
   * Convenience method for generating a circle with the given radius.
   * @param radius of the circle
   * @returns a Polygon with thirty-two vertices and the designated radius.
   */
  polyCircle: function (radius) {
    return this.generatePolygon(32, radius, 45 / this.DEG_RAD, 1.25, 1.2)
  }
};