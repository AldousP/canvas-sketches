function SampleSystem () {
	this.name = 'sample_A';
	this.active = true;

	// Defines which entities will be passed into the process function.
	this.filter = [
		ComponentType.position,
		ComponentType.color,
		ComponentType.rotation
	];
	
	this.process = function (entity, fire) {
		fire(entity, {
			type: 'MOVE_BY',
			x: 0,
			y: 0
		});
	};
}