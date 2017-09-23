function Breakout () {
  'use strict';
  this.conf = {
    name: 'Breakout',
    description: 'A basic breakout clone.',
    date: '09.18.2017'
  };

  var BG_COLOR = "#47A8BD";
  var FOREGROUND_COLOR = "#F5E663";
  var ball_speed = 112;
  this.board_width = sm.gfx.width * 0.85;
  this.board_height = sm.gfx.height * 0.85;

  this.setup = function () {
    this.update(0, sm.gfx);
    var e = this.entities;
    var s = this.systems;

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(1.25, .15));

    var gameState = e.buildEntity([
      new GameStateComponent({
        score: 0,
        balls: 3
      })
    ], [], ['game_state']);

    // Player paddle
    var player = e.buildEntity([
	    new TransformComponent(0, -162),
      new RenderableComponent(),
      new PolygonComponent(paddlePoly, '#FFFFFF', BG_COLOR),
      new ColliderComponent(paddlePoly),
      new RenderableVector(new SVec.Vector(.1, 0), '#FFFFFF', 1)
    ], [], ['player', 'paddle']);

    // Ball
    var ball = e.buildEntity([
      new TransformComponent(0, -64),
      new RenderableComponent(),
      new VelocityComponent(ball_speed, ball_speed),
      new PolygonComponent(SPoly.polyCircle(4), null, '#FFFFFF'),
      new ColliderComponent(SPoly.polyCircle(4))
      // new RenderableVector(new SVec.Vector(0, -32), '#FFFFFF', 1)
    ], [], ['ball']);

    // Gutters
    var gutter_color = null;
    var gutter_l = e.buildEntity([
      new TransformComponent(-312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16), null, gutter_color),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_left']);

    var gutter_r = e.buildEntity([
      new TransformComponent(312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16), null, gutter_color),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_right']);

    var gutter_t = e.buildEntity([
      new TransformComponent(0, 182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1), null, gutter_color),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_top']);

    var gutter_b = e.buildEntity([
      new TransformComponent(0, -182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1), null, gutter_color),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_bottom']);

    var ball_indicator = e.buildEntity([
      new TransformComponent(this.board_width / 2.05, this.board_height / 1.85),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 2.65, 1), '#FFFFFF', BG_COLOR)
    ], [
      e.buildEntity([
        new TransformComponent(-24, 0),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polyCircle(4, 64), '#FFFFFF', '#FFFFFF')
      ]).ID,
      e.buildEntity([
        new TransformComponent(0, 0),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polyCircle(4, 64), '#FFFFFF', '#FFFFFF')
      ]).ID,
      e.buildEntity([
        new TransformComponent(24, 0),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polyCircle(4, 64), '#FFFFFF','#FFFFFF')
      ]).ID
    ], ['ball_indicator']);

    var blockPoly = SPoly.polySquare(16);
    SPoly.scalePoly(blockPoly, new SVec.Vector(2.5, .45));
    var tile_IDS = [];
    var start_x = -(this.board_width / 3);
    var start_y = 100;
    var tile_length = 48;
    var tile_height = 18;

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var block = e.buildEntity([
          new TransformComponent((j % 2 === 0 ? 32 : 0) + start_x + (i * tile_length) , start_y - (j * tile_height)),
          new RenderableComponent(),
          new PolygonComponent(blockPoly, null, '#FFFFFF'),
          new ColliderComponent(blockPoly)
        ], [], ['tile']);
        tile_IDS.push(block.ID);
      }
    }

    var text_pane = e.buildEntity([
      new TextComponent('0', {
        size: 48,
        font: 'Questrial',
        color: sc.color.white
      }),
      new TransformComponent(-this.board_width / 2.05, this.board_height / 2.25),
      new RenderableComponent()
      ], [], ['score_pane']);

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
      text_pane.ID,
      ball_indicator.ID
    ].concat(tile_IDS));

    s.addSystem(new BreakoutSystem(ball_speed, sm.gfx.width * .8, sm.gfx.height));
    s.addSystem(new VelocitySystem());
    s.addSystem(new SequenceSystem({
      flash_gutter: {
        type: SequenceType.NORMAL,
        length: .25,
        startOn: ['FLASH_GUTTER'], // If the target of this event is the same as this entity.
        reset: false,
        sequence: [
          {
            start: 0,
            end: .24,
            handle: function (target, progress) {
              target.components[ComponentType.polygon].fill =
                'rgba(255, 255, 255, ' + Math.pow(SFormat.float_two_pt(1 - progress), 3) + ')';
            }
          }
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