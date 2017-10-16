function EventStore() {
	'use strict';

	this.events = {};
	this.systemEventMap = {};
	this.eventTypeMap = {
	  _all: []
  };
	this.pooledEventsByType = {};
	this.eventCount = 0;
	this.blankIDS = [];

  // Used rather than an index, to avoid spillage bugs.
	this.eventID = 0;

  var that = this;

	this.fireEvent = function (target, type, payload, source, timerData) {
    this.eventCount ++;
    this.eventID ++;

    var event;
    if (this.pooledEventsByType[type] && this.pooledEventsByType[type].length) {
      event = this.pooledEventsByType[type].pop();
      event.eventID = this.eventID;
      event.targetID = target;
      event.src = source;
      event.data = payload;
    } else {
      event = {
        eventID: this.eventID,
        targetID: target,
        type: type,
        data: payload,
        src: source
      };
    }

    this.events[this.eventID] = event;
    event.meta = {};
    if (timerData) {
      event.meta = {
        elapsed: 0,
        length: timerData.length
      }
    }

    if (!this.systemEventMap[source]) {
			this.systemEventMap[source] = [];
		}

    if (!this.eventTypeMap[type]) {
      this.eventTypeMap[type] = [];
    }

    this.eventTypeMap[type].push(event.eventID);
    this.eventTypeMap['_all'].push(event.eventID);
		this.systemEventMap[source].push(event.eventID);

    return event.eventID;
	};

  this.removeEventByID = function (ID) {
    var event = this.events[ID];
    this.events[ID] = undefined;

    var eventsByType = this.eventTypeMap[event.type];
    eventsByType.splice(eventsByType.indexOf(event.eventID), 1);

    this.eventTypeMap._all.splice(this.eventTypeMap._all.indexOf(event.eventID), 1);

    this.eventCount--;
    this.blankIDS.push(event.eventID);
    this.poolEvent(event);
  };


  /**
   * Removes all events originating from the provided scope.
   */
  this.cullSystemEvents = function (source, delta) {
    var eventsForSystem = this.systemEventMap[source];
    if (eventsForSystem) {
      eventsForSystem.forEach(function (ID) {
        that.removeEventByID(ID);
      });
      this.systemEventMap[source] = [];
    }
  };

  this.poolEvent = function (event) {
    event.ID = undefined;
    event.eventID = undefined;
    event.meta = {};
    event.src = undefined;
    event.targetID = undefined;
    event.data = undefined;
    if (!that.pooledEventsByType[event.type]) {
      that.pooledEventsByType[event.type] = [];
    }
    that.pooledEventsByType[event.type].push(event);
  }
}