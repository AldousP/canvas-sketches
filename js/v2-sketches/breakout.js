function Breakout () {
  'use strict';
  this.conf = {
    name: 'Breakout',
    description: 'A basic breakout clone.',
    date: '09.18.2017'
  };

  var BG_COLOR = "#47A8BD";
  var FOREGROUND_COLOR = "#F5E663";
  var ball_speed = 182;
  this.board_width = sm.gfx.width * 0.85;
  this.board_height = sm.gfx.height * 0.85;

  this.setup = function () {
    this.update(0, sm.gfx);
    var e = this.entities;
    var s = this.systems;

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(1.25, .15));

    // Player paddle
    var player = e.buildEntity([
	    new TransformComponent(0, -132),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ], [], ['player', 'paddle']);

    // Ball
    var ball = e.buildEntity([
      new TransformComponent(),
      new RenderableComponent(),
      new GameplayComponent(),
      new VelocityComponent(ball_speed, -ball_speed),
      new PolygonComponent(SPoly.polyCircle(8)),
      new ColliderComponent(SPoly.polyCircle(8))
    ], [], ['ball']);

    // Gutters
    var gutter_l = e.buildEntity([
      new TransformComponent(-312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16), null, '#FFFFFF'),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16))
    ], [], ['gutter_left']);

    var gutter_r = e.buildEntity([
      new TransformComponent(312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16), null, '#FFFFFF'),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16))
    ], [], ['gutter_right']);

    var gutter_t = e.buildEntity([
      new TransformComponent(0, 182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1), null, '#FFFFFF'),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1))
    ], [], ['gutter_top']);

    var gutter_b = e.buildEntity([
      new TransformComponent(0, -182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1), null, '#FFFFFF'),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1))
    ], [], ['gutter_bottom']);


    var blockPoly = SPoly.polySquare(32);
    SPoly.scalePoly(blockPoly, new SVec.Vector(1.25, .45));
    var tile_IDS = [];
    var start_x = -(this.board_width / 3);
    var start_y = 72;
    var tile_length = 48;
    for (var i = 0; i < 8; i++) {
      var block = e.buildEntity([
        new TransformComponent(start_x + (i * tile_length) , start_y),
        new RenderableComponent(),
        new PolygonComponent(blockPoly, null, '#FFFFFF'),
        new ColliderComponent(blockPoly)
      ], [], ['tile']);
      tile_IDS.push(block.ID);
    }

    var text_pane = e.buildEntity([
      new TextComponent('0', {
        size: 18,
        font: 'Questrial',
        color: sc.color.white
      }),
      new TransformComponent(-this.board_width / 2, this.board_height / 2),
      new RenderableComponent(),
      new SequenceComponent([
        { name: 'text_slide' }
      ])], []);

    // Render Root
    e.buildEntity([
      new RenderRoot(),
      new RenderableComponent(),
      new PolygonComponent(SPoly.polyCircle(0)),
      new TransformComponent()
    ], [
      ball.ID,
      player.ID,
      gutter_l.ID, gutter_r.ID, gutter_t.ID, gutter_b.ID,
      text_pane.ID
    ].concat(tile_IDS));

    s.addSystem(new BreakoutSystem(ball_speed, sm.gfx.width * .8, sm.gfx.height));
    s.addSystem(new VelocitySystem());
    s.addSystem(new SequenceSystem({
      text_slide: {
        type: SequenceType.PING_PONG,
        length: 2,
        startOn: ['SLIDE_TEXT'], // If the target of this event is the same as this entity.
        stopOn: ['STOP_SLIDE_TEXT'],
        sequence: [

        ]
      }
    }));
    s.addSystem(new CollisionSystem({
      debounce_interval: 1 / 40,
      collision_map: {
        'ball': {
          'gutter_top' : 'BALL_GUTTER_TOP',
          'gutter_left' : 'BALL_GUTTER_LEFT',
          'gutter_right' : 'BALL_GUTTER_RIGHT',
          'gutter_bottom' : 'BALL_GUTTER_BOTTOM',
          'paddle' : 'BALL_PADDLE',
          'tile' : 'BALL_TILE'
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