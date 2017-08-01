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

    var player = this.entityMapper.createEntity([
        new PositionComponent(),
        new RotationComponent(),
        new PolygonComponent(generatePolygon(4, 32, 45 / DEG_RAD, 1, 1.25)),
        new AnimationComponent('blink/blink.json', 1, 64, 64)
    ]);

    var root = this.entityMapper.createEntity([
      new PositionComponent(),
      new RenderRoot()
    ], 'root', [ player ] );

    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
    this.systemProcessor.addSystem(new InputSystem({
      cycle_state: {
        // controller: {
        //   port: 0,
        //   buttons: [ DS4.circle ]
        // },
        // keys: [Keys.e, Keys.q]
      }
    }));

    this.systemProcessor.addSystem(new StateMachineSystem({
      sampleStateMachine: {
        initialState: 0,
        states: ['STATEA', 'STATEB', 'STATEC', 'STATEX'],
        STATEA: {
          listeners: {
            cycle_state: 'STATEB'
          },
          enter: function (components) {
          },

          update: function (stateTime, transition) {

          },

          exit: function () {

          }
        },

        STATEB: {
          listeners: {
            cycle_state: 'STATEC'
          },
          enter: function (components) {

          },

          update: function (stateTime, transition) {


          },

          exit: function () {
          }
        },

        STATEC: {
          listeners: {
            cycle_state: 'STATEB',
            secret_state: 'STATEX'
          },
          enter: function (components) {

          },

          update: function (stateTime, transition) {


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