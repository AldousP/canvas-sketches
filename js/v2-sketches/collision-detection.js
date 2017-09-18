'use strict';

function CollisionDetection () {
  this.conf = {
    name: 'Collision Detection',
    description: 'SAT Collision Detection',
    date: '09.17.2017'
  };

  var BG_COLOR = "#894e6d";
  var base_radius = 32;
  var gravity = -45;

  var root;
  var box;
  this.setup = function () {

    box = this.entities.buildEntity(
      [
        new TransformComponent(0, 128),
        new VelocityComponent(0, 0),
        new AccelerationComponent(0, gravity),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polySquare(base_radius * 2))
      ], [], ['box']);

    var floor = this.entities.buildEntity(
      [
        new TransformComponent(0, -128),
        new VelocityComponent(0, 0),
        new AccelerationComponent(0, 0),
        new RenderableComponent(),
        new PolygonComponent(
          SPoly.scalePolyConst(SPoly.polySquare(base_radius * 2), 16, 1))
      ], [], ['floor']);

    root = this.entities.buildEntity(
      [
        new TransformComponent(0, 0),
        new RenderRoot(),
        new RenderableComponent()
      ], [box.ID, floor.ID ], ['scene_root']);

    this.systems.addSystem(new RenderingSystem());
    this.systems.addSystem(new CollisionSystem([
      {
        a: 'box',
        b: 'floor',
        handle: function (data) {
          
        }
      }
    ]));
    this.systems.addSystem(new VelocitySystem());
  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
    // box.components[ComponentType.transform].rotation += Math.PI / 8 * delta;
  };
}

