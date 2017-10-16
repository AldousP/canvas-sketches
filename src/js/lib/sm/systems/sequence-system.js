var SequenceType = {
  NORMAL: 0,
  PING_PONG: 1,
  REVERSED: 2,
  NORMAL_LOOPING: 3
};

function SequenceSystem (conf) {

  this.eventForSystem = {};
	this.name = 'sequence-system';
	this.conf = conf;
  var keys = Object.keys(conf);
  var that = this;

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
              active: ent_seq.startActive
            }
          }

          if (ent_seq.state && ent_seq.state.active) {
            var handler = this.conf[ent_seq.name];
            var reset = false;

            if (ent_seq.state.elapsedTime < handler.length) {
              ent_seq.state.elapsedTime += delta;
            }

            if (ent_seq.state.elapsedTime > handler.length){
              ent_seq.state.elapsedTime = 0;
              ent_seq.state.progress = 0;

              if (ent_seq.type !== SequenceType.NORMAL_LOOPING) {
                ent_seq.state.active = false;
                reset = true;
              }
            }
            ent_seq.state.progress = ent_seq.state.elapsedTime / handler.length;

            var action;
            for (var ll = 0; ll < handler.sequence.length; ll++) {
              action = handler.sequence[ll];
              if (action.start < ent_seq.state.elapsedTime && ent_seq.state.elapsedTime < action.end) {
                var length = (action.end - action.start);
                var alpha = (ent_seq.state.elapsedTime - action.start) / length;
                action.handle(entity, alpha);
              } else if (ent_seq.state.elapsedTime - delta <= action.end) {
                action.handle(entity, 1);
              }
            }
          }
        }
      }
    }
	};

  this.listeners = {
    _all: {
      type: '_all',
      handle: function (data, target, delta, mapper, fire, type) {
        var sequenceEntities = mapper.map[ComponentType.sequence];
        var affectedSequences = that.eventForSystem[type];

        if (affectedSequences) {
          affectedSequences.forEach(function (sequence) {
            var entity;
            sequenceEntities.forEach(function (entityID) {
              entity = mapper.store[entityID];

              var sequences = EX.sequence(entity);
              sequences.forEach(function (entity_sequence) {

                if (entity_sequence.name === sequence) {
                  entity_sequence.state.active = true;
                }
              });

            })
          })
        }
      }
    }
  };

  this.processConf = function () {
    var seqKeys = Object.keys(that.conf);
    seqKeys.forEach(function (key) {
      var seq = conf[key];
      if (seq.startOn && seq.startOn.length) {
        for (var i = 0; i < seq.startOn.length; i++) {
          if (!that.eventForSystem[seq.startOn[i]]) {
            that.eventForSystem[seq.startOn[i]] = [];
          }
          that.eventForSystem[seq.startOn[i]].push(key);
        }
      }
    });
  };

  this.processConf();
}
