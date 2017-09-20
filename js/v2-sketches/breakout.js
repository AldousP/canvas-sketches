function Breakout () {
  'use strict';
  this.conf = {
    name: 'Breakout',
    description: 'A basic breakout clone.',
    date: '09.18.2017'
  };

  var BG_COLOR = "#47A8BD";
  var FOREGROUND_COLOR = "#F5E663";
  var ball_speed = 2;

  this.setup = function () {
    this.update(0, sm.gfx);
    var e = this.entities;
    var s = this.systems;

    var paddlePoly = SPoly.polySquare(64);
    SPoly.scalePoly(paddlePoly, new SVec.Vector(1.25, .15));

    // Player paddle
    var player = e.buildEntity([
	    new TransformComponent(0, -156),
      new RenderableComponent(),
      new GameplayComponent(),
      new PolygonComponent(paddlePoly),
      new ColliderComponent(paddlePoly)
    ], [], ['player', 'paddle']);

    // Ball
    // var ball = e.buildEntity([
    //   new TransformComponent(),
    //   new RenderableComponent(),
    //   new GameplayComponent(),
    //   new VelocityComponent(ball_speed, -ball_speed),
    //   new PolygonComponent(SPoly.polyCircle(8)),
    //   new ColliderComponent(SPoly.polyCircle(8))
    // ], [], ['ball']);

    // Gutters
    var gutter_l = e.buildEntity([
      new TransformComponent(-312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16))
    ], [], ['gutter_left']);

    var gutter_r = e.buildEntity([
      new TransformComponent(312, 0),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 1, 16))
    ], [], ['gutter_right']);

    var gutter_t = e.buildEntity([
      new TransformComponent(0, 182),
      new RenderableComponent(),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1)),
      new ColliderComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 32, 1))
    ], [], ['gutter_top']);

    var text_pane = e.buildEntity([
      new TextComponent('Component Text!', {
        size: 24,
        font: 'Questrial'
      }),
      new TransformComponent(0, 0),
      new RenderableComponent({
        opacity: .5
      }),
      new SequenceComponent([
        { name: 'text_slide' }
      ]),
      new PolygonComponent(SPoly.scalePolyConst(SPoly.polySquare(32), 8, 2))], []);

    // Render Root
    e.buildEntity([
      new RenderRoot(),
      new RenderableComponent(),
      new PolygonComponent(SPoly.polyCircle(0)),
      new TransformComponent()
    ], [
      // ball.ID,
      player.ID,
      gutter_l.ID, gutter_r.ID, gutter_t.ID,
      text_pane.ID
    ]);

    s.addSystem(new BreakoutSystem(ball_speed, sm.gfx.width * .8, sm.gfx.height));
    s.addSystem(new VelocitySystem());
    s.addSystem(new SequenceSystem({
      text_slide: {
        type: SequenceType.PING_PONG,
        length: 5,
        startOn: ['SLIDE_TEXT'], // If the target of this event is the same as this entity.
        stopOn: ['STOP_SLIDE_TEXT'],
        sequence: [
          { start: .75, handle: function () { sm.sfx.beep(sc.notes.C4)} },
          { start: .90, handle: function () { sm.sfx.beep(329.63)} },
          { start: 1.05, handle: function () { sm.sfx.beep(493.88)} },
          {
            start: 0,
            end: 1,
            handle: function (target, progress) {
              var pos = EX.transPos(target);
              SVec.setVec(pos, SMath.lerp(128, -172, Math.pow(progress, 4)), 0);
            }
          },
          {
            start: .75,
            end: 1.22,
            handle: function (target, progress) {
              target.components[ComponentType.transform].rotation = SMath.lerp(SMath, Math.pow(progress, 2));
            }
          }
        ]
      }
    }));
    s.addSystem(new CollisionSystem({
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