"use strict";


function Vector(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.len = Math.sqrt((x * x) + (y * y));
}

function calcLen(vec) {
  vec.len = Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}

function setVec(vec, x, y) {
  vec.x = x;
  vec.y = y;
  calcLen(vec);
  return vec;
}

function setVecVec(vec1, vec2) {
  return setVec(vec1, vec2.x, vec2.y);
}

function cpyVec(vec) {
  return new Vector(vec.x, vec.y);
}

function sclVec(vec, scalar) {
  vec.x *= scalar;
  vec.y *= scalar;
  calcLen(vec);
  return vec;
}

function multVec(vec1, vec2) {
  vec1.x *= vec2.x;
  vec1.y += vec2.y;
  calcLen(vec);
  return vec1;
}

function addVecConst(vec, x, y) {
  vec.x += x;
  vec.y += y;
  calcLen(vec);
  return vec;
}

function rotVec(vec, rot) {
  if (!vec || rot === null) return;
  var currRot = Math.atan2(vec.y, vec.x);
  vec.x = Math.cos(currRot + rot * -1) * vec.len;
  vec.y = Math.sin(currRot + rot * -1) * vec.len;
  calcLen(vec);
  return vec;
}

function addVecVec(vec, vec2) {
  return addVecConst(vec, vec2.x, vec2.y);
}

function subVecVec(vec, vec2) {
  return addVecConst(vec, -vec2.x, -vec2.y);
}