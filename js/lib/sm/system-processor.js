'use strict';

function SystemProcessor(handler) {
  this.systems = [];
  this.entityMapper = handler;
  this.tempArr = [];
  this.systemNameList = [];

  this.entitiesForIDs = function (IDs) {
    this.tempArr.length = 0;
    var that = this;
    IDs.forEach(function (ID) {
      that.tempArr.push(that.entityMapper.entities[ID]);
    });
    return this.tempArr;
  };

  this.fireEvent = function (event) {
    console.log('!')
  };

  this.processEntities = function (state, delta) {
    if (state && !state.systemStates) {
      state.systemStates = {};
    }

    var systemStates = state.systemStates;
    var entities = this.entityMapper.entities;
  	this.systems.forEach(function (system) {
  	  if (!systemStates[system.name]) {
  	    systemStates[system.name] = {};
      }

  		if (system.pre) {
				system.pre(systemStates[system.name]);
			}
		});

  	var that = this;
    that.systems.forEach(function (system) {
      system.fireEvent = that.fireEvent.bind(that);
      for (var i = 0; i < entities.length; i ++) {
        if (!system.processEntity) return;
        system.processEntity(
            entities[i],
            systemStates[system.name],
            delta,
            entities
        );
      }
    });

		this.systems.forEach(function (system) {
			if (system.post) {
        system.post(systemStates[system.name]);
			}
		});

		this.entityMapper.processActions(delta);
  };

  this.addSystem = function (system) {
    system.processor = this;

    if (this.systemNameList.indexOf(system.name) !== -1) {
      sm.log.error('Duplicate system name declaration! : ' +  system.name, 'sysproc');
    }

    system.act = function (action, id, payload) {
      var actions = Object.keys(system.actions);
      actions.forEach(function ( actionName ) {
        if (actionName === action) {
          var actionInstance = system.actions[actionName];
          var entity = system.processor.entityMapper.entities[id];
          var components = {};
          actionInstance.components.forEach(function ( component ) {
            if (entity.components[component]) {
              components[component] = entity.components[component];
            }
          });

          actionInstance.method(components, payload);
        }
      });
    };

    this.systemNameList.push(system.name);
    this.systems.push(system);
  };
}