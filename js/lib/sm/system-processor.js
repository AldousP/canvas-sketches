'use strict';

function SystemProcessor(handler) {
  this.systems = [];
  this.entityMapper = handler;
  this.tempArr = [];

  this.entitiesForIDs = function (IDs) {
    this.tempArr.length = 0;
    var that = this;
    IDs.forEach(function (ID) {
      that.tempArr.push(that.entityMapper.entities[ID]);
    });
    return this.tempArr;
  };

  this.fire = function (action) {
    this.entityMapper.fireAction(action);
  };

  this.processEntities = function (state, delta) {
    var entities = this.entityMapper.entities;
  	this.systems.forEach(function (system) {
  		if (system.pre) {
        if (!system.pre) return;
				system.pre(state);
			}
		});

  	var that = this;
    that.systems.forEach(function (system) {
      system.fireAction = that.fire.bind(that);
      for (var i = 0; i < entities.length; i ++) {
        if (!system.processEntity) return;
        system.processEntity(
            entities[i],
            state,
            delta,
            entities
        );
      }
    });

		this.systems.forEach(function (system) {
			if (system.post) {
        if (!system.post) return;
        system.post(state);
			}
		});

		this.entityMapper.processActions(delta);
  };

  this.addSystem = function (system) {
    system.processor = this;
  	if (system.type === SystemType.staticSystem) {
			this.systems.push(system);
		} else {
      this.systems.push(system);
    }
  };
}