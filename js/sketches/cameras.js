var Cameras = function () {
  this.state = {
    meta : {
      name : 'Camera Tests',
      date : '07.17.2017',
      description : 'Panning and zoom examples.'
    },
    systemStates : {
      background : {
        bgColor: '#c3667c'
      }
    },
    entityCountX : 6,
    entityCountY : 6,
    ballID : -1
  };

  this.setup = function () {
    this.systemProcessor.addSystem(new BackgroundSystem());
    this.systemProcessor.addSystem(new MovementSystem());
    this.systemProcessor.addSystem(new PathSystem());
    this.systemProcessor.addSystem(new SequenceSystem());
    this.systemProcessor.addSystem(new CameraSystem());
    var that = this;
    this.systemProcessor.addSystem({
      name: 'app-cameras',

      processEntity: function (entity, state, delta, entities) {
        var cam = smx.cam(entity);
        if (cam) {
          var ball = entities[that.state.ballID];
          that.fireEvent('updateCameraPos', { entityID: entity.ID, pos: smx.pos(ball)})
        }
      },

      listeners : {
        input_left: function () {
          that.fireEvent('moveEntity', { entityID : that.state.ballID, amt : new Vector(-5, 0) });
        },
        input_right: function () {
          that.fireEvent('moveEntity', { entityID : that.state.ballID, amt : new Vector(5, 0) });
        },
        input_up: function () {
          that.fireEvent('moveEntity', { entityID : that.state.ballID, amt : new Vector(0, 5) });
        },
        input_down: function () {
          that.fireEvent('moveEntity', { entityID : that.state.ballID, amt : new Vector(0, -5) });
        },
        input_left_bump: function () {
          that.fireEvent('zoomCamOut', { entityID : that.state.rootID, amt : .15 });
        },
        input_right_bump: function () {
          that.fireEvent('zoomCamIn', { entityID : that.state.rootID, amt : .15 });
        }
      }
    });

    this.systemProcessor.addSystem(new RenderingSystem());
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
        new Vector(96, -96),
        new Vector(96, 48),
        new Vector(-48, 48),
        new Vector(-48, 0),
        new Vector(0, 0)
      ])
    ], 'path'));

    var ball = this.entityMapper.createEntity([
      { name: 'ball' },
      new PositionComponent(0, 0),
      new ColorComponent(Color.cyan, Color.cyan),
      new PolygonComponent(generatePolygon(32, 6, 0))
    ], 'ball');


    entities.push(ball);
    var root = this.entityMapper.createEntity([
      new ColorComponent(Color.white),
      new PositionComponent(0, 0),
      new RotationComponent(0),
      new CameraComponent({ pos: new Vector(0, 0),  width: 128,  height: 128,  zoom: 1 }),
      new PolygonComponent(generatePolygon(4, 128, Math.PI / 4,  3.75, 1.75)),
      new ClipComponent(),
      new RenderRoot()
    ], 'root', entities);

    this.state.ballID = ball.ID;
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
    this.systemProcessor.processEntities(this.state, delta);


  }
};