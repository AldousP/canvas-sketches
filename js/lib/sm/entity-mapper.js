function EntityMapper() {
  this.entities = [];  // Linear mapping of all entities
  this.entityMap = {}; // Mapping of entities by component type.

  this.actions = [];
  this.actionHistory = [];
  this.actionHistoryLength = 1000;

	this.createEntity = function (components, name, children) {
	  var entity = new Entity();
	  entity.ID = this.entities.length;
	  if (name) {
      entity.name = name;
    }
	  var that = this;
    components.forEach(function (component) {
      entity.components[component.name] = component;
      if (!that.entityMap[component.name]) {
        that.entityMap[component.name] = [];
      }
      that.entityMap[component.name].push(entity);
    });
    this.entities.push(entity);

    if (children) {
      this.bindToParent(entity, children);
    }

    return entity;
  };
	
	this.injectComponents = function (entity, components) {
    var that = this;
    components.forEach(function (component) {
      entity.components[component.name] = component;
      if (!that.entityMap[component.name]) {
        that.entityMap[component.name] = [];
      }
      that.entityMap[component.name].push(entity);
    })
  };
	
	this.bindToParent = function (parent, children) {
	  var childrenComponent = new ChildrenComponent();
	  var parentComponent = new ParentComponent(parent.ID);
	  for (var i = 0; i < children.length; i ++) {
      var child = children[i];
      childrenComponent.children.push(child.ID);
      this.injectComponents(child, [parentComponent]);
    }
    this.injectComponents(parent, [childrenComponent]);
  };
  
  this.fireAction = function (action) {
    this.actions.push(action);
  };

  this.logEntities = function () {
    console.log(JSON.stringify(this.entities, null, '\t'));
  };
  
  this.processActions = function (delta) {
    while (this.actions.length) {
      var action = this.actions.shift();
      if (action) {
        var entity = this.entities[action.entityID];
        var srcComp = entity.components[action.srcComp];
        var result = action.exec(srcComp, action.params, delta);
        var keys = Object.keys(result);
        keys.forEach(function (key) {
          srcComp[key] = result[key];
        });

        this.actionHistory.push({
          timestamp : new Date().getTime(),
          name : action.name,
          target : action.entityID,
          result : result
        });

        if (this.actionHistory.length > this.actionHistoryLength) {
          this.actionHistory.shift();
        }
      }
    }
  }
}