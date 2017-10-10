var Sequence = function (name, length, actions, active) {
  this.name = name;
  this.progress = 0;   // 0 - 1
  this.elapsedTime = 0; // Seconds
  this.active = active;
  this.length = length;
  this.actions = actions;
};

var SequenceSegment = function (start, end, handle) {
  this.end = end;
  this.start = start;
  this.handle = handle;
};

var SSeq = {
  playSequence: function (seq) {
    seq.elapsedTime = 0;
    seq.progress = 0;
    seq.active = true;
  },
  
  stopSequence: function (seq) {
    seq.elapsedTime = 0;
    seq.progress = 0;
    seq.active = false;
  },
  
  pauseSequence: function (seq) {
    seq.active = false;
  },

  updateSequence: function (seq, delta) {
    if (seq.active) {
      seq.elapsedTime += delta;

      seq.progress = seq.elapsedTime / seq.length;

      if (seq.progress > 1) {
        seq.progress = 0;
        seq.active = false;
        seq.elapsedTime = 0;
      }

      seq.actions.forEach(function (action) {
        if ( (seq.progress > (action.start / seq.length)) && (seq.progress < (action.end / seq.length)) ) {
          action.handle( (seq.elapsedTime - action.start) / (action.end - action.start));
        }
      })
    }
  }
};