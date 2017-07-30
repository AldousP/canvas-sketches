var StateMachines = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'State Machines',
      date : '07.26.2017',
      description : 'Demonstration of FSM system controlling distant state via event dispatches.'
    },
    systemStates : {
      rendering: {
        assets: 'assets/animations/'
      },
      background : {
        bgColor: '#ffc416'
      }
    }
  };

  this.setup = function () {
    var ball = this.entityMapper.createEntity([
        new PositionComponent(),
        new PolygonComponent(generatePolygon(32, 128, 0)),
        new StateMachineComponent('sampleStateMachine'),
        new ColorComponent(Color.white),
        new TextComponent( ['THE BALL', 'IS INACTIVE'], {
          color: Color.white,
          size: 24,
          font: 'Arial',
          style : 'bold',
          align: 'center'
        })
    ]);

    var root = this.entityMapper.createEntity([
      new PositionComponent(),
      new RenderRoot()
    ], 'root', [ ball ] );

    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
    this.systemProcessor.addSystem(new InputSystem());

    var transitionLength = 2.5;
    this.systemProcessor.addSystem(new StateMachineSystem({
      sampleStateMachine: {
        initialState: 0,
        states: ['AT_REST', 'ACTIVE'],
        AT_REST: {
          listeners: {
            cycle_left: 'ACTIVE'
          },
          enter: function (components) {
            components[ComponentType.text].strings = ['THE BALL', 'IS INACTIVE.'];
            components[ComponentType.text].conf.color = Color.white;
            components[ComponentType.color].colorB = '#ffc416';
          },

          update: function (stateTime, transition) {
            if (stateTime > transitionLength) {
              transition('ACTIVE');
            }
          },
          
          exit: function () {
          }
        },

        ACTIVE: {
          enter: function (components) {
            components[ComponentType.text].strings = ['THE BALL', 'IS ACTIVE.'];
            components[ComponentType.text].conf.color = '#ffc416';
            components[ComponentType.color].colorB = Color.white;
          },

          update: function (stateTime, transition) {
            if (stateTime > transitionLength) {
              transition('AT_REST');
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