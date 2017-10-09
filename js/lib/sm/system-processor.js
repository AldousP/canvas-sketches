function SystemProcessor() {
	'use strict';

	this.systems = [];
	this.systemNames = [];
	this.eventStore = new EventStore();
	
	this.disableSystems = function (systems) {
	  var that = this;
	  systems.forEach(function (system) {
	    var index = that.systemNames.indexOf(system);
	    if (index !== -1) {
        that.systems[index].disabled = true;
        console.log(that.systems[index]);
      }
    })
  };

  this.enableSystems = function (systems) {
    var that = this;
    systems.forEach(function (system) {
      var index = that.systemNames.indexOf(system);
      if (index !== -1) {
        that.systems[index].disabled = false;
      }
    })
  };

	this.addSystem = function (newSystem, entityMapper) {
	  if (this.systemNames.indexOf(newSystem.name) > -1) {
	    sm.log.error('Skipping non unique system name: ' + newSystem.name,'systems');
    } else {
      this.systems.push(newSystem);
      this.systemNames.push(newSystem.name);

      if (newSystem.setup) {
        newSystem.setup(entityMapper);
      }
    }
	};

	this.process = function (entityMapper, delta) {
	  var currentSystem;

    // All user-systems.
    for (var i = 0; i < this.systems.length; i++) {
      currentSystem = this.systems[i];
      if (!currentSystem.disabled) {
        this.eventStore.cullSystemEvents(currentSystem.name, delta);

        var filter;
        var matches = {};
        var blankList = false;
        var shortestName = '';
        var shortestLength = -1;

        if (currentSystem.filter && currentSystem.filter.length > 0) {
          // System  Filters
          for (var j = 0; j < currentSystem.filter.length; j ++) {
            filter = currentSystem.filter[j];
            matches[filter] = entityMapper.map[filter];

            // Skip this system if any filters yield blank entity lists.
            if (!matches[filter]) {
              blankList = true;
              break;
            }

            if (shortestLength === -1 || matches[filter].length < shortestLength) {
              shortestLength = matches[filter].length;
              shortestName = filter;
            }
          }

          if (!blankList) {
            var shortest = entityMapper.map[shortestName];
            var allValuesPresent = true;

            // List of values in the shortest list. Our root comparator.
            for (var k = 0; k < shortest.length; k++) {
              var currShortest = shortest[k];
              var keys = Object.keys(matches);
              var comparingList;

              // Iterate over all the lists in the matching lists object.
              for (var l = 0; l < keys.length; l++) {
                comparingList = entityMapper.map[keys[l]];
                // Don't check list if it is the root list.
                if (comparingList !== shortestName) {
                  if (comparingList.indexOf(currShortest) < 0) {
                    allValuesPresent = false;
                    break;
                  }
                }
              }
            }

            // Process list if all values in the shortest list
            // exist in all required filter lists
            if (allValuesPresent) {
              this.processEntityList(currentSystem, shortest, entityMapper, delta);
            }
          }
        } else {
          this.processEntityList(currentSystem, entityMapper.entity_IDs, entityMapper, delta);
        }

        this.processEvents(currentSystem, entityMapper, delta)
      }
    }

    entityMapper.deleteQueue();
    this.eventStore.cullSystemEvents('global', delta);
  };

  /**
   * Runs a list of entity IDs through through the provided system's process function and event listeners.
   */
  var tempStore = [];
	this.processEntityList = function (system, list, mapper, delta) {
	  tempStore = [];
    for (var i = 0; i < list.length; i++) {
      var temp = mapper.store[list[i]];
      tempStore.push(temp);
    }

    if (system.process) {
      system.process(
        tempStore,
        this.fireSystemEvent.bind(system),
        delta,
        mapper
      );
    }
  };

  this.processEvents = function (system, mapper, delta) {
    /**
     * Fire the system's event listeners.
     */
    if (system.listeners) {
      var eventKeys = Object.keys(system.listeners);
      var eventListener;
      for (var i = 0; i < eventKeys.length; i++) {
        eventListener = system.listeners[eventKeys[i]];
        var queuedEventsIDs = this.eventStore.eventTypeMap[eventListener.type];
        if (queuedEventsIDs && this.eventStore.eventCount) {
          for (var j = 0; j < queuedEventsIDs.length; j++) {
            var eventInQueue = this.eventStore.events[queuedEventsIDs[j]];

            /**
             * Don't react to events fired by this system.
             */
            if (eventInQueue && eventInQueue.src !== system.name) {
              /**
               * Fire the event handler and pass it the target entity.
               */
              if (
                eventInQueue.targetID !== -1
                && mapper.store[eventInQueue.targetID]
              ) {
                eventListener.handle(
                  eventInQueue.data,
                  mapper.store[eventInQueue.targetID],
                  delta,
                  mapper,
                  this.fireEvent,
                  eventInQueue.type
                );
              } else {
                eventListener.handle(eventInQueue.data, null, delta, mapper, this.fireEvent, eventInQueue.type);
              }
            }
          }
        }
      }
    }
  };

	var that = this;
	this.fireSystemEvent = function (target, type, payload, timer) {
    return that.eventStore.fireEvent(target, type, payload, this.name, timer);
  };

  this.fireEvent = function (target, type, payload, timer) {
    return that.eventStore.fireEvent(target, type, payload, 'global', timer);
  }
}