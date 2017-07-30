'use strict';

var SequenceType = {
  NORMAL: 0,
  PING_PONG: 1,
  REVERSED: 2
};


function SequenceSystem(sequenceActions) {
	this.name = 'sequencing';
	this.sequenceActions = sequenceActions ? sequenceActions : {};
	
	this.pre = function () {

	};

  /**
   * Iterates over every entity with a sequence component and
   * updates the current alpha of the sequence based on user-defined
   * fields.
   */
	this.processEntity = function (entity, state, delta, entities) {
    var seq = smx.sequence(entity);
    if (seq) {
      var that = this;
      seq.forEach(function (sequence, i) {
        if (!sequence.dir) {
          sequence.dir = 1;
        }
        sequence.pos = ((sequence.length * sequence.pos) + delta * sequence.dir) / sequence.length;

        if (sequence.pos > 1) {
          switch (sequence.type) {
            case SequenceType.NORMAL:
              sequence.pos -= 1;
              break;
            case SequenceType.PING_PONG:
              sequence.dir = sequence.dir ? sequence.dir * -1 : -1
          }
        }

        if (sequence.pos < 0) {
          switch (sequence.type) {
            case SequenceType.PING_PONG:
              sequence.dir = sequence.dir ? sequence.dir * -1 : -1
          }
        }

        if (that.sequenceActions && that.sequenceActions[sequence.name]) {
          var result = sequence.pos;
          if (sequence.easing) {
            result = that.sequenceActions.easers[sequence.easing](sequence.pos);
          }
          that.sequenceActions[sequence.name].update(entity, result)
        }
      });
	  }
  };

	this.post = function () {

	};

	this.handlers = {

  };

}
