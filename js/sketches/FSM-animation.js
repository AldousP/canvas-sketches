var FSMAnimations = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'FSM Animations',
      date : '08.01..2017',
      description : 'Controlling animation state via an FSM.'
    },
    systemStates : {
      rendering: {
        assets: 'assets/animations/'
      },
      background : {
        bgColor: '#309bbc'
      }
    }
  };

  this.setup = function () {

    var playerA = this.entityMapper.createEntity([
        new PlayerComponent('Player 1'),
        new PositionComponent(-64),
        new RotationComponent(),
        new StateMachineComponent('blobAnimation'),
        new AnimationMapComponent(
            'idle',
            {
              animations: {
                idle: {
                  file: 'blob/animation_blob_idle.json',
                  length: 1,
                  width: 64,
                  height: 64
                },
                moving: {
                  file: 'blob/animation_blob_moving.json',
                  length: 1,
                  width: 64,
                  height: 64
                },
                jumping: {
                  file: 'blob/animation_blob_jumping.json',
                  length: 1,
                  width: 64,
                  height: 64
                }
              }
            }
        ),
        new PolygonComponent(generatePolygon(4, 64, 45 / DEG_RAD, 1, 1.25))
    ]);

    var playerB = this.entityMapper.createEntity([
      new PositionComponent(64),
      new PlayerComponent('Player 2'),
      new RotationComponent(),
      new StateMachineComponent('blobAnimation'),
      new AnimationMapComponent(
          'idle',
          {
            animations: {
              idle: {
                file: 'blob/animation_blob_idle.json',
                length: 1,
                width: 64,
                height: 64
              },
              moving: {
                file: 'blob/animation_blob_moving.json',
                length: 1,
                width: 64,
                height: 64
              },
              jumping: {
                file: 'blob/animation_blob_jumping.json',
                length: 1,
                width: 64,
                height: 64
              }
            }
          }
      ),
      new PolygonComponent(generatePolygon(4, 64, 45 / DEG_RAD, 1, 1.25))
    ]);


    var root = this.entityMapper.createEntity([
      new PositionComponent(),
      new RenderRoot()
    ], 'root', [ playerA, playerB ] );

    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new AnimationSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
    this.systemProcessor.addSystem( {
      name: ''
    } );
    this.systemProcessor.addSystem(new InputSystem({
      jump: {
        controller: {
          port: 0,
          buttons: [ DS4.cross ]
        },
        keys: [ Keys.space ]
      },
      move: {
        controller: {
          port: 0,
          axes: {
            leftStick: {
              deadZone: .25
            }
          }
        },
        pad: {
          left: [ Keys.left, Keys.a ],
          right: [ Keys.right, Keys.d ]
        }
      }
    }));

    this.systemProcessor.addSystem(new StateMachineSystem({
      blobAnimation: {
        initialState: 0,
        states: ['idle', 'moving', 'jumping'],
        idle: {
          listeners: {
            jump: function () {
              
            },
            move: function () {
              
            }
          },
          enter: function (components) {
            components.animationMap.activeState = 'idle';
            components.animationMap.progress = 0;
          },

          update: function (stateTime, transition) {

          },

          exit: function () {

          }
        },

        moving: {
          listeners: {
            move: function (event) {

            }
          },
          enter: function (components) {
            components.animationMap.activeState = 'moving';
            components.animationMap.progress = 0;
          },

          update: function (stateTime, transition) {
            if (stateTime > .3) {
              transition
            }
          },

          exit: function () {

          }
        },

        jumping: {
          enter: function (components) {
            components.animationMap.activeState = 'jumping';
            components.animationMap.progress = 0;
          },

          update: function (stateTime, transition, components) {
            if (stateTime > 1) {
              transition('idle');
            }
          },

          exit: function () {
          }
        }
      }
    }));
  };

  this.onResize = function (isMobile) {
    if (this.state.rootID) {
      if (isMobile) {
        this.entityMapper.entities[this.state.rootID].components[ComponentType.polygon]
            .polygon = generatePolygon(4, 128, Math.PI / 4,  1.75, 1.75);
      } else {
        this.entityMapper.entities[this.state.rootID].components[ComponentType.polygon]
            .polygon = generatePolygon(4, 128, Math.PI / 4,  4, 1.75);
      }
    }
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
  }
};