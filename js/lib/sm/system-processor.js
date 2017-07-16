'use strict';

function SystemProcessor(handler) {
  this.entitySystems = [];
  this.staticSystems = [];
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
  	this.staticSystems.forEach(function (system) {
  		if (system.pre) {
				system.pre(state);
			}
		});

  	var that = this;
    that.entitySystems.forEach(function (system) {
      system.fireAction = that.fire.bind(that);
      for (var i = 0; i < entities.length; i ++) {
        // sm.gfx.preDraw();
        system.processEntity(
            entities[i],
            state,
            delta,
            entities,
            system.extractors ? system.extractors : null
        );
        // sm.gfx.postDraw();
      }
    });

		this.staticSystems.forEach(function (system) {
			if (system.post) {
        system.post(state);
			}
		});

		this.entityMapper.processActions(delta);
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