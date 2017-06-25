if (!window.programs) {
  window.programs = {};
}

window.programs.mountExample = function () {
  this.name = "Mount Example";
  this.date = "06.24.2017";
  this.padding = .95;

  this.setup = function () {
    sm.log.notify("Setting up sketch...", this.name);

    view = new View(sm.canvas.width * this.padding, sm.canvas.height * this.padding);
    view.worldWidth = 3;
    view.worldHeight = 3;

    this.entityHandler.addEntity(buildEntity("Octagon", [
      (new PolygonComponent(generatePolygon(8, .25))),
      (new PositionComponent()),
      (new VelocityComponent(0, -.25)),
      (new AccelerationComponent(0, -.25))
    ]));

    this.entityHandler.addEntity(buildEntity("Square", [
      (new PolygonComponent(generatePolygon(4, .55))),
      (new PositionComponent(0, .5)),
      (new VelocityComponent(0, -.15)),
      (new AccelerationComponent(0, -.55))
    ]));

    this.entityHandler.addEntity(buildEntity("Circle", [
      (new PolygonComponent(generatePolygon(32, .15))),
      (new PositionComponent(.15, .5)),
      (new VelocityComponent(0, -.25)),
      (new AccelerationComponent(0, -.25))
    ]));

    this.entityHandler.addEntity(buildEntity("Dodecagon", [
      (new PolygonComponent(generatePolygon(12, .2))),
      (new PositionComponent(.15, -.15)),
      (new VelocityComponent(0, -.25)),
      (new AccelerationComponent(0, -.25))
    ]));

    this.systemHandler.addSystems([
      new PhysicsSystem("A"),
      new RenderingSystem("B")
    ]);
  };

  this.update = function (sm) {
    // sm.log.notify("Sketch Running", this.name);
    /* From within this ctx, the program may access sm's various modules
    *  as well as use the systemHandler and entityHandlers declared on this
    *  object's prototype to create a simulation.
    *
    * */

    this.systemHandler.updateSystems(this.delta, this.entityHandler);
  }
};