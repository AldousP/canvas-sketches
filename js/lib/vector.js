"use strict";


function Vector(x, y) {
  this.x = x ? x : 0;
  this.y = y ? y : 0;
  this.len = Math.sqrt((x * x) + (y * y));
}

function setVec(vec, x, y) {
  vec.x = x;
  vec.y = y;
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
  return vec;
}

function multVec(vec1, vec2) {
  vec1.x *= vec2.x;
  vec1.y += vec2.y;
  return vec1;
}

function addVecConst(vec, x, y) {
  vec.x += x;
  vec.y += y;
  return vec;
}

function addVecVec(vec, vec2) {
  return addVecConst(vec, vec2.x, vec2.y);
}

function subVecVec(vec, vec2) {
  return addVecConst(vec, -vec2.x, -vec2.y);
}