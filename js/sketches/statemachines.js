var StateMachines = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'State Machines',
      date : '07.26.2017',
      description : 'Demonstration of wiring up input system to FSM. (Press E & Q).'
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
        new TextComponent( ['STATE A'], {
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
    this.systemProcessor.addSystem(new InputSystem({
      cycle_state: {
        controller: {
          port: 0,
          buttons: [ DS4.circle ]
        },
        keys: [Keys.e ]
      },
      secret_state: {
        keys: [Keys.x],
        controller: {
          port: 0,
          buttons: [ DS4.cross ]
        }
      }
    }));

    var transitionLength = 2.5;
    var that = this;
    this.systemProcessor.addSystem(new StateMachineSystem({
      sampleStateMachine: {
        initialState: 0,
        states: ['STATEA', 'STATEB', 'STATEC', 'STATEX'],
        STATEA: {
          listeners: {
            cycle_state: 'STATEB'
          },
          enter: function (components) {
            components[ComponentType.text].strings = ['STATE A'];
            components[ComponentType.text].conf.color = Color.white;
            components[ComponentType.color].colorB = '#ffc416';
            that.state.systemStates.background.bgColor = '#ffc416';
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
            components[ComponentType.text].strings = ['STATE B'];
            components[ComponentType.text].conf.color = '#ffc416';
            components[ComponentType.color].colorB = Color.white;
            that.state.systemStates.background.bgColor = '#ffc416';
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
            components[ComponentType.text].strings = ['STATE C'];
            components[ComponentType.text].conf.color = '#ffc416';
            components[ComponentType.color].colorB = Color.white;
            that.state.systemStates.background.bgColor = '#ffc416';
          },

          update: function (stateTime, transition) {


          },

          exit: function () {
          }
        },

        STATEX: {
          listeners: {
            secret_state: 'STATEC'
          },
          enter: function (components) {
            components[ComponentType.text].strings = ['STATE ???', '(Press X To Return)'];
            components[ComponentType.text].conf.color = '#221d75';
            components[ComponentType.color].colorB = Color.white;
            that.state.systemStates.background.bgColor = '#221d75';
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
    sm.gfx.preDraw();
    sm.gfx.setFillColor(Color.white);
    sm.gfx.setTextConf({style: 'italics', weight: 'light', font: 'arial',  size: 24});
    sm.gfx.text('Press', -16, -sm.gfx.height / 2.35);
    sm.gfx.setTextConf({ font: 'fontawesome',  size: 18});
    sm.gfx.text('\uF1DB', 32, -sm.gfx.height / 2.35);
    sm.gfx.postDraw();
  }
};