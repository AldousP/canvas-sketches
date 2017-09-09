function RenderingSystem () {
	this.name = 'rendering-system';

	this.filter = [
		ComponentType.renderable
	];
	
	this.process = function (entity, fire) {
		console.log(entity);
	};
}