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
  	entities.forEach(function (entity) {
			that.entitySystems.forEach(function (system) {
				system.processEntity(entity, state, delta);
			});
		});

		this.entitySystems.forEach(function (system) {

		});

		this.staticSystems.forEach(function (system) {
			if (system.post) {
				system.post(state);
			}
		});

		// this.systems.forEach(function (system) {
		// 	if (system.paused) {
		// 		return;
		// 	}
		// 	var filters = system.componentFilter;
		// 	if (filters) {
		// 		var sets = {};
		// 		for (var i = 0; i < filters.length; i++) {
		// 			var filter = filters[i];
		// 			var set = entityHandler.entityMap[filter];
		// 			if (set) {
		// 				sets[filter] = set;
		// 			} else {
		// 				break;
		// 			}
		// 		}
		//
		// 		var setsKeys = Object.keys(sets);
		// 		if (setsKeys.length) {
		// 			setsKeys.sort(function (a, b) {
		// 				return sets[a].length < sets[b].length;
		// 			});
		//
		// 			var rootList = sets[setsKeys[0]];
		// 			var finalEntities = [];
		// 			rootList.forEach(function (value) {
		// 				var valuePresent = false;
		// 				// console.log("Comparing : " + rootList);
		// 				// console.log(setsKeys);
		//
		// 				for (var j = 1; j < setsKeys.length; j++) {
		// 					var comparisonSet = sets[setsKeys[j]];
		// 					valuePresent = comparisonSet.indexOf(value) > -1;
		// 					if (j < 1 && !valuePresent) {
		// 						break;
		// 					}
		// 				}
		//
		// 				// console.log( "system: " + system.name);
		// 				// console.log( value);
		// 				// console.log( valuePresent);
		// 				if (valuePresent) {
		// 					finalEntities.push(value);
		// 				}
		// 			});
		// 			system.pre(state);
		//
		// 			finalEntities.forEach (function (entity) {
		//
		// 				system.processEntity(entityHandler.entities[entity], delta, state);
		// 			});
		// 			system.post(state);
		// 		}
		// 	} else {
		// 		var keys = Object.keys(entityHandler.entities);
		// 		system.pre(state);
		// 		keys.forEach(function (key) {
		// 			system.processEntity(entityHandler.entities[key], delta, state);
		// 		});
		// 		system.post(state);
		// 	}
		// })


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