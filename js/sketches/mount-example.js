if (!window.programs) {
  window.programs = {};
}

window.programs.mountExample = function () {
  this.name = "Mount Example";
  this.date = "06.24.2017";
  this.padding = .95;
  this.camera = new Camera();
  this.panIncrement = 1;

  this.state = {};
  this.resourceDir = "/img/";

  this.setup = function () {
    this.entityHandler.addEntity(buildEntity("Octagon", [
      (new PolygonComponent(generatePolygon(8, .25))),
      (new PositionComponent()),
      (new VelocityComponent(0, -.25)),
      (new AccelerationComponent(0, -.25))
    ]));

    this.view = new View(sm.canvas.width * this.padding, sm.canvas.height * this.padding);
    this.view.worldWidth = 1.5;
    this.view.worldHeight = 1.5;

    this.systemHandler.addSystems([
      // new PhysicsSystem("A"),
      new RenderingSystem("B", this.camera, this.view)
    ]);

    var that = this;
    sm.gfx.loadImage("sawtooth.png", function (e) {
      that.state.sawTooth = e.path[0];
    });

    this.inputMappings = {
      virtualButtonLeft : function () {
        that.camera.position.x -= that.panIncrement * that.delta;
      },

      virtualButtonRight : function () {
        that.camera.position.x += that.panIncrement * that.delta;
      },

      virtualButtonUp : function () {
        that.camera.position.y -= that.panIncrement * that.delta;
      },

      virtualButtonDown : function () {
        that.camera.position.y += that.panIncrement * that.delta;
      }
    };
  };

  this.manageInput = function () {
    var keys = Object.keys(sm.input.state);
    var that = this;
    keys.forEach(function (key) {
      var method = that.inputMappings[key];
      if (method) {
        method();
      }
    });
  };

  this.update = function (sm) {
    /*
     *  From within this ctx, the program may access sm's various modules
     *  as well as use the systemHandler and entityHandlers declared on this
     *  object's new prototype to create programs.
     *
     */
    this.updateFrameCount();
    this.systemHandler.updateSystems(this.delta, this.entityHandler, this.state);
    this.manageInput();
  }
};