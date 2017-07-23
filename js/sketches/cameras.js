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

    this.state.camera = this.entityMapper.createEntity([
      new RenderRoot(),
      new PathComponent([
          new Vector(0, 0),
          new Vector(0, 64),
          new Vector(100, 86),
          new Vector(100, 200)
      ]),
      new CameraComponent({
        pos: new Vector(0, 0),
        width: 128,
        height: 128,
        zoom: 1
      }),
      new PolygonComponent(new Polygon([
        new Vector(0, 0),
        new Vector(0, 64),
        new Vector(100, 86),
        new Vector(100, 200)
      ])),
      // new PolygonComponent(generatePolygon(4, 128, Math.PI / 4,  3.75, 1.75)),
      // new ClipComponent(),
      new SequenceComponent({
        length: 10,
        pos: 0
      }),
      new ColorComponent(Color.white),
      new PositionComponent(0, 0),
      new InputComponent(),
      new RotationComponent(0)
    ], 'root', entities);

  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta);
  }
};