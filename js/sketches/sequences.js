var Sequences = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'Sequences',
      date : '07.29.2017',
      description : 'Sequences and easing.'
    },
    systemStates : {
      rendering: {
        assets: 'assets/animations/'
      },
      background : {
        bgColor: '#40a841'
      }
    }
  };

  var camConfig = {
    pos: new Vector(0, 0),
    width: 128,
    height: 128,
    zoom: 1,
    rotation: 0
  };

  this.setup = function () {
    var entities = [];

    var root = this.entityMapper.createEntity([
      new RenderRoot()
    ], 'root', entities );

    this.state.rootID = root.ID;
    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
    this.systemProcessor.addSystem(new CameraSystem());
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
  };
};