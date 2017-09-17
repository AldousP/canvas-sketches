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
  STest.assert(entityMapper);
  STest.assert(entityMapper.store.length === 1);
}

function eventTest(it) {
  it('should fire an event');
  var processor = new SystemProcessor();
  var entityMapper = new EntityMapper();
  var target = entityMapper.buildEntity([]);

  processor.addSystem(new TestSystem());
  processor.fireEvent(target, 'TEST_EVENT');
  var event = processor.eventStore.events[0];
  STest.assert(processor.eventStore.events.length === 1);
  STest.assert(processor.eventStore.eventTypeMap['TEST_EVENT']);
  STest.assert(event.src === 'global');
}

STest.run([
  systemTest,
  entityMapperTest,
  eventTest
]);

function TestSystem () {
  this.name = 'TestSystem';
  this.setup = function () {

  };

  this.process = function (entities, fire, delta, mapper) {

  }
}
