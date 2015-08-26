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
    var i, len, ref, subLayer;
    if (direction == null) {
      direction = 'default';
    }
    if (view !== this.current) {
      this.saveToHistory(direction);
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

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxtQkFBb0I7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDs7S0FINUI7O01BSUEsT0FBTyxDQUFDLGtCQUFtQjtLQUozQjtBQUFBLElBS0EsMERBQU0sT0FBTixDQUxBLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFQWCxDQURZO0VBQUEsQ0FBYjs7QUFBQSxxQ0FVQSxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBO0FBQ0osUUFBQSxxQkFBQTs7TUFEVyxRQUFRO0FBQUEsUUFBQyxDQUFBLEVBQUUsQ0FBSDtBQUFBLFFBQU0sQ0FBQSxFQUFFLENBQVI7O0tBQ25CO0FBQUE7QUFBQSxTQUFBLHFDQUFBO3dCQUFBO0FBQUEsTUFBQSxRQUFRLENBQUMsWUFBVCxHQUF3QixJQUF4QixDQUFBO0FBQUEsS0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLFlBQUwsR0FBb0IsS0FEcEIsQ0FBQTtBQUFBLElBRUEsSUFBSSxDQUFD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QUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyA/PSBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwKVwiXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJyZ2JhKDE5MCwxOTAsMTkwLDAuOSlcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRcblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0XHRcdFxuXHRhZGQ6ICh2aWV3LCBwb2ludCA9IHt4OjAsIHk6MH0pIC0+XG5cdFx0c3ViTGF5ZXIuaWdub3JlRXZlbnRzID0gdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdHZpZXcuaWdub3JlRXZlbnRzID0gZmFsc2Vcblx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cdFx0dmlldy5wb2ludCA9IHBvaW50XG5cdFx0dmlldy5zdGF0ZXMuYWRkXG5cdFx0XHR1cDogICAgIHt4OiAwLCB5OiAtQGhlaWdodH1cblx0XHRcdHJpZ2h0OiAge3g6IEB3aWR0aCwgeTogMH1cblx0XHRcdGRvd246ICAge3g6IDAsIHk6IEBoZWlnaHR9XG5cdFx0XHRsZWZ0OiAgIHt4OiAtQHdpZHRoLCB5OiAwfVxuXHRcdHZpZXcuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9uc1xuXHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFxuXHRzYXZlVG9IaXN0b3J5OiAoZGlyZWN0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRkaXJlY3Rpb246IGRpcmVjdGlvblxuXG5cdGJhY2s6IC0+XG5cdFx0aWYgQGhpc3RvcnlbMF0/XG5cdFx0XHRAbW92ZU91dCBAY3VycmVudCwgQGhpc3RvcnlbMF0uZGlyZWN0aW9uLCBmYWxzZVxuXG5cdGFwcGVhcjogKHZpZXcsIGRpcmVjdGlvbikgLT5cblx0XHR1bmxlc3MgdmlldyBpcyBAY3VycmVudFxuXHRcdFx0QHNhdmVUb0hpc3RvcnkgZGlyZWN0aW9uXG5cdFx0XHRAY3VycmVudCA9IHZpZXdcblx0XHRcdHN1YkxheWVyLmlnbm9yZUV2ZW50cyA9IHRydWUgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcblx0XHRcdHZpZXcuaWdub3JlRXZlbnRzID0gZmFsc2Vcblx0XHRcdHZpZXcuYnJpbmdUb0Zyb250KClcblxuXHRzbGlkZUluUmlnaHQ6ICh2aWV3KSAtPiBAbW92ZUluIHZpZXcsICdyaWdodCdcblx0c2xpZGVJbkxlZnQ6ICh2aWV3KSAtPiBAbW92ZUluIHZpZXcsICdsZWZ0J1xuXHRzbGlkZUluVXA6ICh2aWV3KSAtPiBAbW92ZUluIHZpZXcsICd1cCdcblx0c2xpZGVJbkRvd246ICh2aWV3KSAtPiBAbW92ZUluIHZpZXcsICdkb3duJ1xuXG5cblx0bW92ZUluOiAodmlldywgZGlyZWN0aW9uID0gJ2RlZmF1bHQnKSAtPlxuXHRcdHVubGVzcyB2aWV3IGlzIEBjdXJyZW50XG5cdFx0XHRAc2F2ZVRvSGlzdG9yeSBkaXJlY3Rpb25cblx0XHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFx0c3ViTGF5ZXIuaWdub3JlRXZlbnRzID0gdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdFx0dmlldy5pZ25vcmVFdmVudHMgPSBmYWxzZVxuXHRcdFx0dmlldy5icmluZ1RvRnJvbnQoKVxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBkaXJlY3Rpb25cblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaCAnZGVmYXVsdCdcblx0XHRcdEBlbWl0KFwiY2hhbmdlOnZpZXdcIilcblx0XHRcblx0bW92ZU91dDogKHZpZXcsIGRpcmVjdGlvbiA9ICdyaWdodCcpIC0+XG5cdFx0c3ViTGF5ZXIuaWdub3JlRXZlbnRzID0gZmFsc2UgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcblx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICdkZWZhdWx0J1xuXHRcdHZpZXcuc3RhdGVzLnN3aXRjaCBkaXJlY3Rpb25cblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdEBlbWl0KFwiY2hhbmdlOnZpZXdcIilcblx0XHRcblx0Il19
