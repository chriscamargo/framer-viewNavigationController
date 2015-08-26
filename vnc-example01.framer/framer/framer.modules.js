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

  ViewNavigationController.prototype.saveToHistory = function(direction) {
    return this.history.unshift({
      view: this.current,
      direction: direction
    });
  };

  ViewNavigationController.prototype.back = function() {
    if (this.history[0] != null) {
      return this.moveOut(this.current, this.history[0].direction, false);
    }
  };

  ViewNavigationController.prototype.appear = function(view, direction) {
    var i, len, ref, subLayer;
    if (view !== this.current) {
      this.saveToHistory(direction);
      this.current = view;
      ref = this.subLayers;
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        subLayer.ignoreEvents = true;
      }
      view.ignoreEvents = false;
      return view.bringToFront();
    }
  };

  ViewNavigationController.prototype.slideInRight = function(view) {
    return this.moveIn(view, 'right');
  };

  ViewNavigationController.prototype.slideInLeft = function(view) {
    return this.moveIn(view, 'left');
  };

  ViewNavigationController.prototype.slideInUp = function(view) {
    return this.moveIn(view, 'up');
  };

  ViewNavigationController.prototype.slideInDown = function(view) {
    return this.moveIn(view, 'down');
  };

  ViewNavigationController.prototype.moveIn = function(view, direction) {
    if (direction == null) {
      direction = 'default';
    }
    this.appear(view, direction);
    view.states.switchInstant(direction);
    view.states["switch"]('default');
    return this.emit("change:view");
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

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxtQkFBb0I7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDs7S0FINUI7O01BSUEsT0FBTyxDQUFDLGtCQUFtQjtLQUozQjtBQUFBLElBS0EsMERBQU0sT0FBTixDQUxBLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFQWCxDQURZO0VBQUEsQ0FBYjs7QUFBQSxxQ0FVQSxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBO0FBQ0osUUFBQSxxQkFBQTs7TUFEVyxRQUFRO0FBQUEsUUFBQyxDQUFBLEVBQUUsQ0FBSDtBQUFBLFFBQU0sQ0FBQSxFQUFFLENBQVI7O0tBQ25CO0FBQUE7QUFBQSxTQUFBLHFDQUFBO3dCQUFBO0FBQUEsTUFBQSxRQUFRLENBQUMsWUFBVCxHQUF3QixJQUF4QixDQUFBO0FBQUEsS0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLFlBQUwsR0FBb0IsS0FEcEIsQ0FBQTtBQUFBLElBRUEsSUFBSSxDQUFD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QUNBLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBWixDQUEwQixTQUExQixDQURBLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFYLENBQW1CLFNBQW5CLENBRkEsQ0FBQTtXQUdBLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixFQUpPO0VBQUEsQ0E3Q1IsQ0FBQTs7QUFBQSxxQ0FtREEsT0FBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLFNBQVAsR0FBQTtBQUNSLFFBQUEsK0JBQUE7O01BRGUsWUFBWTtLQUMzQjtBQUFBO0FBQUEsU0FBQSxxQ0FBQTt3QkFBQTtBQUFBLE1BQUEsUUFBUSxDQUFDLFlBQVQsR0FBd0IsS0FBeEIsQ0FBQTtBQUFBLEtBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBWixDQUEwQixTQUExQixDQURBLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFYLENBQW1CLFNBQW5CLENBRkEsQ0FBQTtBQUFBLElBR0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUhwQixDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxJQUpwQixDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsQ0FBQSxDQUxBLENBQUE7V0FNQSxJQUFDLENBQUEsSUFBRCxDQUFNLGFBQU4sRUFQUTtFQUFBLENBbkRULENBQUE7O2tDQUFBOztHQUY4QyxNQUEvQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCJcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcInJnYmEoMTkwLDE5MCwxOTAsMC45KVwiXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdFxuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRcdFx0XG5cdGFkZDogKHZpZXcsIHBvaW50ID0ge3g6MCwgeTowfSkgLT5cblx0XHRzdWJMYXllci5pZ25vcmVFdmVudHMgPSB0cnVlIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG5cdFx0dmlldy5pZ25vcmVFdmVudHMgPSBmYWxzZVxuXHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnN0YXRlcy5hZGRcblx0XHRcdHVwOiAgICAge3g6IDAsIHk6IC1AaGVpZ2h0fVxuXHRcdFx0cmlnaHQ6ICB7eDogQHdpZHRoLCB5OiAwfVxuXHRcdFx0ZG93bjogICB7eDogMCwgeTogQGhlaWdodH1cblx0XHRcdGxlZnQ6ICAge3g6IC1Ad2lkdGgsIHk6IDB9XG5cdFx0dmlldy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zXG5cdFx0QGN1cnJlbnQgPSB2aWV3XG5cdFx0XG5cdHNhdmVUb0hpc3Rvcnk6IChkaXJlY3Rpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRcblx0XHRcdGRpcmVjdGlvbjogZGlyZWN0aW9uXG5cblx0YmFjazogLT5cblx0XHRpZiBAaGlzdG9yeVswXT9cblx0XHRcdEBtb3ZlT3V0IEBjdXJyZW50LCBAaGlzdG9yeVswXS5kaXJlY3Rpb24sIGZhbHNlXG5cblx0YXBwZWFyOiAodmlldywgZGlyZWN0aW9uKSAtPlxuXHRcdHVubGVzcyB2aWV3IGlzIEBjdXJyZW50XG5cdFx0XHRAc2F2ZVRvSGlzdG9yeSBkaXJlY3Rpb25cblx0XHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFx0c3ViTGF5ZXIuaWdub3JlRXZlbnRzID0gdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdFx0dmlldy5pZ25vcmVFdmVudHMgPSBmYWxzZVxuXHRcdFx0dmlldy5icmluZ1RvRnJvbnQoKVxuXG5cdHNsaWRlSW5SaWdodDogKHZpZXcpIC0+IEBtb3ZlSW4gdmlldywgJ3JpZ2h0J1xuXHRzbGlkZUluTGVmdDogKHZpZXcpIC0+IEBtb3ZlSW4gdmlldywgJ2xlZnQnXG5cdHNsaWRlSW5VcDogKHZpZXcpIC0+IEBtb3ZlSW4gdmlldywgJ3VwJ1xuXHRzbGlkZUluRG93bjogKHZpZXcpIC0+IEBtb3ZlSW4gdmlldywgJ2Rvd24nXG5cblx0bW92ZUluOiAodmlldywgZGlyZWN0aW9uID0gJ2RlZmF1bHQnKSAtPlxuXHRcdEBhcHBlYXIgdmlldywgZGlyZWN0aW9uXG5cdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBkaXJlY3Rpb25cblx0XHR2aWV3LnN0YXRlcy5zd2l0Y2ggJ2RlZmF1bHQnXG5cdFx0QGVtaXQoXCJjaGFuZ2U6dmlld1wiKVxuXHRcdFxuXHRtb3ZlT3V0OiAodmlldywgZGlyZWN0aW9uID0gJ3JpZ2h0JykgLT5cblx0XHRzdWJMYXllci5pZ25vcmVFdmVudHMgPSBmYWxzZSBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgJ2RlZmF1bHQnXG5cdFx0dmlldy5zdGF0ZXMuc3dpdGNoIGRpcmVjdGlvblxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0QGVtaXQoXCJjaGFuZ2U6dmlld1wiKVxuXHRcdFxuXHQiXX0=
