function Breakout () {
  'use strict';
  this.conf = {
    name: 'Breakout',
    description: 'A basic breakout clone.',
    date: '09.18.2017'
  };

  var BG_COLOR = "#47A8BD";
  var FOREGROUND_COLOR = "#F5E663";
  var ball_speed = 156;

  var board_size = sm.gfx.width;
  // var ball_size = board_size / 18;

  this.setup = function () {
    this.update(0, sm.gfx);

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(1.25, .15));

    // Player paddle
    var player = this.entities.buildEntity([
	    new TransformComponent(0, -156),
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
      new VelocityComponent(ball_speed, -ball_speed),
      new PolygonComponent(SPoly.polyCircle(8)),
      new ColliderComponent(SPoly.polyCircle(8))
    ]);

    var gutter_l = this.entities.buildEntity([
      new TransformComponent(-312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16))
    ]);

    var gutter_r = this.entities.buildEntity([
      new TransformComponent(312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16))
    ]);

    var gutter_t = this.entities.buildEntity([
      new TransformComponent(0, 182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1))
    ]);

    this.entities.buildEntity([
      new RenderRoot(),
      new RenderableComponent(),
      new PolygonComponent(SPoly.polyCircle(0)),
      new TransformComponent()
    ], [
      ball.ID,
      player.ID,
      gutter_l.ID, gutter_r.ID, gutter_t.ID
    ]);

    this.entities.tagEntity(ball.ID, 'ball');
    this.entities.tagEntity(player.ID, 'player');
    this.entities.tagEntity(player.ID, 'paddle');
    this.entities.tagEntities([gutter_l.ID], 'gutter_left');
    this.entities.tagEntities([gutter_r.ID], 'gutter_right');
    this.entities.tagEntities([gutter_t.ID], 'gutter_top');

    this.systems.addSystem(new VelocitySystem());
    this.systems.addSystem(new BreakoutSystem(ball_speed, sm.gfx.width * .8, sm.gfx.height));

    this.systems.addSystem(new CollisionSystem({
      debounce_interval: 1 / 20,
      collision_map: {
        'ball': {
          'gutter_top' : 'BALL_GUTTER_TOP',
          'gutter_left' : 'BALL_GUTTER_LEFT',
          'gutter_right' : 'BALL_GUTTER_RIGHT',
          'paddle' : 'BALL_PADDLE'
        }
      }
    }));
    this.systems.addSystem(new RenderingSystem());
  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}