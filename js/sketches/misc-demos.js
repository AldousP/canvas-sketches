function MiscDemos () {
  'use strict';
  this.conf = {
    name: 'Misc Demos',
    description: 'Random experiments.',
    date: '09.23.2017'
  };

  var BG_COLOR = SColor.colorForHex("#3e63bd");

  this.setup = function () {
    this.update(0, sm.gfx);
    var e = this.entities;
    var s = this.systems;


  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}