function AstralAssailants () {
  'use strict';
  this.conf = {
    name: 'Astral Assailants',
    description: 'Space shooter in SM.',
    date: '10.09.2017'
  };

  this.board_width = sm.gfx.width * 0.85;
  this.board_height = sm.gfx.height * 0.85;
  var BG_COLOR = SColor.colorForHex("#412681");

  this.setup = function () {
    var e = this.entities;
    var s = this.systems;

    this.setupAppState(e);
    this.setupRenderState(this.render_root, e);
    this.setupSceneState(e);
    this.setupUIState(e);
    this.setupStartScreen(this.UI_root, e);

    s.addSystem(new VelocitySystem(), e);
    s.addSystem({
      name: 'app_system',
      process: function (entities, fire, delta, mapper) {

      },
      listeners: {
        action_pressed: {
          type: 'action_pressed',
          handle: function (data, target, delta, mapper, fire, type) {
            console.log('AYY.')
          }
        }
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

      // moveCamera : {
      //   controller: {
      //     port: 0,
      //     axes: {
      //       leftStick: {
      //         deadZone: .25
      //       }
      //     }
      //   },
      //   pad: {
      //     left: [ sc.keys.left, sc.keys.a ],
      //     right: [ sc.keys.right, sc.keys.d ],
      //     up: [ sc.keys.up, sc.keys.w ],
      //     down: [ sc.keys.down, sc.keys.s ]
      //   }
      // }
    }));
    s.addSystem(new CollisionSystem({
      debounce_interval: 1 / 40,
      collision_map: {
        'ground_defense': {
          'invader_laser' : 'INVADER_HIT_GROUND'
        }
      }
    }));

    s.addSystem(new SequenceSystem({
      flash_1_sec: {
        type: SequenceType.NORMAL,
        length: 1,
        reset: false,
        sequence: [
          {
            start: 0,
            end: .5,
            handle: function (target, progress) {
              target.components[ComponentType.text].conf.color.a = 1;
            }
          },
          {
            start: .5,
            end: 1,
            handle: function (target, progress) {
              target.components[ComponentType.text].conf.color.a = 0;
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

    this.game_state = e.buildEntityWithRoot([
      new GameStateComponent({
        paused: true
      })
    ], [], ['game_state'], app_root);

    this.render_root = e.buildEntityWithRoot([
      new RenderRoot(),
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['render_root'], app_root);
  };

  /**
   * Set the render_root component's children to a UI_root and a scene_root.
   * @param render_root the render_root component.
   * @param e the entity mapper.
   */
  this.setupRenderState = function (render_root, e) {
    this.UI_root = e.buildEntityWithRoot([
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['UI_root'], render_root);

    this.scene_root = e.buildEntityWithRoot([
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['scene_root'], render_root);
  };
  
  this.setupStartScreen = function (UI_root, e) {
    this.title_screen = e.buildEntityWithRoot([
      new TransformComponent(),
      new RenderableComponent()
    ], [], ['title-screen'], this.UI_root);

    e.buildEntityWithRoot([
      new TextComponent(['Astral', 'Assailants!'], {
        size: 48,
        font: 'Patua One',
        color: SColor.colorFromColor(sc.color.white),
        align: 'left'
      }),
      new TransformComponent(-this.board_width / 2, this.board_height / 2.35),
      new RenderableComponent()
    ], [], ['title-card'], this.title_screen);

    e.buildEntityWithRoot([
      new TextComponent('Press Space To Play', {
        size: 24,
        font: 'Patua One',
        color: SColor.colorFromColor(sc.color.white),
        align: 'left'
      }),
      new TransformComponent(-this.board_width / 2, -this.board_height / 2.35),
      new RenderableComponent(),
      new SequenceComponent([ { name: 'flash_1_sec', startActive: true, type: SequenceType.NORMAL_LOOPING } ])
    ], [], ['call-to-action'], this.title_screen);
  };

  /**
   * Create the scene full of entities for gameplay.
   * @param e the entity mapper.
   */
  var snake_size = 18;
  this.setupSceneState = function (e) {
    var ground_defender = e.buildEntityWithRoot([
      new RenderableComponent(),
      new TransformComponent(),
      new VelocityComponent(0, 0, 0),
      new PolygonComponent(
        SPoly.polyCircle(snake_size / 2),
        SColor.colorFromColor(sc.color.white),
        SColor.colorFromColor(sc.color.white)),
      new ColliderComponent(SPoly.polySquare(snake_size))
      ], [], ['ground_defender'], this.scene_root);
  };

  this.setupUIState = function (e) {

  };

  /**
   * Updates the program and all its systems.
   * @param delta the time elapsed since the last tick
   * @param g shorthand reference to sm.gfx
   */
  this.update = function (delta, g) {
    g.clear(BG_COLOR);
    this.systems.process(this.entities, delta);
  };
}