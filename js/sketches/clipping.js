var Clipping = function () {
  this.state = {
    meta : {
      name : 'Clipping',
      date : '07.14.2017',
      description : {
        a: 'Each square entity seen here is a child of a render root.',
        b : 'The same tree of child entities is bound to either square.',
        c : 'Either square can move around the parent plane while ',
        d : 'preserving the rendered children within.'
      }
    },
    inputTargets : ['triangle', 'top_left'],
    activeTarget : 1,
    bgColor: '#625b64'
  };

  this.root = {};
  this.resourceDir = 'assets';

  this.setup = function () {
    var left = this.entityMapper.createEntity([
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4)),
      new ClipComponent(),
      new ColorComponent(Color.white),
      new PositionComponent(-128, 0),
      new RotationComponent(0),
      new InputComponent()
    ], 'top_left');

    var right = this.entityMapper.createEntity([
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4)),
      new ColorComponent(Color.white),
      new ClipComponent(),
      new PositionComponent(128, 0),
      new RotationComponent(0)
    ], 'top_right');


    this.entityMapper.createEntity([
      new RenderRoot(),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4,  3.75, 1.75)),
      new ClipComponent(),
      new ColorComponent(Color.white),
      new PositionComponent(0, 0),
      new InputComponent(),
      new RotationComponent(0)
    ], 'root', [
        left,
        right
    ]);

    var children = [
      this.entityMapper.createEntity([
        new PolygonComponent(generatePolygon(4, 64)),
        new ColorComponent(Color.green),
        new MovementComponent(new Vector(), 45),
        new PositionComponent(0, 0),
        new RotationComponent(0),
        new InputComponent()
      ], 'triangle', [
        this.entityMapper.createEntity([
          new PolygonComponent(generatePolygon(32, 16)),
          new ColorComponent(Color.cyan),
          new PositionComponent(-32, -32)
        ]),
        this.entityMapper.createEntity([
          new PolygonComponent(generatePolygon(32, 16)),
          new ColorComponent(Color.cyan),
          new PositionComponent(32, -32)
        ]),
        this.entityMapper.createEntity([
          new PolygonComponent(generatePolygon(32, 16)),
          new ColorComponent(Color.cyan),
          new PositionComponent(-32, 32)
        ]),
        this.entityMapper.createEntity([
          new PolygonComponent(generatePolygon(32, 16)),
          new ColorComponent(Color.cyan),
          new PositionComponent(32, 32)
        ])
      ])
    ];

    this.entityMapper.bindToParent(left, children);
    this.entityMapper.bindToParent(right, children);

    this.systemProcessor.addSystem(new BackgroundSystem("a"));
    this.systemProcessor.addSystem(new MovementSystem("b"));
    this.systemProcessor.addSystem(new RenderingSystem("c"));
    this.systemProcessor.addSystem(new InputSystem("d"));
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(this.state, delta);
    sm.gfx.setFillColor(Color.white);
    sm.gfx.text(true, "Use WASD & Arrows to move.", 0, sm.gfx.height / 3, 12, 'Arial');
    sm.gfx.text(true, this.state.meta.description.a, 0, -sm.gfx.height / 2.5  + 24, 12, 'Arial');
    sm.gfx.text(true, this.state.meta.description.b, 0, -sm.gfx.height / 2.5 + 12,12, 'Arial');
    sm.gfx.text(true, this.state.meta.description.c, 0, -sm.gfx.height / 2.5, 12, 'Arial');
    sm.gfx.text(true, this.state.meta.description.d, 0, -sm.gfx.height / 2.5 - 12, 12, 'Arial');
  }
};