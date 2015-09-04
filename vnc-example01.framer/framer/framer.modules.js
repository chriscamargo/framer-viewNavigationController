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
    if (options.initialViewName == null) {
      options.initialViewName = 'initialView';
    }
    if (options.animationOptions == null) {
      options.animationOptions = {
        curve: "bezier-curve(.2, 1, .2, 1)",
        time: .6
      };
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "rgba(190,190,190,0.9)";
    }
    if (options.perspective == null) {
      options.perspective = 1000;
    }
    ViewNavigationController.__super__.constructor.call(this, options);
    this.history = [];
    this.on("change:subLayers", function(changeList) {
      if (changeList.added[0].name === options.initialViewName) {
        return this.switchInstant(changeList.added[0]);
      } else {
        return changeList.added[0].x = this.width;
      }
    });
  }

  ViewNavigationController.prototype.add = function(view, point, viaInternalChangeEvent) {
    if (point == null) {
      point = {
        x: 0,
        y: 0
      };
    }
    if (viaInternalChangeEvent == null) {
      viaInternalChangeEvent = false;
    }
    if (viaInternalChangeEvent) {
      this.switchInstant(view);
    } else {
      view.superLayer = this;
    }
    view.on(Events.Click, function() {});
    view.originalPoint = point;
    return view.point = point;
  };

  ViewNavigationController.prototype.readyToAnimate = function(view) {
    if (view !== this.current) {
      if (this.subLayers.indexOf(view) === -1) {
        this.add(view);
      }
      return true;
    } else {
      return false;
    }
  };

  ViewNavigationController.prototype.saveCurrentToHistory = function(animation) {
    return this.history.unshift({
      view: this.current,
      animation: animation
    });
  };

  ViewNavigationController.prototype.back = function() {
    var anim, animProperties, animation, backwards, previous;
    previous = this.history[0];
    if (previous.view != null) {
      animProperties = {
        layer: previous.view,
        properties: {
          x: previous.view.originalPoint != null ? previous.view.originalPoint.x : 0,
          y: previous.view.originalPoint != null ? previous.view.originalPoint.y : 0
        }
      };
      animation = new Animation(animProperties);
      animation.options.curveOptions = previous.animation.options.curveOptions;
      animation.start();
      anim = previous.animation;
      backwards = anim.reverse();
      backwards.start();
      this.current = previous.view;
      this.history.shift();
      return backwards.on(Events.AnimationEnd, (function(_this) {
        return function() {
          return _this.current.bringToFront();
        };
      })(this));
    }
  };

  ViewNavigationController.prototype.applyAnimation = function(view, animProperties, animationOptions) {
    var animation, obj;
    if (view !== this.current) {
      obj = {
        layer: view
      };
      _.extend(obj, animProperties, animationOptions);
      animation = new Animation(obj);
      animation.start();
      this.saveCurrentToHistory(animation);
      this.current = view;
      return this.current.bringToFront();
    }
  };


  /* ANIMATIONS */

  ViewNavigationController.prototype.switchInstant = function(view) {
    return this.fadeIn(view, {
      time: 0
    });
  };

  ViewNavigationController.prototype.slideInDown = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.y = -this.height;
    animProperties = {
      properties: {
        y: view.originalPoint != null ? view.originalPoint.y : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInUp = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.y = this.height;
    animProperties = {
      properties: {
        y: view.originalPoint != null ? view.originalPoint.y : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInRight = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.x = this.width;
    animProperties = {
      properties: {
        x: view.originalPoint != null ? view.originalPoint.x : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInLeft = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.x = -this.width;
    animProperties = {
      properties: {
        x: view.originalPoint != null ? view.originalPoint.x : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.fadeIn = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.opacity = 0;
    view.x = 0;
    view.y = 0;
    animProperties = {
      properties: {
        opacity: 1
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.crossDissolve = function(view, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.fadeIn(view, animationOptions);
  };

  ViewNavigationController.prototype.zoomIn = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.scale = 0.8;
    view.opacity = 0;
    animProperties = {
      properties: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.zoomedIn = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.scale = 1.5;
    view.opacity = 0;
    animProperties = {
      properties: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.flipInRight = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.x = this.width / 2;
    view.rotationY = 100;
    view.z = 800;
    animProperties = {
      properties: {
        x: view.originalPoint != null ? view.originalPoint.x : 0,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.flipInLeft = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.x = -this.width / 2;
    view.rotationY = -100;
    view.z = 800;
    animProperties = {
      properties: {
        x: view.originalPoint != null ? view.originalPoint.x : 0,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.flipInUp = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.y = this.height;
    view.rotationX = -100;
    view.z = 800;
    animProperties = {
      properties: {
        y: view.originalPoint != null ? view.originalPoint.y : 0,
        rotationX: 0,
        z: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.spinIn = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    view.opacity = 0;
    view.scale = 0.8;
    view.rotation = 180;
    animProperties = {
      properties: {
        opacity: 1,
        scale: 1,
        rotation: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.pushInRight = function(view, animationOptions) {
    var animProperties, move, moveOut;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    move = {
      layer: this.current,
      properties: {
        x: -this.width
      }
    };
    _.extend(move, animationOptions);
    moveOut = new Animation(move);
    moveOut.start();
    view.x = this.width;
    animProperties = {
      properties: {
        x: view.originalPoint != null ? view.originalPoint.x : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.pushInLeft = function(view, animationOptions) {
    var animProperties, move, moveOut;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    if (!this.readyToAnimate(view)) {
      return;
    }
    move = {
      layer: this.current,
      properties: {
        x: this.width
      }
    };
    _.extend(move, animationOptions);
    moveOut = new Animation(move);
    moveOut.start();
    view.x = -this.width;
    animProperties = {
      properties: {
        x: view.originalPoint != null ? view.originalPoint.x : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFBcUMsSUFBQSxFQUFNLEVBQTNDOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtP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QUEsSUFPQSxPQUFPLENBQUMsS0FBUixDQUFBLENBUEEsQ0FBQTtBQUFBLElBU0EsSUFBSSxDQUFDLENBQUwsR0FBUyxDQUFBLElBQUUsQ0FBQSxLQVRYLENBQUE7QUFBQSxJQVVBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sMEJBQUgsR0FBNEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUEvQyxHQUFzRCxDQUF6RDtPQUREO0tBWEQsQ0FBQTtXQWFBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLGNBQXRCLEVBQXNDLGdCQUF0QyxFQWRXO0VBQUEsQ0ExTlosQ0FBQTs7a0NBQUE7O0dBRjhDLE1BQS9DLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBUT0RPOlxuIyBBZGQgY3VzdG9tIGFuaW1hdGlvbk9wdGlvbnMgdG8gLmJhY2soKT9cbiMgQWRkIFwibW92ZU91dFwiIGFuaW1hdGlvbnM/IHdoYXQncyB0aGUgdXNlIGNhc2U/IGNvdmVyZWQgYnkgYmFjaz9cbiMgSWYgbm8gbmVlZCBmb3IgbW92ZU91dCwgbWF5YmUgd2Ugd29udCBuZWVkIGNvbnNpc3RlbnQgXCJJblwiIG5hbWluZyBzY2hlbWVcblxuY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmluaXRpYWxWaWV3TmFtZSA/PSAnaW5pdGlhbFZpZXcnXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcImJlemllci1jdXJ2ZSguMiwgMSwgLjIsIDEpXCIsIHRpbWU6IC42XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJyZ2JhKDE5MCwxOTAsMTkwLDAuOSlcIlxuXHRcdG9wdGlvbnMucGVyc3BlY3RpdmUgPz0gMTAwMFxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAb24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0aWYgY2hhbmdlTGlzdC5hZGRlZFswXS5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRcdEBzd2l0Y2hJbnN0YW50IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2hhbmdlTGlzdC5hZGRlZFswXS54ID0gQHdpZHRoXG5cblx0YWRkOiAodmlldywgcG9pbnQgPSB7eDowLCB5OjB9LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50ID0gZmFsc2UpIC0+XG5cdFx0aWYgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0QHN3aXRjaEluc3RhbnQgdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0dmlldy5vcmlnaW5hbFBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblxuXHRyZWFkeVRvQW5pbWF0ZTogKHZpZXcpIC0+XG5cdFx0aWYgdmlldyBpc250IEBjdXJyZW50XG5cdFx0XHRpZiBAc3ViTGF5ZXJzLmluZGV4T2YodmlldykgaXMgLTFcblx0XHRcdFx0QGFkZCB2aWV3XG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XG5cdHNhdmVDdXJyZW50VG9IaXN0b3J5OiAoYW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRhbmltYXRpb246IGFuaW1hdGlvblxuXG5cdGJhY2s6IC0+IFxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRhbmltUHJvcGVydGllcyA9IFxuXHRcdFx0XHRsYXllcjogcHJldmlvdXMudmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHg6IGlmIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0XHR5OiBpZiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24gYW5pbVByb3BlcnRpZXNcblx0XHRcdGFuaW1hdGlvbi5vcHRpb25zLmN1cnZlT3B0aW9ucyA9IHByZXZpb3VzLmFuaW1hdGlvbi5vcHRpb25zLmN1cnZlT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XG5cdFx0XHRhbmltID0gcHJldmlvdXMuYW5pbWF0aW9uXG5cdFx0XHRiYWNrd2FyZHMgPSBhbmltLnJldmVyc2UoKVxuXHRcdFx0YmFja3dhcmRzLnN0YXJ0KClcblx0XHRcdEBjdXJyZW50ID0gcHJldmlvdXMudmlld1xuXHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdFx0YmFja3dhcmRzLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0YXBwbHlBbmltYXRpb246ICh2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHR1bmxlc3MgdmlldyBpcyBAY3VycmVudFxuXHRcdFx0b2JqID0gbGF5ZXI6IHZpZXdcblx0XHRcdF8uZXh0ZW5kIG9iaiwgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24gb2JqXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXHRcdFx0QHNhdmVDdXJyZW50VG9IaXN0b3J5IGFuaW1hdGlvblxuXHRcdFx0QGN1cnJlbnQgPSB2aWV3XG5cdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cblx0IyMjIEFOSU1BVElPTlMgIyMjXG5cblx0c3dpdGNoSW5zdGFudDogKHZpZXcpIC0+IEBmYWRlSW4gdmlldywgdGltZTogMFxuXG5cdHNsaWRlSW5Eb3duOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnkgPSAtQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluVXA6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy55ID0gQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy54ID0gQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueCA9IC1Ad2lkdGhcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHR2aWV3LnggPSAwXG5cdFx0dmlldy55ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRjcm9zc0Rpc3NvbHZlOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdEBmYWRlSW4gdmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0XG5cdHpvb21JbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnNjYWxlID0gMC44XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHR6b29tZWRJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnNjYWxlID0gMS41XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnggPSBAd2lkdGgvMlxuXHRcdHZpZXcucm90YXRpb25ZID0gMTAwXG5cdFx0dmlldy56ID0gODAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy54ID0gLUB3aWR0aC8yXG5cdFx0dmlldy5yb3RhdGlvblkgPSAtMTAwXG5cdFx0dmlldy56ID0gODAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJblVwOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueSA9IEBoZWlnaHRcblx0XHR2aWV3LnJvdGF0aW9uWCA9IC0xMDBcblx0XHR2aWV3LnogPSA4MDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdHNwaW5JbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0dmlldy5zY2FsZSA9IDAuOFxuXHRcdHZpZXcucm90YXRpb24gPSAxODBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdHJvdGF0aW9uOiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblxuXHRwdXNoSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXHRcdG1vdmUgPVxuXHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gLUB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMiXX0=
