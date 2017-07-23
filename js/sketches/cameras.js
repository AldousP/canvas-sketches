var Cameras = function () {
  this.state = {
    meta : {
      name : 'Camera Tests',
      date : '07.17.2017',
      description : 'Panning and zoom examples.'
    },
    bgColor: '#c3667c',
    entityCountX : 6,
    entityCountY : 6
  };

  this.setup = function () {
    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new MovementSystem("b"));
    this.systemProcessor.addSystem(new PathSystem("c"));
    this.systemProcessor.addSystem(new SequenceSystem("d"));
    this.systemProcessor.addSystem(new CameraSystem("e"));
    this.systemProcessor.addSystem(new RenderingSystem("f"));

    var entities = [];
    var offsetX = sm.gfx.width / 6;
    var offsetY = sm.gfx.height / 3;

    for (var i = 0; i < this.state.entityCountX; i++) {
      for (var j = 0; j < this.state.entityCountY; j++) {
        var child = this.entityMapper.createEntity([
          new ColorComponent(Color.white),
          new RotationComponent(0),
          new PositionComponent(-offsetX + i * 48, -offsetY + j * 48),
          new PolygonComponent(generatePolygon(4, 32, Math.PI / 4))
        ], 'random entity #' + i);
        entities.push(child);
      }
    }

    entities.push(this.entityMapper.createEntity([
      new SequenceComponent({ length: 2.5, pos: 0 }),
      new ColorComponent(Color.green),
      new PositionComponent(0, 0),
      new PathComponent([
        new Vector(0, 0),
        new Vector(0, 96),
        new Vector(48, 96),
        new Vector(48, 0),
        new Vector(-96, 0),
        new Vector(-96, -96),
        new Vector(96, -96)
      ])
    ], 'path'));

    entities.push(this.entityMapper.createEntity([
      { name: 'ball' },
      new PositionComponent(0, 0),
      new ColorComponent(Color.cyan, Color.cyan),
      new PolygonComponent(generatePolygon(32, 6, 0))
    ], 'ball'));

    this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new CameraComponent({ pos: new Vector(0, 0),  width: 128,  height: 128,  zoom: 1 }),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4,  3.75, 1.75)),
      new ClipComponent(),
      new InputComponent(),
      new RenderRoot()
    ], 'root', entities);

  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta);
  }
};