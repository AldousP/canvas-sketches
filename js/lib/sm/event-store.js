function EventStore() {
	'use strict';

	this.events = [];
	this.systemEventMap = {};
	this.eventTypeMap = {};

	this.pooledEventsByType = {};

	this.fireEvent = function (target, type, payload, source, timerData) {
		if (!this.systemEventMap[source]) {
			this.systemEventMap[source] = [];
		}

    if (!this.eventTypeMap[type]) {
      this.eventTypeMap[type] = [];
    }

    this.eventTypeMap[type].push(this.events.length);
		this.systemEventMap[source].push(this.events.length);

		var event;
		if (this.pooledEventsByType[type] && this.pooledEventsByType[type].length) {
			event = this.pooledEventsByType[type].pop();
      event.targetID = this.events.length;
      event.src = source;
      event.data = payload;
      this.events.push(event);
		} else {
			this.events.push({
				eventID: this.events.length,
				targetID: target,
				type: type,
				data: payload,
				src: source
			});
		}

		event = this.events[this.events.length - 1];
		event.meta = {};

		if (timerData) {
      event = this.events[this.events.length - 1];
      event.meta = {
        elapsed: 0,
        length: timerData.length
      }
    }
	};

  this.cullSystemEvents = function (source, delta) {
    if (!this.systemEventMap[source]) return;
    for (var i = 0; i < this.systemEventMap[source].length; i++) {
      var eventList = this.systemEventMap[source];
      for (var j = 0; j < eventList.length; j++) {
        var result = this.events[j];
        if (result.meta.length) {
          result.meta.elapsed += delta;
          if (result.meta.elapsed > result.meta.length) {
            this.removeEvent(result)
          }
        } else {
          this.removeEvent(result);
        }
      }
    }
  };

  this.removeEvent = function (event) {
    this.eventTypeMap[event.type].splice(this.eventTypeMap[event.type].indexOf(event.eventID), 1);
    this.systemEventMap[event.src].splice(this.systemEventMap[event.src].indexOf(event.eventID), 1);
    event.targetID = -1;
    event.src = undefined;
    if (!this.pooledEventsByType[event.type]) {
      this.pooledEventsByType[event.type] = [];
    }
    this.pooledEventsByType[event.type].push(event);
  }
}