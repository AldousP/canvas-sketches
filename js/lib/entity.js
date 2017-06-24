"use strict";

function Entity() {
  this.ID = ''; // Set by a handler
  this.name = 'Entity'; // Set by entity
  this.components = {};
}

function addComponentToEntity(entity, component) {
  if (component.name && !entity.components[component.name]) {
    entity.components[component.name] = component;
  }
}

function buildEntity(name, components) {
  var entity = new Entity();
  entity.name = name;
  components.forEach(function (component) {
    entity.components[component.name] = component;
  });
  return entity;
}
