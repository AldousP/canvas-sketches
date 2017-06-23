"use strict";

function Entity() {
  this.components = {};

  this.addComponent = function (component) {
	if (component.name && !this.components[component.name]) {
	  this.components[component.name] = component;
	}
  }
}
