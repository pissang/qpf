//===================================
// Panel
// Container has title and content
//===================================
define(["./container",
		"knockout"], function(Container, ko){

var Panel = Container.derive(function(){

return {

	title : ko.observable("")
	
}}, {

	type : 'PANEL',

	css : 'panel',

	template : '<div class="wse-panel-header">\
					<div class="wse-panel-title" data-bind="html:title"></div>\
					<div class="wse-panel-tools"></div>\
				</div>\
				<div class="wse-panel-body" data-bind="foreach:children" class="wse-children">\
					<div data-bind="wse_view:$data"></div>\
				</div>\
				<div class="wse-panel-footer"></div>',
	
	afterRender : function(){
		var $el = this.$el;
		this._$header = $el.children(".wse-panel-header");
		this._$tools = this._$header.children(".wse-panel-tools");
		this._$body = $el.children(".wse-panel-body");
		this._$footer = $el.children(".wse-panel-footer");
	},

	afterResize : function(){
		// stretch the body when the panel's height is given
		if( this._$body && this.height() ){
			var headerHeight = this._$header.height();
			var footerHeight = this._$footer.height();

			// PENDING : here use jquery innerHeight method ?because we still 
			// need to consider the padding of body
			this._$body.height( this.$el.height() - headerHeight - footerHeight );
	
		}
		Container.prototype.afterResize.call(this);
	}
})

Container.provideBinding("panel", Panel);

return Panel;

})

