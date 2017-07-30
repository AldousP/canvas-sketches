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

    var ballA = this.entityMapper.createEntity([
        new PositionComponent(),
        new PathComponent([new Vector(-128, 128), new Vector(128, 128)]),
        new PolygonComponent(polyCircle(16)),
        new ColorComponent(Color.white, Color.white),
        new SequenceComponent([
          { name: 'positionSequence', type: SequenceType.PING_PONG, length: 10, pos: 0}
        ])
    ]);

    var ballB = this.entityMapper.createEntity([
      new PositionComponent(),
      new PathComponent([new Vector(-128, 0), new Vector(128, 0)]),
      new PolygonComponent(polyCircle(16)),
      new ColorComponent(Color.white, Color.white),
      new SequenceComponent([
        { name: 'positionSequence', type: SequenceType.PING_PONG, length: 5, pos: 0}
      ])
    ]);

    var ballC = this.entityMapper.createEntity([
      new PositionComponent(),
      new PathComponent([new Vector(-128, -128), new Vector(128, -128)]),
      new PolygonComponent(polyCircle(16)),
      new ColorComponent(Color.white, Color.white),
      new SequenceComponent([
        { name: 'positionSequence', type: SequenceType.PING_PONG, length: 2.5, pos: 0}
      ])
    ]);

    entities.push(ballA, ballB, ballC);

    var root = this.entityMapper.createEntity([
      new RenderRoot()
    ], 'root', entities );

    this.state.rootID = root.ID;
    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new PathSystem());
    this.systemProcessor.addSystem(new RenderingSystem());
    this.systemProcessor.addSystem(new SequenceSystem({
      positionSequence: {
        update: function (entity, progress) {
          var path = smx.path(entity);
          var pos = smx.pos(entity);
          path.alpha = progress;
          setVecVec(pos, path.pos);
        },
        
        complete: function (entity) {

        }
      }
    }));
    this.systemProcessor.addSystem(new CameraSystem());
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
    ;
  };
};