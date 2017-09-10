function EntityMapper() {
	'use strict';

	// Maps entity IDs to component type. The same entity may appear in multiple lists.
	this.map = {};
	// A list of all entities
	this.store = [];

	this.addEntity = function (newEntity) {
		console.log(newEntity);
		this.store.push(newEntity);
	};

	this.buildEntity = function (components) {
		var entity = new Entity();
		entity.ID = this.store.length;
		entity.components = {};
		this.injectComponents(entity, components);
		this.store.push(entity);
		return entity;
	};

	this.injectComponents = function (entity, components) {
		for (var i = 0; i < components.length; i++) {
			var comp = components[i];
			if (!this.map[comp.name]) {
				this.map[comp.name] = [];
			}
			this.map[comp.name].push(entity.ID);
			entity.components[comp.name] = comp;
		}
	}
}