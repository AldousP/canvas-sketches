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
		console.log('processing', entity);
	};

	this.listeners = {
		sampleEvent: {

		}
	}
}


function SampleSystemB () {
	this.name = 'sample_B';
	this.active = true;

	// Defines which entities will be passed into the process function.
	this.filter = [
		ComponentType.position,
		ComponentType.rotation,
	];

	this.process = function (entity, fire) {

	};

	this.listeners = {
		sampleEvent: {

		}
	}
}

