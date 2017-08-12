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
    this.filter = [
        ComponentType.position,
        ComponentType.rigidbody,
        ComponentType.color,
        ComponentType.text
    ];
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

    em.create('entity1', [
        new PositionComponent(),
        new ColorComponent()
    ]);

    em.create('entity2', [
      new PositionComponent(),
      new RigidBodyComponent()
    ]);

    em.create('entity3', [
      new PositionComponent(),
      new ColorComponent()
    ]);

    em.create('entity4', [
      new PositionComponent(),
      new RigidBodyComponent(),
      new TextComponent()
    ]);

    // Run through processor.
    for (var i = 0; i < systems.length; i ++) {
      var sys = systems[i];

      var longestName = null;
      var longestLen = -1;
      var listLens = [];
      for (var j = 0; j < sys.filter.length; j++) {
        var len = em.componentMap[sys.filter[j]].length;
        listLens.push({
          name: sys.filter[j],
          len: len
        });

        if (len > longestLen) {
          longestLen = len;
          longestName = sys.filter[j];
        }
      }

      listLens.sort(function (a, b) {
        return a.len > b.len;
      });

      console.log(listLens);


      // rootList.forEach(function (value) {
      //   var valuePresent = false;
      //   for (var j = 1; j < setsKeys.length; j++) {
      //     var comparisonSet = sets[setsKeys[j]];
      //     valuePresent = comparisonSet.indexOf(value) > -1;
      //     if (j < 1 && !valuePresent) {
      //       break;
      //     }
      //   }
      //
      //   if (valuePresent) {
      //     finalEntities.push(value);
      //   }
      // });
      // for (var k = 0; k < listLens.length; k++) {
      //   var listStruct = listLens[k];
      //   var currentList = em.componentMap[listStruct.name];
      //   console.log('-----');
      //   for (var l = 0; l < currentList.length; l++) {
      //     console.log(currentList[l]);
      //     console.log('--');
      //   }
      // }
    }

    // em.destroy(id);
    // console.log(em);
  };

  this.update = function (delta) {
    this.systemProcessor.processEntities(delta);
  }
};