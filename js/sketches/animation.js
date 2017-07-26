var Animation = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'Animations',
      date : '07.25.2017',
      description : 'JSON spritesheet loading.'
    },
    systemStates : {
      rendering: {
        assets: 'assets/animations/'
      },
      background : {
        bgColor: '#c7d1d7'
      }
    }
  };

  this.setup = function () {
    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new MovementSystem());
    this.systemProcessor.addSystem(new PathSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new CameraSystem());
    this.systemProcessor.addSystem(new AnimationSystem());
    this.systemProcessor.addSystem(new RenderingSystem());

    var entities = [];

    var blink = this.entityMapper.createEntity([
      new ColorComponent(Color.black),
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new AnimationComponent('blink/blink.json'),
      new PolygonComponent(generatePolygon(4, 64, Math.PI / 4))
    ], 'root', entities);

    entities.push(blink);

    var root = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new CameraComponent({ pos: new Vector(0, 0),  width: 128,  height: 128,  zoom: 1 }),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4,  3.75, 1.75)),
      new ClipComponent(),
      new RenderRoot()
    ], 'root', entities);

    this.state.rootID = root.ID;
  };

  this.onResize = function (isMobile) {
    if (isMobile) {
      this.entityMapper.entities[this.state.rootID].components[ComponentType.polygon]
          .polygon = generatePolygon(4, 128, Math.PI / 4,  1.75, 1.75);
    } else {
      this.entityMapper.entities[this.state.rootID].components[ComponentType.polygon]
          .polygon = generatePolygon(4, 128, Math.PI / 4,  3.75, 1.75);
    }
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
  }
};