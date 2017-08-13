'use strict';

/**
 * Class definition for a Vector and common methods for operating on one or more Vectors.
 */

/**
 * Creates a Vector containing the given x & y.
 * Additionally, calculates a length field.
 *
 * @param x
 * @param y
 */
function Vector(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.len = Math.sqrt((x * x) + (y * y));
}

/**
 * For ease of logging.
 */
Vector.prototype.toString = function () {
  return this.x + ', ' + this.y;
};

/**
 * Global methods for Vector operations.
 * Returns references to Vector for chaining.
 * Every function triggers a calcLen() call which
 * recalculates the length of the Vector.
 */


/**
 * Sets the length field of the given Vector according to its x & y values.
 * @param vec
 */
function calcLen(vec) {
  vec.len = Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}

/**
 * Sets the x & y values of the given Vector to the provided constants.
 */
function setVec(vec, x, y) {
  vec.x = x;
  vec.y = y;
  calcLen(vec);
  return vec;
}

/**
 * Sets the x & y values of the given Vector to the values in the second Vector.
 */
function setVecVec(vec1, vec2) {
  return setVec(vec1, vec2.x, vec2.y);
}

/**
 * Returns a new Vector, as a copy of the provided Vector.
 */
function cpyVec(vec) {
  return new Vector(vec.x, vec.y);
}

/**
 * Scales the values of the provided Vector by the designated scalar.
 */
function sclVec(vec, scalar) {
  vec.x *= scalar;
  vec.y *= scalar;
  calcLen(vec);
  return vec;
}

/**
 * Multiplies the values of the first Vector by the second.
 */
function multVec(vec1, vec2) {
  vec1.x *= vec2.x;
  vec1.y *= vec2.y;
  calcLen(ve1);
  return vec1;
}

/**
 * Adds the provided constants to the provided Vector
 */
function addVecConst(vec, x, y) {
  vec.x += x;
  vec.y += y;
  calcLen(vec);
  return vec;
}

/**
 * Adds the contents of the second Vector to the first.
 */
function addVecVec(vec, vec2) {
  return addVecConst(vec, vec2.x, vec2.y);
}

/**
 * Subtracts the contents of the second Vector from the first.
 */
function subVecVec(vec, vec2) {
  return addVecConst(vec, -vec2.x, -vec2.y);
}

/**
 * Normalizes the provided Vector
 */
function normVec(vec) {
  vec.x /= vec.len;
  vec.y /= vec.len;
  calcLen(vec);
  return vec;
}

/**
 * Rotates the provided Vector's values by the provided rotation in radians.
 */
function rotVec(vec, rot) {
  if (!vec || rot === null) return;
  var currRot = Math.atan2(vec.y, vec.x);
  vec.x = Math.cos(currRot + rot * -1) * vec.len;
  vec.y = Math.sin(currRot + rot * -1) * vec.len;
  calcLen(vec);
  return vec;
}

/**
 * Returns a {x, y} pair object containing the interpolated value
 * between the provided Vectors at the designated alpha value.
 */
function lerpVec(vecA, vecB, alpha) {
  return {
    x: vecA.x + (vecB.x - vecA.x) * alpha,
    y: vecA.y + (vecB.y - vecA.y) * alpha
  }
}
