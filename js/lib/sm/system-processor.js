"use strict";

function SystemProcessor(handler) {
  this.entitySystems = [];
  this.staticSystems = [];
  this.entityHandler = handler;
  this.tempArr = [];

  this.entitiesForIDs = function (IDs) {
    this.tempArr.length = 0;
    var that = this;
    IDs.forEach(function (ID) {
      that.tempArr.push(that.entityHandler.entities[ID]);
    });
    return this.tempArr;
  };

  this.processEntities = function (entities, state, delta) {
  	this.staticSystems.forEach(function (system) {
  		if (system.pre) {
				system.pre(state);
			}
		});

  	var that = this;
    that.entitySystems.forEach(function (system) {
      for (var i = 0; i < entities.length; i ++) {
        system.processEntity(entities[i], state, delta);
      }
    });

		this.staticSystems.forEach(function (system) {
			if (system.post) {
				system.post(state);
			}
		});
  };

  this.addSystem = function (system) {
    system.processor = this;
  	if (system.type === SystemType.staticSystem) {
			this.staticSystems.push(system);
		} else {
      this.entitySystems.push(system);
    }
  };
}