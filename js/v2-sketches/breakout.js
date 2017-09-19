function Breakout () {
  'use strict';
  this.conf = {
    name: 'Breakout',
    description: 'A basic breakout clone.',
    date: '09.18.2017'
  };

  var BG_COLOR = "#47A8BD";
  var FOREGROUND_COLOR = "#F5E663";
  var ball_speed = 128;

  this.setup = function () {
    this.update(0, sm.gfx);

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(1.75, .25));

    // Player paddle
    var player = this.entities.buildEntity([
	    new TransformComponent(0, -128),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ]);

    // ball
    var ball = this.entities.buildEntity([
      new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(SPoly.polyCircle(16)),
      new ColliderComponent(SPoly.polyCircle(16))
    ]);

    this.entities.buildEntity([
      new RenderRoot(),
      new RenderableComponent(),
      new PolygonComponent(SPoly.polyCircle(0)),
      new TransformComponent()
    ], [ball.ID, player.ID]);

    this.entities.tagEntity(ball.ID, 'ball');
    this.entities.tagEntity(player.ID, 'player');
    this.entities.tagEntity(player.ID, 'paddle');

    this.systems.addSystem(new VelocitySystem());
    this.systems.addSystem(new RenderingSystem());
    this.systems.addSystem(new CollisionSystem({
      debounce_interval: 1 / 30
    }));
  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}