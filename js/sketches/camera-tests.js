var CameraTests = function () {
  this.name = "Camera Tests";
  this.date = "06.27.2017";

  this.state = {
    bgColor: "#3c53c0"
  };

  this.resourceDir = "img";

  this.setup = function () {
    this.entityHandler.addEntity(buildEntity("ViewA", [
      (new PositionComponent(0, 0)),
      (new ViewComponent(new Vector(0, 0), sm.gfx.width * .75, sm.gfx.height * .75)),
      (new CameraComponent())
    ]));

    sm.log.notify("Adding Rendering System", "system-handler");
    this.systemHandler.addSystems([
      new RenderingSystem("A")
      // new ViewportSystem("B")
    ]);
  };

  this.update = function () {

    this.updateFrameCount();
    this.systemHandler.updateSystems(this.delta, this.entityHandler, this.state);
  }
};