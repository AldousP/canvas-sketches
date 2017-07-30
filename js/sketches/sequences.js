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
  var words = ['Biff.', 'Zap.', 'Pow.', 'Thunk.', 'Completed and iteration of a sequence.'];

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
        new PositionComponent(-128, 128),
        new PathComponent([new Vector(-128, 128), new Vector(128, 128)]),
        new PolygonComponent(polyCircle(16)),
        new ColorComponent(Color.white, Color.white),
        new SequenceComponent([
          {
            name: 'positionSequence',
            easing: 'squared',
            type: SequenceType.PING_PONG,
            length: 2,
            pos: 0
          }
        ])
    ]);

    entities.push(ballA);

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
          sm.gfx.text(randomWord(), 0, 0);
        }
      }
    }));
    this.systemProcessor.addSystem(new CameraSystem());
  };
  
  var randomWord = function () {
    return words[Math.floor(SMath.rand(0, words.length))];
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
  };
};