MountExample = function () {
  this.name = "Mount Example";
  this.date = "06.24.2017";
  this.padding = .95;
  this.camera = new Camera();
  this.view = new View(sm.canvas.width * this.padding, sm.canvas.height * this.padding);
	this.view.worldWidth = 3;
	this.view.worldHeight = 3;
	this.state = {
		bgColor : Color.blue
	};

	this.resourceDir = "img";

  this.setup = function () {
		this.entityHandler.addEntity(buildEntity("Octagon", [
			(new PolygonComponent(generatePolygon(8, .25))),
			(new PositionComponent()),
			(new VelocityComponent(0, -.25)),
			(new AccelerationComponent(0, -.25))
		]));

    this.systemHandler.addSystems([
      new RenderingSystem("A", this.camera, this.view)
    ]);

		// var that = this;
		// sm.gfx.loadImage("sawtooth.png", function (e) {
		// 	that.state.sawTooth = e.path[0];
		// });
	};

  this.update = function () {
    /*
    *  From within this ctx, the program may access sm's various modules
    *  as well as use the systemHandler and entityHandlers declared on this
    *  object's new prototype to create programs.
    *
    */
    this.systemHandler.updateSystems(this.delta, this.entityHandler, this.state);
  }
};