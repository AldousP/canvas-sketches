var SequenceType = {
  NORMAL: 0,
  PING_PONG: 1,
  REVERSED: 2
};

function SequenceSystem (conf) {
	this.name = 'sequence-system';
	this.conf = conf;

	var keys = Object.keys(conf);
	keys.forEach(function (key) {
	  var sequence = conf[key];
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
              active: true,
              complete: false
            }
          }

          if (!ent_seq.state.complete) {
            var handler = this.conf[ent_seq.name];
            if (ent_seq.playing && ent_seq.state.elapsedTime < handler.length) {
              ent_seq.state.elapsedTime += delta;
            } else {
              ent_seq.state.elapsedTime = 5;
              ent_seq.state.complete = true;
            }
            ent_seq.state.progress = ent_seq.state.elapsedTime / handler.length;

            var action;
            for (var ll = 0; ll < handler.sequence.length; ll++) {
              action = handler.sequence[ll];
              if (action.start >= 0 && !action.end) {
                if (ent_seq.state.elapsedTime > action.start) {
                  if (ent_seq.state.elapsedTime - delta <= action.start) {
                    action.handle(entity);
                  }
                }
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

    // if (seq) {
    //   var that = this;
    //   seq.forEach(function (sequence) {
    //     var actions = that.sequenceActions[sequence.name];
    //     if (!actions) {
    //       actions = {};
    //     }
    //
    //
    //
    //     if (!sequence.type) {
    //       sequence.type = SequenceType.NORMAL;
    //     }
    //     sequence.pos = ((sequence.length * sequence.pos) + delta * sequence.dir) / sequence.length;
    //
    //     if (sequence.pos > 1) {
    //       if (actions && actions.complete ) {
    //         actions.complete(entity)
    //       }
    //
    //       switch (sequence.type) {
    //         case SequenceType.NORMAL:
    //           sequence.pos -= 1;
    //           break;
    //         case SequenceType.PING_PONG:
    //           sequence.pos = 1 - (sequence.pos - 1);
    //           sequence.dir = sequence.dir ? sequence.dir * -1 : -1
    //       }
    //     }
    //
    //     if (sequence.pos < 0) {
    //       switch (sequence.type) {
    //         case SequenceType.PING_PONG:
    //           if (actions && actions.complete ) {
    //             actions.complete(entity)
    //           }
    //           sequence.pos = Math.abs(sequence.pos);
    //           sequence.dir = sequence.dir ? sequence.dir * -1 : -1
    //       }
    //     }
    //
    //     var result = sequence.pos;
    //     if (sequence.easing && easers[sequence.easing]) {
    //       result = easers[sequence.easing](sequence.pos);
    //     }
    //
    //     if (actions && actions.update ) {
    //       actions.update(entity, result)
    //     }
    //   });
    // }
	};
}