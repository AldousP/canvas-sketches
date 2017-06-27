MountExample = function () {
  this.name = "Mount Example";
  this.date = "06.24.2017";

  this.state = {
    bgColor: Color.red
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
      new RenderTestSystem("A", this.camera, this.view)
    ]);
  };

  this.update = function () {

    this.updateFrameCount();
    /*
     *  From within this ctx, the program may access sm's various modules
     *  as well as use the systemHandler and entityHandlers declared on this
     *  object's new prototype to create programs.
     *
     */
    this.systemHandler.updateSystems(this.delta, this.entityHandler, this.state);
  }
};