'use strict';

function Pong () {
  this.conf = {
    name: 'Pong',
    description: 'Pong in SM.',
    date: '09.14.2017'
  };

  var BG_COLOR = "#114b53";
  var ball_speed = 2.5;

  this.setup = function () {
    this.update(0, sm.gfx);

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(.55, 2.75));

    // Player paddle
    var player = this.entities.buildEntity([
	    new TransformComponent(-256, 0),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ]);

    // AI paddle
    var AIPaddle = this.entities.buildEntity([
      new TransformComponent(256, 0),
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
      new VelocityComponent(ball_speed, ball_speed / 4),
      new PolygonComponent(SPoly.polyCircle(16)),
      new ColliderComponent(SPoly.polyCircle(16))
    ]);

    var gutterPoly = SPoly.polySquare(32);
    var goalPoly = SPoly.polySquare(32);

    SPoly.scalePoly(gutterPoly, new SVec.Vector(32, 1));
    SPoly.scalePoly(goalPoly, new SVec.Vector(1, 32));

    var top_gutter = this.entities.buildEntity([
      new TransformComponent(0, -175),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(gutterPoly),
      new ColliderComponent(gutterPoly)
    ]);

    var bottom_gutter = this.entities.buildEntity([
      new TransformComponent(0, 175),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(gutterPoly),
      new ColliderComponent(gutterPoly)
    ]);

    var player_goal = this.entities.buildEntity([
      new TransformComponent(-312, 0),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(goalPoly),
      new ColliderComponent(goalPoly)
    ]);

    var AI_goal = this.entities.buildEntity([
      new TransformComponent(312, 0),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(goalPoly),
      new ColliderComponent(goalPoly)
    ]);

    this.entities.tagEntity(ball.ID, 'ball');
    this.entities.tagEntity(AIPaddle.ID, 'AIPaddle');
    this.entities.tagEntity(player.ID, 'player');
    this.entities.tagEntity(AI_goal.ID, 'AI_goal');
    this.entities.tagEntity(player_goal.ID, 'player_goal');
    this.entities.tagEntities([top_gutter.ID, bottom_gutter.ID], 'gutter');
    this.entities.tagEntities([player.ID, AIPaddle.ID], 'paddle');

    this.systems.addSystem(new PongSystem(ball_speed));
    this.systems.addSystem(new VelocitySystem());
    this.systems.addSystem(new RenderingSystem());
    this.systems.addSystem(new CollisionSystem());
  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}