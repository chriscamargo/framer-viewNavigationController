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
    animProperties = {
      properties: {
        opacity: 1
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFBcUMsSUFBQSxFQUFNLEVBQTNDOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFFdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtPQUFBLE1BQUE7ZUFJQyxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLENBQXBCLEdBQXdCLElBQUMsQ0FBQSxNQUoxQjtPQUZ1QjtJQUFBLENBQXhCLENBVkEsQ0FEWTtFQUFBLENBQWI7O0FBQUEscUNBK0JBLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQTJCLHNCQUEzQixHQUFBOztNQUFPLFFBQVE7QUFBQSxRQUFDLENBQUEsRUFBRSxDQUFIO0FBQUEsUUFBTSxDQUFBLEVBQUUsQ0FBUjs7S0FDbkI7O01BRCtCLHlCQUF5QjtLQUN4RDtBQUFBLElBQUEsSUFBRyxzQkFBSDtBQUNDLE1BQUEsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmLENBQUEsQ0FERDtLQUFBLE1BQUE7QUFHQyxNQUFBLElBQUksQ0FBQyxVQUFMLEdBQWtCLElBQWxCLENBSEQ7S0FBQTtBQUFBLElBSUEsSUFBSSxDQUFDLEVBQUwsQ0FBUSxNQUFNLENBQUMsS0FBZixFQUFzQixTQUFBLEdBQUEsQ0FBdEIsQ0FKQSxDQUFBO0FBQUEsSUFLQSxJQUFJLENBQUMsYUFBTCxHQUFxQixLQUxyQixDQUFBO1dBTUEsSUFBSSxDQUFDLEtBQUwsR0FBYSxNQVBUO0VBQUEsQ0EvQkwsQ0FBQTs7QUFBQSxxQ0F3Q0EsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNmLElBQUEsSUFBRyxJQUFBLEtBQVUsSUFBQyxDQUFBLE9BQWQ7QUFDQyxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLElBQW5CLENBQUEsS0FBNEIsQ0FBQSxDQUEvQjtBQUNDLFFBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLENBQUEsQ0FERDtPQUFBO0FBRUEsYUFBTyxJQUFQLENBSEQ7S0FBQSxNQUFBO0FBS0MsYUFBTyxLQUFQLENBTEQ7S0FEZTtFQUFBLENBeENoQixDQUFBOztBQUFBLHFDQWlEQSxvQkFBQSxHQUFzQixTQUFDLFNBQUQsR0FBQTtXQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FDQztBQUFBLE1BQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxPQUFQO0FBQUEsTUFDQSxTQUFBLEVBQVcsU0FEWDtLQURELEVBRHFCO0VBQUEsQ0FqRHRCLENBQUE7O0FBQUEscUNBc0RBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDTCxRQUFBLG9EQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQXBCLENBQUE7QUFDQSxJQUFBLElBQUcscUJBQUg7QUFFQyxNQUFBLGNBQUEsR0FDQztBQUFBLFFBQUEsS0FBQSxFQUFPLFFBQVEsQ0FBQyxJQUFoQjtBQUFBLFFBQ0EsVUFBQSxFQUNDO0FBQUEsVUFBQSxDQUFBLEVBQU0sbUNBQUgsR0FBcUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBakUsR0FBd0UsQ0FBM0U7QUFBQSxVQUNBLENBQUEsRUFBTSxtQ0FBSCxHQUFxQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFqRSxHQUF3RSxDQUQzRTtTQUZEO09BREQsQ0FBQTtBQUFBLE1BTUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBVSxjQUFWLENBTmhCLENBQUE7QUFBQSxNQU9BLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBbEIsR0FBaUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFQNUQsQ0FBQTtBQUFBLE1BUUEsU0FBUyxDQUFDLEtBQVYsQ0FBQSxDQVJBLENBQUE7QUFBQSxNQVVBLElBQUEsR0FBTyxRQUFRLENBQUMsU0FWaEIsQ0FBQTtBQUFBLE1BV0EsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FYWixDQUFBO0FBQUEsTUFZQSxTQUFTLENBQUMsS0FBVixDQUFBLENBWkEsQ0FBQTtBQUFBLE1BYUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsSUFicEIsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQUEsQ0FkQSxDQUFBO2FBZUEsU0FBUyxDQUFDLEVBQVYsQ0FBYSxNQUFNLENBQUMsWUFBcEIsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakMsS0FBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsRUFEaUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxFQWpCRDtLQUZLO0VBQUEsQ0F0RE4sQ0FBQTs7QUFBQSxxQ0E0RUEsY0FBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxjQUFQLEVBQXVCLGdCQUF2QixHQUFBO0FBQ2YsUUFBQSxjQUFBO0FBQUEsSUFBQSxJQUFPLElBQUEsS0FBUSxJQUFDLENBQUEsT0FBaEI7QUFDQyxNQUFBLEdBQUEsR0FBTTtBQUFBLFFBQUEsS0FBQSxFQUFPLElBQVA7T0FBTixDQUFBO0FBQUEsTUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLEdBQVQsRUFBYyxjQUFkLEVBQThCLGdCQUE5QixDQURBLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQVUsR0FBVixDQUZoQixDQUFBO0FBQUEsTUFHQSxTQUFTLENBQUMsS0FBVixDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLG9CQUFELENBQXNCLFNBQXRCLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUxYLENBQUE7YUFNQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxFQVBEO0tBRGU7RUFBQSxDQTVFaEIsQ0FBQTs7QUF1RkE7QUFBQSxrQkF2RkE7O0FBQUEscUNBeUZBLGFBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtXQUFVLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBUixFQUFjO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBTjtLQUFkLEVBQVY7RUFBQSxDQXpGZixDQUFBOztBQUFBLHFDQTJGQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNaLFFBQUEsY0FBQTs7TUFEbUIsbUJBQW1CLElBQUMsQ0FBQTtLQUN2QztBQUFBLElBQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxjQUFELENBQWdCLElBQWhCLENBQWQ7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUFBLElBRUEsSUFBSSxDQUFDLENBQUwsR0FBUyxDQUFBLElBQUUsQ0FBQSxNQUZYLENBQUE7QUFBQSxJQUdBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sMEJBQUgsR0FBNEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUEvQyxHQUFzRCxDQUF6RDtPQUREO0tBSkQsQ0FBQTtXQU1BLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLGNBQXRCLEVBQXNDLGdCQUF0QyxFQVBZO0VBQUEsQ0EzRmIsQ0FBQTs7QUFBQSxxQ0FvR0EsU0FBQSxHQUFXLFNBQUMsSUFBRCxFQUFPLGdCQUFQLEdBQUE7QUFDVixRQUFBLGNBQUE7O01BRGlCLG1CQUFtQixJQUFDLENBQUE7S0FDckM7QUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsY0FBRCxDQUFnQixJQUFoQixDQUFkO0FBQUEsWUFBQSxDQUFBO0tBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLE1BRlYsQ0FBQTtBQUFBLElBR0EsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSwwQkFBSCxHQUE0QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQS9DLEdBQXNELENBQXpEO09BREQ7S0FKRCxDQUFBO1dBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBUFU7RUFBQSxDQXBHWCxDQUFBOztBQUFBLHFDQTZHQSxZQUFBLEdBQWMsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNiLFFBQUEsY0FBQTs7TUFEb0IsbUJBQW1CLElBQUMsQ0FBQTtLQUN4QztBQUFBLElBQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxjQUFELENBQWdCLElBQWhCLENBQWQ7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUFBLElBRUEsSUFBSSxDQUFDLENBQUwsR0FBUyxJQUFDLENBQUEsS0FGVixDQUFBO0FBQUEsSUFHQSxjQUFBLEdBQ0M7QUFBQSxNQUFBLFVBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFNLDBCQUFILEdBQTRCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBL0MsR0FBc0QsQ0FBekQ7T0FERDtLQUpELENBQUE7V0FNQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFQYTtFQUFBLENBN0dkLENBQUE7O0FBQUEscUNBc0hBLFdBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxnQkFBUCxHQUFBO0FBQ1osUUFBQSxjQUFBOztNQURtQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3ZDO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsQ0FBTCxHQUFTLENBQUEsSUFBRSxDQUFBLEtBRlgsQ0FBQTtBQUFBLElBR0EsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSwwQkFBSCxHQUE0QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQS9DLEdBQXNELENBQXpEO09BREQ7S0FKRCxDQUFBO1dBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBUFk7RUFBQSxDQXRIYixDQUFBOztBQUFBLHFDQStIQSxNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNQLFFBQUEsY0FBQTs7TUFEYyxtQkFBbUIsSUFBQyxDQUFBO0tBQ2xDO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsT0FBTCxHQUFlLENBRmYsQ0FBQTtBQUFBLElBR0EsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFUO09BREQ7S0FKRCxDQUFBO1dBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBUE87RUFBQSxDQS9IUixDQUFBOztBQUFBLHFDQXdJQSxNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNQLFFBQUEsY0FBQTs7TUFEYyxtQkFBbUIsSUFBQyxDQUFBO0tBQ2xDO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsS0FBTCxHQUFhLEdBRmIsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxDQUhmLENBQUE7QUFBQSxJQUlBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxLQUFBLEVBQU8sQ0FBUDtBQUFBLFFBQ0EsT0FBQSxFQUFTLENBRFQ7T0FERDtLQUxELENBQUE7V0FRQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFUTztFQUFBLENBeElSLENBQUE7O0FBQUEscUNBbUpBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxnQkFBUCxHQUFBO0FBQ1QsUUFBQSxjQUFBOztNQURnQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3BDO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsS0FBTCxHQUFhLEdBRmIsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxDQUhmLENBQUE7QUFBQSxJQUlBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxLQUFBLEVBQU8sQ0FBUDtBQUFBLFFBQ0EsT0FBQSxFQUFTLENBRFQ7T0FERDtLQUxELENBQUE7V0FRQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFUUztFQUFBLENBbkpWLENBQUE7O0FBQUEscUNBOEpBLFdBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxnQkFBUCxHQUFBO0FBQ1osUUFBQSxjQUFBOztNQURtQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3ZDO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FGaEIsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLFNBQUwsR0FBaUIsR0FIakIsQ0FBQTtBQUFBLElBSUEsSUFBSSxDQUFDLENBQUwsR0FBUyxHQUpULENBQUE7QUFBQSxJQUtBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sMEJBQUgsR0FBNEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUEvQyxHQUFzRCxDQUF6RDtBQUFBLFFBQ0EsU0FBQSxFQUFXLENBRFg7QUFBQSxRQUVBLENBQUEsRUFBRyxDQUZIO09BREQ7S0FORCxDQUFBO1dBVUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBWFk7RUFBQSxDQTlKYixDQUFBOztBQUFBLHFDQTJLQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNYLFFBQUEsY0FBQTs7TUFEa0IsbUJBQW1CLElBQUMsQ0FBQTtLQUN0QztBQUFBLElBQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxjQUFELENBQWdCLElBQWhCLENBQWQ7QUFBQSxZQUFBLENBQUE7S0FBQTtBQUFBLElBRUEsSUFBSSxDQUFDLENBQUwsR0FBUyxDQUFBLElBQUUsQ0FBQSxLQUFGLEdBQVEsQ0FGakIsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLFNBQUwsR0FBaUIsQ0FBQSxHQUhqQixDQUFBO0FBQUEsSUFJQSxJQUFJLENBQUMsQ0FBTCxHQUFTLEdBSlQsQ0FBQTtBQUFBLElBS0EsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSwwQkFBSCxHQUE0QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQS9DLEdBQXNELENBQXpEO0FBQUEsUUFDQSxTQUFBLEVBQVcsQ0FEWDtBQUFBLFFBRUEsQ0FBQSxFQUFHLENBRkg7T0FERDtLQU5ELENBQUE7V0FVQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFYVztFQUFBLENBM0taLENBQUE7O0FBQUEscUNBd0xBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxnQkFBUCxHQUFBO0FBQ1QsUUFBQSxjQUFBOztNQURnQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3BDO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUMsQ0FBQSxNQUZWLENBQUE7QUFBQSxJQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLENBQUEsR0FIakIsQ0FBQTtBQUFBLElBSUEsSUFBSSxDQUFDLENBQUwsR0FBUyxHQUpULENBQUE7QUFBQSxJQUtBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sMEJBQUgsR0FBNEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUEvQyxHQUFzRCxDQUF6RDtBQUFBLFFBQ0EsU0FBQSxFQUFXLENBRFg7QUFBQSxRQUVBLENBQUEsRUFBRyxDQUZIO09BREQ7S0FORCxDQUFBO1dBVUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBWFM7RUFBQSxDQXhMVixDQUFBOztBQUFBLHFDQXFNQSxNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNQLFFBQUEsY0FBQTs7TUFEYyxtQkFBbUIsSUFBQyxDQUFBO0tBQ2xDO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsT0FBTCxHQUFlLENBRmYsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLEtBQUwsR0FBYSxHQUhiLENBQUE7QUFBQSxJQUlBLElBQUksQ0FBQyxRQUFMLEdBQWdCLEdBSmhCLENBQUE7QUFBQSxJQUtBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxPQUFBLEVBQVMsQ0FBVDtBQUFBLFFBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxRQUVBLFFBQUEsRUFBVSxDQUZWO09BREQ7S0FORCxDQUFBO1dBVUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBWE87RUFBQSxDQXJNUixDQUFBOztBQUFBLHFDQW1OQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNaLFFBQUEsNkJBQUE7O01BRG1CLG1CQUFtQixJQUFDLENBQUE7S0FDdkM7QUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsY0FBRCxDQUFnQixJQUFoQixDQUFkO0FBQUEsWUFBQSxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxPQUFSO0FBQUEsTUFDQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFBLElBQUUsQ0FBQSxLQUFMO09BRkQ7S0FGRCxDQUFBO0FBQUEsSUFLQSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxnQkFBZixDQUxBLENBQUE7QUFBQSxJQU1BLE9BQUEsR0FBYyxJQUFBLFNBQUEsQ0FBVSxJQUFWLENBTmQsQ0FBQTtBQUFBLElBT0EsT0FBTyxDQUFDLEtBQVIsQ0FBQSxDQVBBLENBQUE7QUFBQSxJQVNBLElBQUksQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEtBVFYsQ0FBQTtBQUFBLElBVUEsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSwwQkFBSCxHQUE0QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQS9DLEdBQXNELENBQXpEO09BREQ7S0FYRCxDQUFBO1dBYUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBZFk7RUFBQSxDQW5OYixDQUFBOztBQUFBLHFDQW1PQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNYLFFBQUEsNkJBQUE7O01BRGtCLG1CQUFtQixJQUFDLENBQUE7S0FDdEM7QUFBQSxJQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsY0FBRCxDQUFnQixJQUFoQixDQUFkO0FBQUEsWUFBQSxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxPQUFSO0FBQUEsTUFDQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxJQUFDLENBQUEsS0FBSjtPQUZEO0tBRkQsQ0FBQTtBQUFBLElBS0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFULEVBQWUsZ0JBQWYsQ0FMQSxDQUFBO0FBQUEsSUFNQSxPQUFBLEdBQWMsSUFBQSxTQUFBLENBQVUsSUFBVixDQU5kLENBQUE7QUFBQSxJQU9BLE9BQU8sQ0FBQyxLQUFSLENBQUEsQ0FQQSxDQUFBO0FBQUEsSUFTQSxJQUFJLENBQUMsQ0FBTCxHQUFTLENBQUEsSUFBRSxDQUFBLEtBVFgsQ0FBQTtBQUFBLElBVUEsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSwwQkFBSCxHQUE0QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQS9DLEdBQXNELENBQXpEO09BREQ7S0FYRCxDQUFBO1dBYUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBZFc7RUFBQSxDQW5PWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiYmV6aWVyLWN1cnZlKC4yLCAxLCAuMiwgMSlcIiwgdGltZTogLjZcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcInJnYmEoMTkwLDE5MCwxOTAsMC45KVwiXG5cdFx0b3B0aW9ucy5wZXJzcGVjdGl2ZSA/PSAxMDAwXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBvbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHQjIG9ubHkgYWRkIHRoZSBvbmUgd2l0aCByaWdodCBuYW1lXG5cdFx0XHRpZiBjaGFuZ2VMaXN0LmFkZGVkWzBdLm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdFx0QHN3aXRjaEluc3RhbnQgY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0XHQjQGFkZCBjaGFuZ2VMaXN0LmFkZGVkWzBdLCB7eDowLHk6MH0sIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2hhbmdlTGlzdC5hZGRlZFswXS54ID0gQHdpZHRoXG5cdFx0XHQjcHJpbnQgY2hhbmdlTGlzdC5hZGRlZFswXS5uYW1lXG5cdFx0XHQjQGFkZCBjaGFuZ2VMaXN0LmFkZGVkWzBdLCB7eDowLHk6MH0sIHRydWVcblxuXHRcdFx0I3ByaW50IGNoYW5nZUxpc3QuYWRkZWRbMF0ubmFtZVxuXHRcdFx0I2NoYW5nZUxpc3QuYWRkZWRbMF0uc2VuZFRvQmFjaygpXG5cdFx0XHQjaWYgY2hhbmdlTGlzdC5hZGRlZFswXS5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHQjXHRAc3dpdGNoSW5zdGFudCBjaGFuZ2VMaXN0LmFkZGVkWzBdXG5cdFx0XHQjZm9yIHN1YkxheWVyIGluIGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdCNcdGlmIHN1YkxheWVyLm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdCNcdFx0QHN3aXRjaEluc3RhbnQgc3ViTGF5ZXJcblx0XHRcdCNcdGVsc2UgXG5cdFx0XHQjXHRcdFwiQGFkZCBzdWJMYXllclxuXG5cdGFkZDogKHZpZXcsIHBvaW50ID0ge3g6MCwgeTowfSwgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudCA9IGZhbHNlKSAtPlxuXHRcdGlmIHZpYUludGVybmFsQ2hhbmdlRXZlbnRcblx0XHRcdEBzd2l0Y2hJbnN0YW50IHZpZXdcblx0XHRlbHNlXG5cdFx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cdFx0dmlldy5vbiBFdmVudHMuQ2xpY2ssIC0+IHJldHVybiAjIHByZXZlbnQgY2xpY2stdGhyb3VnaC9idWJibGluZ1xuXHRcdHZpZXcub3JpZ2luYWxQb2ludCA9IHBvaW50XG5cdFx0dmlldy5wb2ludCA9IHBvaW50XG5cblx0cmVhZHlUb0FuaW1hdGU6ICh2aWV3KSAtPlxuXHRcdGlmIHZpZXcgaXNudCBAY3VycmVudFxuXHRcdFx0aWYgQHN1YkxheWVycy5pbmRleE9mKHZpZXcpIGlzIC0xXG5cdFx0XHRcdEBhZGQgdmlld1xuXHRcdFx0cmV0dXJuIHRydWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFxuXHRzYXZlQ3VycmVudFRvSGlzdG9yeTogKGFuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0YW5pbWF0aW9uOiBhbmltYXRpb25cblxuXHRiYWNrOiAtPiBcblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0aWYgcHJldmlvdXMudmlldz9cblxuXHRcdFx0YW5pbVByb3BlcnRpZXMgPSBcblx0XHRcdFx0bGF5ZXI6IHByZXZpb3VzLnZpZXdcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHR4OiBpZiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdFx0eTogaWYgcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIGFuaW1Qcm9wZXJ0aWVzXG5cdFx0XHRhbmltYXRpb24ub3B0aW9ucy5jdXJ2ZU9wdGlvbnMgPSBwcmV2aW91cy5hbmltYXRpb24ub3B0aW9ucy5jdXJ2ZU9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cdFxuXHRcdFx0YW5pbSA9IHByZXZpb3VzLmFuaW1hdGlvblxuXHRcdFx0YmFja3dhcmRzID0gYW5pbS5yZXZlcnNlKClcblx0XHRcdGJhY2t3YXJkcy5zdGFydCgpXG5cdFx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdGJhY2t3YXJkcy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cdGFwcGx5QW5pbWF0aW9uOiAodmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0dW5sZXNzIHZpZXcgaXMgQGN1cnJlbnRcblx0XHRcdG9iaiA9IGxheWVyOiB2aWV3XG5cdFx0XHRfLmV4dGVuZCBvYmosIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIG9ialxuXHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBhbmltYXRpb25cblx0XHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXG5cdCMjIyBBTklNQVRJT05TICMjI1xuXG5cdHN3aXRjaEluc3RhbnQ6ICh2aWV3KSAtPiBAZmFkZUluIHZpZXcsIHRpbWU6IDBcblxuXHRzbGlkZUluRG93bjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy55ID0gLUBoZWlnaHRcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblVwOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueSA9IEBoZWlnaHRcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblJpZ2h0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueCA9IEB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluTGVmdDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnggPSAtQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0XG5cdHpvb21JbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnNjYWxlID0gMC44XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHR6b29tZWRJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnNjYWxlID0gMS41XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnggPSBAd2lkdGgvMlxuXHRcdHZpZXcucm90YXRpb25ZID0gMTAwXG5cdFx0dmlldy56ID0gODAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy54ID0gLUB3aWR0aC8yXG5cdFx0dmlldy5yb3RhdGlvblkgPSAtMTAwXG5cdFx0dmlldy56ID0gODAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJblVwOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueSA9IEBoZWlnaHRcblx0XHR2aWV3LnJvdGF0aW9uWCA9IC0xMDBcblx0XHR2aWV3LnogPSA4MDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdHNwaW5JbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0dmlldy5zY2FsZSA9IDAuOFxuXHRcdHZpZXcucm90YXRpb24gPSAxODBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdHJvdGF0aW9uOiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblxuXHRwdXNoSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXHRcdG1vdmUgPVxuXHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gLUB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMiXX0=
