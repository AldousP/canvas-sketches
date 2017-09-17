'use strict';

function EntityTree () {
  this.conf = {
    name: 'Entity Tree',
    description: 'Entity Tree Demo',
    date: '09.17.2017'
  };

  var BG_COLOR = "#558956";
  var base_radius = 32;

  var root;
  this.setup = function () {
    root = this.entities.buildEntity(
      [
        new TransformComponent(0, 0),
        new VelocityComponent(.05, .15),
        new RenderRoot(),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polyCircle(base_radius))
      ],
      [
        this.entities.buildEntity([
          new TransformComponent(-82, 0),
          new RenderableComponent(),
          new PolygonComponent(SPoly.polyCircle(base_radius * .75))
        ], [
          this.entities.buildEntity([
            new TransformComponent(0, -48),
            new RenderableComponent(),
            new PolygonComponent(SPoly.polyCircle(base_radius * .25))
          ]).ID,
          this.entities.buildEntity([
            new TransformComponent(0, 48),
            new RenderableComponent(),
            new PolygonComponent(SPoly.polySquare(base_radius * .25))
          ]).ID
        ]).ID,
        this.entities.buildEntity([
          new TransformComponent(82, 0),
          new RenderableComponent(),
          new PolygonComponent(SPoly.polyCircle(base_radius * .75))
        ], [
          this.entities.buildEntity([
            new TransformComponent(0, -48),
            new RenderableComponent(),
            new PolygonComponent(SPoly.polySquare(base_radius * .25))
          ]).ID,
          this.entities.buildEntity([
            new TransformComponent(0, 48),
            new RenderableComponent(),
            new PolygonComponent(SPoly.polyCircle(base_radius * .25))
          ]).ID
        ]).ID
      ],
      [
        'scene_root'
      ]);

    var game_state = this.entities.buildEntity([
      new GameStateComponent({ someValue: 0})
    ]);

    this.systems.addSystem(new RenderingSystem());
    this.systems.addSystem(new VelocitySystem());
  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
    root.components[ComponentType.transform].rotation += Math.PI / 8 * delta;
  };
}

