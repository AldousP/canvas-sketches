"use strict";

function SystemHandler() {
  this.systems = [];

  this.sortSystems = function () {
	this.systems.sort(function (a, b) {
	  return a.ID.localeCompare(b.ID);
	});
	renderLists();
  };

  this.updateSystems = function (delta, entityHandler) {
	this.systems.forEach(function (system) {
	  if (system.paused) {
		return;
	  }
	  var filters = system.componentFilter;
	  if (filters) {
		var sets = {};
		for (var i = 0; i < filters.length; i++) {
		  var filter = filters[i];
		  var set = entityHandler.entityMap[filter];
		  if (set) {
			sets[filter] = set;
		  } else {
			break;
		  }
		}

		var setsKeys = Object.keys(sets);
		if (setsKeys.length) {
		  setsKeys.sort(function (a, b) {
			return sets[a].length < sets[b].length;
		  });

		  var rootList = sets[setsKeys[0]];
		  var finalEntities = [];
		  rootList.forEach(function (value) {
			var valuePresent = false;
			for (var j = 1; j < setsKeys.length; j++) {
			  var comparisonSet = sets[setsKeys[j]];
			  valuePresent = comparisonSet.indexOf(value) > -1;
			  if (j < 1 && !valuePresent) {
				break;
			  }
			}

			if (valuePresent) {
			  finalEntities.push(value);
			}
		  });
		  system.pre();
		  finalEntities.forEach (function (entity) {
			system.processEntity(entityHandler.entities[entity]);
		  });
		  system.post();
		}
	  } else {
		var keys = Object.keys(entityHandler.entities);
		system.pre();
		keys.forEach(function (key) {
		  system.processEntity(entityHandler.entities[key]);
		});
		system.post();
	  }
	})
  };

  this.addSystem = function (system) {
	renderLists();
	this.systems.push(system);
	this.sortSystems();
  }
}