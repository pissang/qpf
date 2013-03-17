//============================================
// Tab Container
// Children of tab container must be a panel
//============================================
define(["./panel",
		"./container",
		"../base",
		"knockout"], function(Panel, Container, Base, ko){

var Tab = Panel.derive(function(){

	var ret = {
			
		actived : ko.observable(0),

		maxTabWidth : 100,

		minTabWidth : 30

	}

	ret.actived.subscribe(function(idx){
		this._active(idx);
	}, this);

	return ret;
}, {

	type : "TAB",

	css : 'tab',

	add : function(item){
		if( item.instanceof(Panel) ){
			Panel.prototype.add.call(this, item);
		}else{
			console.error("Children of tab container must be instance of panel");
		}
		this._active( this.actived() );
	},

	eventsProvided : _.union('change', Container.prototype.eventsProvided),

	initialize : function(){
		// compute the tab value;
		this.children.subscribe(function(){
			this._updateTabSize();
		}, this);
	},

	template : '<div class="wse-tab-header">\
					<ul class="wse-tab-tabs" data-bind="foreach:children">\
						<li data-bind="click:$parent.actived.bind($data, $index())">\
							<a data-bind="html:title"></a>\
						</li>\
					</ul>\
					<div class="wse-tab-tools"></div>\
				</div>\
				<div class="wse-tab-body">\
					<div class="wse-tab-views" data-bind="foreach:children" class="wse-children">\
						<div data-bind="wse_view:$data"></div>\
					</div>\
				</div>\
				<div class="wse-tab-footer"></div>',

	afterRender : function(){
		this._updateTabSize();
		// cache the $element will be used
		var $el = this.$el;
		this._$header = $el.children(".wse-tab-header");
		this._$tools = this._$header.children(".wse-tab-tools");
		this._$body = $el.children(".wse-tab-body");
		this._$footer = $el.children('.wse-tab-footer');

		this._active( this.actived() );
	},

	afterResize : function(){
		this._adjustCurrentSize();
		this._updateTabSize();
		Container.prototype.afterResize.call(this);
	},

	_unActiveAll : function(){
		_.each(this.children(), function(child){
			child.$el.css("display", "none");
		});
	},

	_updateTabSize : function(){
		var length = this.children().length,
			tabSize = Math.floor((this.$el.width()-20)/length);
		// clamp
		tabSize = Math.min(this.maxTabWidth, Math.max(this.minTabWidth, tabSize) );

		this.$el.find(".wse-tab-header>.wse-tab-tabs>li").width(tabSize);
	},

	_adjustCurrentSize : function(){

		var current = this.children()[ this.actived() ];
		if( current && this._$body ){
			var headerHeight = this._$header.height(),
				footerHeight = this._$footer.height();

			if( this.height() &&
				this.height() !== "auto" ){
				current.height( this.$el.height() - headerHeight - footerHeight );
			}
			// PENDING : compute the width ???
			if( this.width() == "auto" ){
			}
		}
	},

	_active : function(idx){
		this._unActiveAll();
		var current = this.children()[idx];
		if( current ){
			current.$el.css("display", "block");

			// Trigger the resize events manually
			// Because the width and height is zero when the panel is hidden,
			// so the children may not be properly layouted, We need to force the
			// children do layout again when panel is visible;
			this._adjustCurrentSize();
			current.afterResize();

			this.trigger('change', idx, current);
		}

		this.$el.find(".wse-tab-header>.wse-tab-tabs>li")
				.removeClass("actived")
				.eq(idx).addClass("actived");
	}

})

Container.provideBinding("tab", Tab);

return Tab;

})