function SequenceTests () {
  'use strict';
  this.conf = {
    name: 'Sequence Tests',
    description: 'Testing State and Sequence components.',
    date: '10.13.2017'
  };

  this.board_width = sm.gfx.width * 0.85;
  this.board_height = sm.gfx.height * 0.85;
  var BG_COLOR = SColor.colorForHex("#812849");

  var that = this;
  this.setup = function () {
    var e = this.entities;
    var s = this.systems;

    this.setupAppState(e);
    this.setupRenderState(this.render_root, e);
    this.setupSceneState(e);
    this.setupUIState(e);

    s.addSystem(new VelocitySystem(), e);
    s.addSystem({
      name: 'app_system',
      process: function (entities, fire, delta, mapper) {

      },
      listeners: {

      }
    });

    s.addSystem(new InputSystem({
      action_pressed : {
        controller: {
          port: 0,
          buttons: [sc.inputs.controller.cross]
        },
        keys: [ sc.keys.space]
      }
    }));

    s.addSystem(new SequenceSystem({
      back_and_forth: {
        type: SequenceType.NORMAL,
        length: 1,
        startOn: ['move_it'],
        reset: false,
        sequence: [
          {
            start: 0,
            end: 1,
            handle: function (target, progress) {
              SVec.setVec(EX.transPos(target), SMath.lerp(-128, 128, progress), 0);
            }
          }
        ]
      },

      fade_out: {
        type: SequenceType.NORMAL,
        length: 1,
        startOn: ['fade_out'],
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
      },

      fade_in: {
        type: SequenceType.NORMAL,
        length: 1,
        startOn: ['fade_in'],
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
      }
    }), e);

    s.addSystem(new RenderingSystem(), e);
  };
  
  this.setupAppState = function (e) {
    /**
     * Create an App root with two children:
     * - A Render Root
     * - A Game State
     */
    var app_root = e.buildEntity([
      new AppRoot()
    ], [], ['app_root']);


    this.render_root = e.buildEntityWithRoot([
      new RenderRoot(),
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['render_root'], app_root);
  };

  /**
   * Set the render_root component's children to a UI_root and a scene_root.
   *
   * @param render_root the render_root component.
   * @param e the entity mapper.
   */
  this.setupRenderState = function (render_root, e) {
    this.scene_root = e.buildEntityWithRoot([
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['scene_root'], render_root);
  };

  this.setupSceneState = function (e) {

    var ball = e.buildEntityWithRoot([
      new RenderableComponent(),
      new TransformComponent(),
      new VelocityComponent(0, 0, 0),
      new SequenceComponent([
        {
          name: 'back_and_forth'
        }
      ]),
      new PolygonComponent(
        SPoly.polyCircle(8),
        SColor.colorFromColor(sc.color.white),
        SColor.colorFromColor(sc.color.white))
      ], [], ['ball'], this.scene_root);

    var type = e.buildEntityWithRoot([
      new RenderableComponent(),
      new TransformComponent(-sm.gfx.width / 4, sm.gfx.height / 3),
      new VelocityComponent(0, 0, 0),
      new SequenceComponent([
        { name: 'fade_out' },
        { name: 'fade_in' }
      ]),
      new TextComponent('Fade Out.', {
        size: 38,
        color: SColor.colorFromColor(sc.color.white),
        font: 'Arial'
      })
    ], [], ['ball'], this.scene_root);
  };

  this.setupUIState = function (e) {

  };

  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    sm.gfx.text('Use sm.fireEvent to control the scene.', sm.gfx.width / 4, -sm.gfx.height / 3);
    sm.gfx.text('fade_out & fade_in control text.', sm.gfx.width / 4, -sm.gfx.height / 3 - 16);
    sm.gfx.text('move_it controls the ball.', sm.gfx.width / 4, -sm.gfx.height / 3 - 32);
    this.systems.process(this.entities, delta);
  };
}