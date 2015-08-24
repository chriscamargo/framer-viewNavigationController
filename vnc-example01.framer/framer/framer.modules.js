require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  extend(ViewNavigationController, superClass);

  function ViewNavigationController(options) {
    if (options == null) {
      options = {};
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.height == null) {
      options.height = Screen.height;
    }
    if (options.clip == null) {
      options.clip = true;
    }
    if (options.animationOptions == null) {
      options.animationOptions = {
        curve: "spring(400,40)"
      };
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "rgba(190,190,190,0.9)";
    }
    ViewNavigationController.__super__.constructor.call(this, options);
    this.history = [];
  }

  ViewNavigationController.prototype.add = function(view, point) {
    var i, len, ref, subLayer;
    if (point == null) {
      point = {
        x: 0,
        y: 0
      };
    }
    ref = this.subLayers;
    for (i = 0, len = ref.length; i < len; i++) {
      subLayer = ref[i];
      subLayer.ignoreEvents = true;
    }
    view.ignoreEvents = false;
    view.superLayer = this;
    view.point = point;
    view.states.add({
      up: {
        x: 0,
        y: -this.height
      },
      right: {
        x: this.width,
        y: 0
      },
      down: {
        x: 0,
        y: this.height
      },
      left: {
        x: -this.width,
        y: 0
      }
    });
    view.states.animationOptions = this.animationOptions;
    return this.current = view;
  };

  ViewNavigationController.prototype.moveIn = function(view, direction) {
    var i, len, ref, subLayer;
    if (direction == null) {
      direction = 'default';
    }
    if (view !== this.current) {
      this.history.unshift({
        view: this.current,
        direction: direction
      });
      this.current = view;
      ref = this.subLayers;
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        subLayer.ignoreEvents = true;
      }
      view.ignoreEvents = false;
      view.bringToFront();
      view.states.switchInstant(direction);
      view.states["switch"]('default');
      return this.emit("change:view");
    }
  };

  ViewNavigationController.prototype.moveOut = function(view, direction) {
    var i, len, previous, ref, subLayer;
    if (direction == null) {
      direction = 'right';
    }
    ref = this.subLayers;
    for (i = 0, len = ref.length; i < len; i++) {
      subLayer = ref[i];
      subLayer.ignoreEvents = false;
    }
    view.states.switchInstant('default');
    view.states["switch"](direction);
    previous = this.history[0];
    this.current = previous.view;
    this.history.shift();
    return this.emit("change:view");
  };

  ViewNavigationController.prototype.back = function() {
    if (this.history[0] != null) {
      return this.moveOut(this.current, this.history[0].direction, false);
    }
  };

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxtQkFBb0I7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDs7S0FINUI7O01BSUEsT0FBTyxDQUFDLGtCQUFtQjtLQUozQjtBQUFBLElBS0EsMERBQU0sT0FBTixDQUxBLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFQWCxDQURZO0VBQUEsQ0FBYjs7QUFBQSxxQ0FVQSxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBO0FBQ0osUUFBQSxxQkFBQTs7TUFEVyxRQUFRO0FBQUEsUUFBQyxDQUFBLEVBQUUsQ0FBSDtBQUFBLFFBQU0sQ0FBQSxFQUFFLENBQVI7O0tBQ25CO0FBQUE7QUFBQSxTQUFBLHFDQUFBO3dCQUFBO0FBQUEsTUFBQSxRQUFRLENBQUMsWUFBVCxHQUF3QixJQUF4QixDQUFBO0FBQUEsS0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLFlBQUwsR0FBb0IsS0FEcEIsQ0FBQTtBQUFBLElBRUEsSUFBSSxDQUFD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QUEsQ0FBRSxDQUFDLFNBQS9CLEVBQTBDLEtBQTFDLEVBREQ7S0FESztFQUFBLENBN0NOLENBQUE7O2tDQUFBOztHQUY4QyxNQUEvQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCJcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcInJnYmEoMTkwLDE5MCwxOTAsMC45KVwiXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdFxuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRcdFx0XG5cdGFkZDogKHZpZXcsIHBvaW50ID0ge3g6MCwgeTowfSkgLT5cblx0XHRzdWJMYXllci5pZ25vcmVFdmVudHMgPSB0cnVlIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG5cdFx0dmlldy5pZ25vcmVFdmVudHMgPSBmYWxzZVxuXHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnN0YXRlcy5hZGRcblx0XHRcdHVwOiAgICAge3g6IDAsIHk6IC1AaGVpZ2h0fVxuXHRcdFx0cmlnaHQ6ICB7eDogQHdpZHRoLCB5OiAwfVxuXHRcdFx0ZG93bjogICB7eDogMCwgeTogQGhlaWdodH1cblx0XHRcdGxlZnQ6ICAge3g6IC1Ad2lkdGgsIHk6IDB9XG5cdFx0dmlldy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zXG5cdFx0QGN1cnJlbnQgPSB2aWV3XG5cdFx0XG5cdG1vdmVJbjogKHZpZXcsIGRpcmVjdGlvbiA9ICdkZWZhdWx0JykgLT5cblx0XHR1bmxlc3MgdmlldyBpcyBAY3VycmVudFxuXHRcdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0XHRkaXJlY3Rpb246IGRpcmVjdGlvblxuXHRcdFx0QGN1cnJlbnQgPSB2aWV3XG5cdFx0XHRzdWJMYXllci5pZ25vcmVFdmVudHMgPSB0cnVlIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG5cdFx0XHR2aWV3Lmlnbm9yZUV2ZW50cyA9IGZhbHNlXG5cdFx0XHR2aWV3LmJyaW5nVG9Gcm9udCgpXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IGRpcmVjdGlvblxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoICdkZWZhdWx0J1xuXHRcdFx0QGVtaXQoXCJjaGFuZ2U6dmlld1wiKVxuXHRcdFxuXHRtb3ZlT3V0OiAodmlldywgZGlyZWN0aW9uID0gJ3JpZ2h0JykgLT5cblx0XHRzdWJMYXllci5pZ25vcmVFdmVudHMgPSBmYWxzZSBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgJ2RlZmF1bHQnXG5cdFx0dmlldy5zdGF0ZXMuc3dpdGNoIGRpcmVjdGlvblxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0QGVtaXQoXCJjaGFuZ2U6dmlld1wiKVxuXHRcdFxuXHRiYWNrOiAtPlxuXHRcdGlmIEBoaXN0b3J5WzBdP1xuXHRcdFx0QG1vdmVPdXQgQGN1cnJlbnQsIEBoaXN0b3J5WzBdLmRpcmVjdGlvbiwgZmFsc2VcbiJdfQ==
