function EventStore() {
	'use strict';

	this.events = [];
	this.systemEventMap = {};
	this.eventTypeMap = {};
	
	this.fireEvent = function (target, type, payload, source) {
		if (!this.systemEventMap[source]) {
			this.systemEventMap[source] = [];
		}

    if (!this.eventTypeMap[type]) {
      this.eventTypeMap[type] = [];
    }

    this.eventTypeMap[type].push(this.events.length);
		this.systemEventMap[source].push(this.events.length);

		this.events.push({
			eventID: this.events.length,
			targetID: target,
			type: type,
			data: payload,
			src: source
		});
	};
	
	this.cullSystemEvents = function (source) {
    if (!this.systemEventMap[source]) return;
		for (var i = 0; i < this.systemEventMap[source].length; i++) {
      var eventList = this.events.splice(this.systemEventMap[source][i].ID, 1);
      if (eventList) {
        for (var j = 0; j < eventList.length; j++) {
          var result = eventList[j];
            this.eventTypeMap[result.type].splice(this.eventTypeMap[result.type].indexOf(result.eventID), 1);
            this.systemEventMap[result.src].splice(this.systemEventMap[result.src].indexOf(result.eventID), 1);
        }
			}
		}
		this.systemEventMap[source] = [];
  }
}