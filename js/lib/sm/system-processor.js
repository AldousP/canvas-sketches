function SystemProcessor() {
	'use strict';

	this.systems = [];
	this.systemNames = [];
	this.eventStore = new EventStore();

	this.addSystem = function (newSystem) {
	  if (this.systemNames.indexOf(newSystem.name) > -1) {
	    sm.log.error('Skipping non unique system name: ' + newSystem.name,'systems');
    } else {
      this.systems.push(newSystem);
      this.systemNames.push(newSystem.name)
    }
	};

	this.process = function (entityMapper) {
	  var currentSystem;

	  // All user-systems.
    for (var i = 0; i < this.systems.length; i++) {
      currentSystem = this.systems[i];
      this.eventStore.cullSystemEvents(currentSystem.name);

	    var filter;
	    var matches = {};
	    var blankList = false;
	    var shortestName = '';
	    var shortestLength = -1;

	    if (currentSystem.filter.length === 0) {
	      for (var j = 0; j < entityMapper.store.length; j++) {
          currentSystem.process(
            entityMapper.store[j],
            this.fireSystemEvent.bind(currentSystem)
          );
        }
	      return;
      }

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
			    for (k = 0; k < shortest.length; k++) {
			    	currentSystem.process(
			    		entityMapper.store[shortest[k]],
              this.fireSystemEvent.bind(currentSystem)
				    );
			    }
		    }
	    }
    }
	};

	var that = this;
	this.fireSystemEvent = function (target, payload) {
	  that.eventStore.fireEvent(target, payload, this.name);
  }
}