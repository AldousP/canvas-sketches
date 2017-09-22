function EntityMapper() {
	'use strict';

	// Used rather than an index, to avoid spillage bugs.
	this.entity_ID = 0;
	// Maps entity IDs to component type. The same entity may appear in multiple lists.
	this.map = {};
	// A list of all entities by ID
	this.store = {};
	// A mapping of entities to tags.
	this.tagMap = {};

	this.entityCount = 0;

	this.addEntity = function (newEntity) {
		this.store[newEntity.ID] = newEntity;
		this.entityCount++;
	};

	var that = this;
	this.deleteEntity = function (ID) {
	  var entity = this.store[ID];
	  this.store[ID] = undefined;
	  console.log(this.tagMap);
	  var tags = entity.tags;
	  tags.forEach(function (tag) {
      var map = that.tagMap[tag];
	    console.log(map);
	    map.splice(map.indexOf(ID, 1));
    });
    console.log(that);
    this.entityCount--;
  };

	this.buildEntity = function (components, children, tags) {
		var entity = new Entity();
		entity.ID = this.entity_ID ++;
		entity.components = {};
		entity.children = children ? children : [];
		var that = this;
		entity.children.forEach(function (child) {
		  that.store[child].parent = entity.ID;
    });
		this.injectComponents(entity, components);
		this.addEntity(entity);

		if (tags) {
		  tags.forEach(function (tag) {
		    that.tagEntity(entity.ID, tag);
      })
    }

		return entity;
	};

	this.injectComponents = function (entity, components) {
		for (var i = 0; i < components.length; i++) {
			var comp = components[i];
			if (!this.map[comp.name]) {
				this.map[comp.name] = [];
			}
			this.map[comp.name].push(entity.ID);
			entity.components[comp.name] = comp;
		}
	};
	
	this.tagEntities = function (entities, tagName) {
	  var that = this;
	  entities.forEach(function (entity) {
	    that.tagEntity(entity, tagName)
    })
  };

  this.tagEntity = function (entityID, tagName) {
    if (!this.tagMap[tagName]) {
      this.tagMap[tagName] = [];
    }

    if (this.tagMap[tagName].indexOf(entityID) === -1) {
      this.tagMap[tagName].push(entityID);
      this.store[entityID].tags.push(tagName);
    }
  };

  this.getEntitiesForTag = function (tag) {
    return this.tagMap[tag];
  };

  this.getFirstOfTag = function (tag) {
    return this.store[this.tagMap[tag][0]];
  }
}