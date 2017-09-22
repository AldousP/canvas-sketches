function systemTest(it) {
  it('should create a system processor and add a system');

  var processor = new SystemProcessor();
  var system = new TestSystem();

  processor.addSystem(system);

  STest.assert(processor);
  STest.assert(system);
  STest.assert(processor.systems.length === 1);
}

function entityMapperTest(it) {
  it('should create an entity mapper and add an entity');

  var entityMapper = new EntityMapper();
  var entity = entityMapper.buildEntity([]);
  entityMapper.tagEntity(entity.ID, 'SAMPLE_TAG');

  STest.assert(entityMapper.entityCount === 1);
  STest.assert(entityMapper.tagMap['SAMPLE_TAG'].length === 1);
}

function entityMapperDeleteTest(it) {
  it('should create add an entity and delete an entity');

  var entityMapper = new EntityMapper();
  var entity = entityMapper.buildEntity([], [], ['test_component']);
  STest.assert(entityMapper.entityCount === 1);
  entityMapper.deleteEntity(entity.ID);
  STest.assert(entityMapper.entityCount === 0);
}

function eventCullingTest(it) {
  it('should fire and cull an event.');

  var processor = new SystemProcessor();
  var entityMapper = new EntityMapper();
  var target = entityMapper.buildEntity([]);

  processor.fireEvent(target.ID, 'TEST_EVENT', { testValue: 'Something of note.' });
  processor.addSystem(new TestSystem());

  STest.assert(processor.eventStore.eventCount === 1);
  processor.process(entityMapper, 0);
  STest.assert(processor.eventStore.eventCount === 0);
}

function eventPoolingTest(it) {
  it('should fire and cull an event, which is then pooled and reused');

  var processor = new SystemProcessor();
  var entityMapper = new EntityMapper();
  var target = entityMapper.buildEntity([]);

  processor.fireEvent(target.ID, 'TEST_EVENT', { testValue: 'Something of note.' });
  processor.addSystem(new TestSystem());
  processor.process(entityMapper, 0);

  STest.assert(processor.eventStore.pooledEventsByType['TEST_EVENT'].length === 1);
}

/**
 * Runs the tests.
 */
STest.run([
  systemTest,
  entityMapperTest,
  entityMapperDeleteTest,
  eventCullingTest,
  eventPoolingTest
]);

// Helper Classes
function TestSystem () {
  this.name = 'TestSystem';
  this.setup = function () {

  };

  this.process = function (entities, fire, delta, mapper) {

  };
  
  this.listeners = {
    testListener: {
      type: 'TEST_EVENT',
      handle: function (data, target, delta) {
        STest.assert(data.testValue === 'Something of note.');
        STest.assert(target.ID === 0);
      }
    }
  }
}
