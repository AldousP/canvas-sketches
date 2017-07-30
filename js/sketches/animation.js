var Animation = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'Animations',
      date : '07.25.2017',
      description : 'An example of loading sprite-sheet JSON from Adobe Animate into a scene.'
    },
    systemStates : {
      rendering: {
        assets: 'assets/animations/'
      },
      background : {
        bgColor: '#000000'
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
    var blink = this.entityMapper.createEntity([
      new ColorComponent(Color.black),
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new AnimationComponent('blink/blink.json', 1, 64, 64)
    ], 'blink', entities);

    var floor = this.entityMapper.createEntity([
      new ColorComponent(Color.black),
      new PositionComponent(0, -132),
      new RotationComponent(0),
      new PolygonComponent(generatePolygon(4, 64, Math.PI / 4, 10, 1.85))
    ], 'floor', entities);

    entities.push(blink);
    entities.push(floor);

    var root = this.entityMapper.createEntity([
      new ColorComponent(Color.white, '#c7d1d7'),
      new PositionComponent(0, 0),
      new SequenceComponent([
          { length: .15, pos: 0, onComplete: 'spawnSnow' },
          { length: .15, pos: 0, onComplete: 'spawnSnow' }
      ]),
      new RotationComponent(0),
      new CameraComponent(camConfig),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4,  4, 1.75)),
      new ClipComponent(),
      new RenderRoot()
    ], 'root', entities);

    this.state.blinkID = blink.ID;
    this.state.rootID = root.ID;

    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new MovementSystem());
    this.systemProcessor.addSystem(new PathSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new CameraSystem());
    this.systemProcessor.addSystem(new AnimationSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
    var that = this;

    this.systemProcessor.addSystem({
      name: 'app-logic',
      listeners : {
        spawnSnow: function () {
          that.entityMapper.bindToParent(root, [
            that.entityMapper.createEntity([
              new ColorComponent(Color.white),
              new RotationComponent(0),
              new MovementComponent(new Vector(0, SMath.rand(-45, -100), 0), 0),
              new PositionComponent(SMath.rand(-512, 512), SMath.rand(512, 312)),
              new PolygonComponent(generatePolygon(SMath.rand(32, 64), 3, Math.PI / 4))
            ], 'snowFlake')
          ])
        },

        processEntity : function (entity, state, delta, entities, recursion) {
          var cam = smx.cam(entity);
          var seq = smx.sequence(entity);
          if (cam && seq && seq.name === 'camera_bob') {

          }
        }
      }
    });
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