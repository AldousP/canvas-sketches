var CameraTests = function () {
  this.name = "Camera Tests";
  this.date = "06.27.2017";
  this.entities = [];

  this.state = {
    bgColor: "#3c53c0"
  };

  this.resourceDir = "img";

  this.setup = function () {
    var backgroundSystem = new BackgroundSystem();
    this.systemProcessor.addSystem(backgroundSystem);
  };

  this.update = function () {
    this.updateBase();
    this.systemProcessor.processEntities(this.delta, this.state, this.entities);
  }
};