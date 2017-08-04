var FSMAnimations = function () {
  this.state = {
    assets: 'assets',
    meta : {
      name : 'FSM Animations',
      date : '08.01..2017',
      description : 'Controlling animation state via an FSM.'
    },
    systemStates : {
      rendering: {
        assets: 'assets/animations/'
      },
      background : {
        bgColor: '#309bbc'
      }
    }
  };

  var SampleSystem = function () {
    this.name = 'Sample System.';
    this.filter = [ 'pos', 'col' ];
    this.updateEntities = function (entities) {
      console.log('updating entities ' + entities);
    }
  };
  
  var systems = [
      new SampleSystem()
  ];

  var Entities = function () {
    this.entities = [];
    this.componentMap = {};

    /**
     * Creates a new entity and returns an ID.
     * @param name the entity name ( Non-unique: Informal usage. )
     * @param components composition of the new entity.
     * @param children an array of IDs to associate as children.
     */
    this.create = function (name, components, children) {
      var entityID = this.entities.length;
      var entityComponents = {};

      /**
       * 1. create named component map for entity use
       * 2. associate entity with components for lookups.
       */
      for (var i = 0; i < components.length; i++) {
        var comp = components[i];
        entityComponents[comp.name] = comp;

        if (!this.componentMap[comp.name]) this.componentMap[comp.name] = [];
        var index = this.componentMap[comp.name].indexOf(entityID);

        if (index === -1) {
          this.componentMap[comp.name].push(entityID);
        }
        this.componentMap[comp.name] = this.componentMap[comp.name];
      }

      this.entities.push({
        id: entityID,
        name: name,
        comps: entityComponents
      });

      return entityID;
    };

    /**
     * Removes the designated entity from the entity list and component map
     */
    this.destroy = function (ID) {
      var entity = this.entities[ID];
      var comps = entity.comps;

      // Remove from component maps
      if (comps) {
        var compNames = Object.keys(comps);
        for (var i = 0; i < compNames.length; i++) {
          var compName = compNames[i];
          var compMapping = this.componentMap[compName];
          if (compMapping) {
            var entityIndex = compMapping.indexOf(ID);
            if (entityIndex !== -1) {
              compMapping.splice(entityIndex, 1);
            }
          }
        }
      }

      // Remove from entity list
      this.entities.splice(ID, 1);
    };

    this.getEntities = function (ID) {
      return this.entities[ID]
    };
  };

  this.setup = function () {
    var em = new Entities();
    var id = em.create('sampleEntity', [
        new PositionComponent(),
        new ColorComponent()
    ]);

    // Run through processor.
    for (var i = 0; i < systems.length; i ++) {
      var sys = systems[i];

      var listLengths = {};
      var longestName = null;
      var longestLen = -1;
      for (var j = 0; j < sys.filter.length; j++) {
        var len = em.componentMap[sys.filter[j]].length;
        listLengths[sys.filter[j]] = len;
        if (len > longestLen) {
          longestLen = len;
          longestName = sys.filter[j];
        }
      }

      console.log(longestName);
      // console.log(componentLists);
    }

    // em.destroy(id);
    // console.log(em);
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
  }
};