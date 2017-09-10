"use strict";

function Entity (name) {
  this.ID = -1; // Set by a handler
  this.name = name ? name : "Entity"; // Set by entity
  this.components = {};
}