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
        new ColorComponent(Color.white, Color.white),
        new TextComponent( ['THE BALL', 'IS WHITE'], {
          color: '#ffc416',
          size: 24,
          font: 'Arial',
          style : 'bold',
          align: 'right'
        })
    ]);

    var root = this.entityMapper.createEntity([
      new PositionComponent(),
      new RenderRoot()
    ], 'root', [ ball ] );

    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
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