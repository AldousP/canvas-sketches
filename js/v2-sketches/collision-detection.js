'use strict';

function CollisionDetection () {
  this.conf = {
    name: 'CollisionDetection',
    description: 'SAT Collision Detection',
    date: '09.17.2017'
  };

  var BG_COLOR = "#894e6d";
  var base_radius = 32;
  var gravity = -25;

  var root;
  this.setup = function () {
    root = this.entities.buildEntity(
      [
        new TransformComponent(0, 128),
        new VelocityComponent(0, 0),
        new AccelerationComponent(0, gravity),
        new RenderRoot(),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polySquare(base_radius * 2))
      ], [], ['scene_root']);

    this.systems.addSystem(new RenderingSystem());
    this.systems.addSystem(new CollisionSystem());
    this.systems.addSystem(new VelocitySystem());
  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
    root.components[ComponentType.transform].rotation += Math.PI / 8 * delta;
  };
}

