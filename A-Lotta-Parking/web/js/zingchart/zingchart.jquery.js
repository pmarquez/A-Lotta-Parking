(function ( $ ) {
	
	$.fn.extend( {
	
		zingchart : function( data ) {
			
			var self = this;
			
			// refers to the 'id' html attribute, which ZingChart uses to bind a
			// chart to it's location on the page
			var id = $(this).attr('id'); // set id = the id of the object on which .zingchart was called
			this.getID = function() { return id; }
			//console.log('just set id to: ' + id);
			
			// object containing the JSON used to configure the chart
			var JSON = { };
			this.getJSON = function() {
					return JSON;
			}
			
			/**
			 * function setJSON()
			 * extends the core JSON data used in the chart with the new object submitted (so only updates 
			 * values explicitly included in the new object)
			 * args: newJSON [object] - the new JSON data to use
			 *       reRender [boolean] - if set to false, the JSON will be updated, but the chart will not 
			 *                            re-render with the new data yet. If left out, defaults to true.
			 */
			this.setJSON = function(newJSON, reRender) {
				var JSONDefault = { type   : 'line',
									scaleX : { zooming: 'true' }
				};
				JSON = $.extend( true, {}, JSONDefault, JSON, newJSON );
				zingchart.exec(id, 'modify', { data: JSON } );
				if (reRender !== false) {
					zingchart.exec(id, 'update');
				}
				return this;
			}			
			
			
			// object referring to the options that can be set when calling the zingchart.render() function
			// e.g. render() accepts an object as an arg, which contains various settings (e.g. width, height)
			// this object that zingchart.render() takes must have a 'data' section, which is the core JSON data
			// structure used to render the chart. the renderOptions object here refers to the portions of the render() 
			// arg besides 'data'
			var renderOptions = {};			
			
			this.setRenderOptions = function(newRenderOptions) {
				var renderOptionsDefault = { width: 'auto' }
				renderOptions = $.extend( true, {}, renderOptionsDefault, newRenderOptions );
				return this;
			}
			this.getRenderOptions = function() {
				return renderOptions;
			}
			
			
			//------------------------------------------------------------------------------
			// functions to set the global zingchart options
			//------------------------------------------------------------------------------		
			this.setASYNC = function(newValue) {
				if ( typeof(newValue) === 'boolean' || newValue == (0 || 1) ) {
					zingchart.ASYNC = newValue;
				}
				return this;
			}
			this.setFONTFAMILY = function(newValue) {
				zingchart.FONTFAMILY = newValue;
				return this;
			}
			this.setFONTSIZE = function(newValue) {
				if ( typeof(newValue) === 'number' ) {
					zingchart.FONTSIZE = newValue;
				}
				return this;
			}
			this.setZCOUTPUT = function(newValue) {
				if ( typeof(newValue) === 'boolean' || newValue == (0 || 1) ) {
					zingchart.ZCOUTPUT = newValue;
				}
				return this;
			}
			
			
			//-------------------------------------------------------------------------------
			// include the four core ZingChart object functions
			//-------------------------------------------------------------------------------
			
			// Binds an event to a chart (or to all charts in a page).
			this.bind = function(eventName, handler, global) {
				if (global === true) {
					zingchart.bind(null, eventName, handler);
				} else {
					// in this case only bind from the current object
					zingchart.bind(this.id, eventName, handler);
				}
				return this;
			}			
			
			// The API entry method, used to call various API commands against the chart.
			// this allows any ZingChart API function to be accessed via the jQuery object
			this.exec = function(apicall, options) {
				zingchart.exec(id, apicall, options);
				return this;
			}
			
			// calls the zingchart.render(), using the existing options our object has, 
			// while allowing these options to be extended with new ones
			this.render = function(newJSON, newRenderOptions) {
				if (newJSON !== undefined) {
					setJSON(newJSON);
				}

				if (newRenderOptions !== undefined) {
					setRenderOptions(newRenderOptions);
				}	
				
				var renderArgs = renderOptions;
				renderArgs.data = JSON;
				
				// push id of container (the element on which .zingchart() was called to the options 
				// object (this will be passed to the Zingchart render function)
				renderArgs.id = this.getID();

				zingchart.render( renderArgs );
				
				return this;
			} // end render()
			
			// Unbinds an event from a chart (or from all charts in a page).
			// if the third param is true, this will affect all charts on the page
			this.unbind = function(eventName, handler, global) {
				if (global === true) {
					zingchart.unbind(null, eventName, handler);
				} else {
					// in this case only unbind from the current object
					zingchart.unbind(id, eventName, handler);
				}
				return this;
			}


			//-------------------------------------------------------------------------------
			// some general utility functions to allow quick jquery style access to the ZingChart API
			//-------------------------------------------------------------------------------			
			

			// helper functions - basically an alias to calling exec() with the function name as the apicall
			// in some cases may also contain helper code to make use cases simpler
			this.resize = function(width, height) {
				if (width === undefined) {
					var width = 'auto';
				}
				if (height === undefined) {
					var height = 'auto';
				}
				zingchart.exec( id, 'resize', {
					width : width,
					height : height
				});
				return this;
			}
			
			this.zoomIn = function(zoomx, zoomy ) {
				if (zoomx === undefined) {
					var zoomx = true;
				}
				if (zoomy === undefined) {
					var zoomy = true;
				}
				zingchart.exec(id, 'zoomin', {
					graphid : 0,
					zoomx   : zoomx,
					zoomy   : zoomy
				});
				return this;
			}
			
			this.zoomOut = function( graphid, zoomx, zoomy ) {
				if (zoomx === undefined) {
					var zoomx = true;
				}
				if (zoomy === undefined) {
					var zoomy = true;
				}
				zingchart.exec(id, 'zoomout', {
					graphid : graphid,
					zoomx   : zoomx,
					zoomy   : zoomy
				});
				return this;
			}
			
			this.load = function() {
				zingchart.exec(id, 'load', { dataurl:'new.json' } );
				return this;
			}
			
			this.destroy = function() {
				zingchart.exec(id, 'destroy');
				$('#' + id).empty();
				return this;
			}
			
			
			this.title = function(newTitle) {
				if (newTitle === undefined) {
					return this.getJSON().title.text;
				} else {
					this.setJSON( { title: { text: newTitle } }, false);
					zingchart.exec(id, 'modify', {
						'object' : 'title',
						'data'   : { 'text': newTitle }
					});
				}
			}
			
			this.modifyPlot = function(data, plotIndex) {
				zingchart.exec(id, 'modifyplot', {
					graphid : 0,
					plotindex : plotIndex,
					data : data
				});
			}			
			
			// helper function to set the data variables
			// *note* possibly error check here? - verify legal chart type is being submitted
			// *question* what are the legal chart types accepted by Zingchart?
			this.setType = function( newType ) {
				data.type = newType;
			}
			// end zingchart utility functions
			
			
			//-------------------------------------------------------------------------------
			//	now configure new jQuery ZingChart object based on params included
			//-------------------------------------------------------------------------------
			
			if (data !== undefined) {
				// when initializing ZingChart - set JSON if included
				if (data.hasOwnProperty('JSON')) {
					this.setJSON(data.JSON);
				}

				// initialize ZingChart object with renderOptions if included 
				if (data.hasOwnProperty('renderOptions')) {
					this.setRenderOptions(data.renderOptions);
				}			
				
				// check if user submitted additional data args for chart when initializing, 
				// if so render the chart accordingly (this is a shortcut so users can create and
				// render the chart in one line, rather than needing to call render() separately
				if (data.JSON !== undefined) {
					this.render();
				}
			}
			
			// return this so the function will create a jQuery-chainable object
			return this;
			
		} // end zingchart() function defenition
		
	}); // end $.fn.extend()
	
}( jQuery ));