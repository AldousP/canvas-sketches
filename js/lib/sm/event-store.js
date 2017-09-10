function EventStore() {
	'use strict';

	this.events = [];
	this.systemEventMap = {};
	
	this.fireEvent = function (target, payload, source) {
		// console.log('Firing Event!:', target, payload, source);
		if (!this.systemEventMap[source]) {
			this.systemEventMap[source] = [];
		}

		this.systemEventMap[source].push(this.events.length);

		this.events.push({
			eventID: this.events.length,
			targetID: target,
			data: payload,
			src: source
		})
	};
	
	this.cullSystemEvents = function (source) {
		if (!this.systemEventMap[source]) return;
		for (var i = 0; i < this.systemEventMap[source].length; i++) {
      this.events.splice(this.systemEventMap[i], 1);
		}
		this.systemEventMap[source] = [];
  }
}