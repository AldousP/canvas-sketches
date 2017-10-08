var SequenceType = {
  NORMAL: 0,
  PING_PONG: 1,
  REVERSED: 2
};

function SequenceSystem (conf) {
	this.name = 'sequence-system';
	this.conf = conf;

  this.sequencesForEvents = {};
  this.listeners = {};

  var keys = Object.keys(conf);
  var that = this;
  keys.forEach(function (key) {
	  var sequence = conf[key];
	  sequence.startOn.forEach(function (event) {
      if (!that.sequencesForEvents[event]) that.sequencesForEvents[event] = [];
      that.sequencesForEvents[event].push(key);
	    that.listeners[event] = {
        type: event,
        handle: function (data, target, delta, mapper, fire) {
          var sequences = EX.sequence(target);
          if (sequences) {
            sequences.forEach(function (sequence) {
              if (that.sequencesForEvents[event].indexOf(sequence.name) !== -1) {
                sequence.state.active = true;
              }
            })
          }
        }
      }
    })
  });

	this.filter = [
		ComponentType.sequence
	];

  this.process = function (entities, fire, delta, mapper) {
	  var entity, entity_sequences, sequence;
		for (var i = 0; i < entities.length; i++) {
		  entity = entities[i];
      entity_sequences = EX.sequence(entity);
      for (var j = 0; j < entity_sequences.length; j++) {
        sequence = this.conf[entity_sequences[j]];
        for (var k = 0; k < entity_sequences.length; k++) {
          var ent_seq = entity_sequences[k];
          if (!ent_seq.state) {
            ent_seq.state = {
              progress: 0,    // 0 - 1
              elapsedTime: 0, // Seconds
              direction: 1,   // -1 or 1
              active: false
            }
          }

          if (ent_seq.state && ent_seq.state.active) {
            var handler = this.conf[ent_seq.name];
            var reset = false;
            if (ent_seq.state.elapsedTime < handler.length) {
              ent_seq.state.elapsedTime += delta;
            } else {
              ent_seq.state.elapsedTime = 0;
              ent_seq.state.progress = 0;
              ent_seq.state.active = false;
              reset = true;
            }
            ent_seq.state.progress = ent_seq.state.elapsedTime / handler.length;

            var action;
            for (var ll = 0; ll < handler.sequence.length; ll++) {
              action = handler.sequence[ll];
              if (action.start >= 0 && !action.end) {
                if (ent_seq.state.elapsedTime > action.start) {
                  if (ent_seq.state.elapsedTime - delta <= action.start) {
                    action.handle(entity, 0);
                  }
                }
              } else if (reset && handler.reset) {
                action.handle(entity, 0);
              } else if (action.start < ent_seq.state.elapsedTime && ent_seq.state.elapsedTime < action.end) {
                var length = (action.end - action.start);
                var alpha = (ent_seq.state.elapsedTime - action.start) / length;
                action.handle(entity, alpha);
              }
            }
          }
        }
      }
    }
	};
}