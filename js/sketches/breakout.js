function Breakout () {
  'use strict';
  this.conf = {
    name: 'Breakout',
    description: 'A basic breakout clone.',
    date: '09.18.2017'
  };

  var BG_COLOR = SColor.colorForHex("#47A8BD");
  var ball_speed = 212;
  this.board_width = sm.gfx.width * 0.85;
  this.board_height = sm.gfx.height * 0.85;


  this.setup = function () {
    var e = this.entities;
    var s = this.systems;

    // Game Data
    e.buildEntity([
      new GameStateComponent({
        score: 0,
        balls: 3
      })
    ], [], ['game_state']);

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(1.25, .15));

    // Scene Data
    var root = e.buildEntity([
      new RenderRoot(),
      new RenderableComponent(),
      new PolygonComponent(SPoly.polyCircle(0)),
      new SequenceComponent([
        {name: 'fade_in'},
        {name: 'fade_out'}
      ]),
      new TransformComponent()
    ], [], ['root']);

    var UI_root = e.buildEntityWithRoot([
      new TransformComponent(),
      new RenderableComponent({opacity: 1})
    ], [], [], root);

    // Player paddle
    e.buildEntityWithRoot([
	    new TransformComponent(0, -162),
      new RenderableComponent(),
      new PolygonComponent(paddlePoly, sc.color.white, BG_COLOR),
      new ColliderComponent(paddlePoly),
      new RenderableVector(new SVec.Vector(.1, 0), sc.color.white, 1)
    ], [], ['player', 'paddle'], root);

    // Ball
    e.buildEntityWithRoot([
      new TransformComponent(0, -64),
      new RenderableComponent(),
      new VelocityComponent(ball_speed, ball_speed),
      new PolygonComponent(SPoly.polyCircle(4), null, sc.color.white),
      new ColliderComponent(SPoly.polyCircle(4))
    ], [], ['ball'], root);


    // // Gutters
    var gutter_color = null;
    e.buildEntityWithRoot([
      new TransformComponent(-312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16), gutter_color, new Color(255, 255, 255, 0)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_left'], root);

    e.buildEntityWithRoot([
      new TransformComponent(312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16), gutter_color, new Color(255, 255, 255, 0)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_right'], root);

    e.buildEntityWithRoot([
      new TransformComponent(0, 182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1), gutter_color, new Color(255, 255, 255, 0)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_top'], root);

    e.buildEntityWithRoot([
      new TransformComponent(0, -182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1), gutter_color, new Color(255, 0, 0, 0)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1)),
      new SequenceComponent([{ name: 'flash_gutter' }])
    ], [], ['gutter_bottom'], root);


    // Create Ball UI Element
    e.buildEntityWithRoot([
      new TransformComponent(this.board_width / 2.05, this.board_height / 2.15),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 2.65, 1), sc.color.white, BG_COLOR)
    ], [
      e.buildEntity([
        new TransformComponent(-24, 0),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polyCircle(4, 64), sc.color.white, sc.color.white)
      ]).ID,
      e.buildEntity([
        new TransformComponent(0, 0),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polyCircle(4, 64), sc.color.white, sc.color.white)
      ]).ID,
      e.buildEntity([
        new TransformComponent(24, 0),
        new RenderableComponent(),
        new PolygonComponent(SPoly.polyCircle(4, 64), sc.color.white, sc.color.white)
      ]).ID
    ], ['ball_indicator'], UI_root);

    // Score Pane
    e.buildEntityWithRoot([
      new TextComponent('0', {
        size: 48,
        font: 'Questrial',
        color: sc.color.white
      }),
      new TransformComponent(-this.board_width / 2.05, this.board_height / 2.25),
      new RenderableComponent()
      ], [], ['score_pane'], UI_root);


    // Create Tiles
    var blockPoly = SPoly.polySquare(16);
    SPoly.scalePoly(blockPoly, new SVec.Vector(3.15, .85));
    var start_x = -(this.board_width / 2.35);
    var start_y = 96;
    var tile_length = 48;
    var tile_height = 18;
    var tile_columns = 10;
    var tile_rows = 8;

    for (var i = 0; i < tile_columns; i++) {
      for (var j = 0; j < tile_rows; j++) {
        e.buildEntityWithRoot([
          new TransformComponent((j % 2 === 0 ? 32 : 0) + start_x + (i * tile_length) , start_y - (j * tile_height)),
          new RenderableComponent(),
          new PolygonComponent(blockPoly, null, sc.color.white),
          new ColliderComponent(blockPoly)
        ], [], ['tile'], root);
      }
    }

    // System Configuration
    s.addSystem(new BreakoutSystem(ball_speed, sm.gfx.width * .8, sm.gfx.height));
    s.addSystem(new VelocitySystem());
    s.addSystem(new SequenceSystem({
      flash_gutter: {
        type: SequenceType.NORMAL,
        length: .25,
        startOn: ['FLASH_GUTTER'],
        reset: false,
        sequence: [
          {
            start: 0,
            end: .25,
            handle: function (target, progress) {
              target.components[ComponentType.polygon].fill.a = Math.pow(SFormat.float_two_pt(1 - progress), 3);
            }
          }
        ]
      },
      fade_in: {
        type: SequenceType.NORMAL,
        length: 1,
        startOn: ['FADE_IN'],
        reset: false,
        sequence: [
          {
            start: 0,
            end: 1,
            handle: function (target, progress) {
              EX.renderable(target).opacity = progress;
            }
          }
        ]
      },
      fade_out: {
        type: SequenceType.NORMAL,
        length: 1,
        startOn: ['FADE_OUT'],
        reset: false,
        sequence: [
          {
            start: 0,
            end: 1,
            handle: function (target, progress) {
              EX.renderable(target).opacity = 1 - progress;
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

  // Tick the system processor.
  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}