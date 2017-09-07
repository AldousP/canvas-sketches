function SystemProcessor() {
	'use strict';

	this.systems = [];

	this.addSystem = function (newSystem) {
    this.systems.push(newSystem);
	};

	this.process = function (entityMapper) {
	  var currentSystem;

	  // All systems.
    for (var i = 0; i < this.systems.length; i++) {
      currentSystem = this.systems[i];
	    var filter;
	    var matches = {};
	    var entityList = [];
	    var blankList = false;
	    var shortestName = '';
	    var shortestLength = -1;

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

		    	// Iterate over all the lists in the matching lists object..
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

		    if (allValuesPresent) {
			    for (var k = 0; k < shortest.length; k++) {
			    	currentSystem.process(shortest[k], this.fireEvent);
			    }
		    }
	    }
    }
	}

	this.fireEvent = function () {

	}
}