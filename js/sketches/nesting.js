var Nesting = function () {
  this.state = {
    meta : {
      name : 'Nesting',
      date : '06.27.2017',
      description : 'Nested render scene with local and global rotation and position',
      guide : {
        a: 'Displayed above is a tree of entities which inherit',
        b: 'rotation and position properties.',
        c : 'The rendering system begins at a root entity and visits all children depth-first.'
      }
    },
    inputTargets : ['root'],
    activeTarget : 0,
    bgColor: '#360638',
    sampleVec: new Vector(0, 32)
  };

  this.root = {};
  this.resourceDir = 'assets';

  this.actions = [];

  this.setup = function () {
    this.root = this.entityMapper.createEntity([
      new RenderRoot(),
      new PositionComponent(0, 0),
      new InputComponent(),
      new MovementComponent(new Vector(), 0),
      new RotationComponent(0),
      new ColorComponent(Color.pink),
      new PolygonComponent(generatePolygon(8, 32))
    ], 'root');

    var A = this.entityMapper.createEntity([
      new PositionComponent(128, 0),
      new ColorComponent(Color.cyan),
      new RotationComponent(0),
      new MovementComponent(new Vector(), 0),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4, 3, 1))
    ]);

    var B = this.entityMapper.createEntity([
      new PositionComponent(-128, 0),
      new ColorComponent(Color.cyan),
      new RotationComponent(0),
      new MovementComponent(new Vector(), 0),
      new PolygonComponent(generatePolygon(4, 32, Math.PI / 4, 3, 1))
    ]);

    this.entityMapper.bindToParent(this.root, [A, B]);

    var C = this.entityMapper.createEntity([
      new PositionComponent(0, 48),
      new ColorComponent(Color.green),
      new RotationComponent(90),
      new MovementComponent(new Vector(), -305),
      new PolygonComponent(generatePolygon(4, 16, Math.PI, 1, 1))
    ]);

    this.entityMapper.bindToParent(A, [
      C,
      this.entityMapper.createEntity([
        new PositionComponent(0, -48),
        new ColorComponent(Color.green),
        new RotationComponent(0),
        new MovementComponent(new Vector(), 0),
        new PolygonComponent(generatePolygon(4, 16, Math.PI, 1, 1))
      ])
    ]);

    this.entityMapper.bindToParent(C, [
      this.entityMapper.createEntity([
        new PositionComponent(0, -32),
        new ColorComponent(Color.yellow),
        new PolygonComponent(generatePolygon(4, 12, Math.PI / 2, 1, 1))
      ]),
      this.entityMapper.createEntity([
        new PositionComponent(0, 32),
        new ColorComponent(Color.yellow),
        new PolygonComponent(generatePolygon(4, 12, Math.PI / 2, 1, 1))
      ])
    ]);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new MovementSystem("b"));
    this.systemProcessor.addSystem(new PhysicsSystem("c"));
    this.systemProcessor.addSystem(new RenderingSystem("d"));
    this.systemProcessor.addSystem(new InputSystem("e"));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta);
    sm.gfx.setFillColor(Color.white);
    sm.gfx.setTextConf({
      color: Color.white,
      size: 12,
      font: 'Arial',
      style : 'normal',
      align: 'center'
    });
    sm.gfx.text(this.state.meta.guide.a, 0, -sm.gfx.height / 2.5 + 24);
    sm.gfx.text(this.state.meta.guide.b, 0, -sm.gfx.height / 2.5 + 12);
    sm.gfx.text(this.state.meta.guide.c, 0, -sm.gfx.height / 2.5, 0);
  }
};