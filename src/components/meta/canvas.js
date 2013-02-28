//==============================
// Canvas, 
// Use Goo.js as drawing library 
//==============================
define(["goo",
		"./meta"], function(Goo, Meta){

var Canvas = Meta.derive(function(){

return {

	tag : "canvas",

	viewModel : {
		width : ko.observable(256),
		height : ko.observable(256)
	},

	stage : null
}}, {

	initialize : function(){

		this.stage = Goo.create(this.$el[0]);

		this.viewModel.width.subscribe(function(newValue){
			this.resize();
		}, this);
		this.viewModel.height.subscribe(function(newValue){
			this.resize();
		}, this);
	},

	resize : function(){
		this.stage.resize( this.viewModel.width(), this.viewModel.height());
	}
}

})