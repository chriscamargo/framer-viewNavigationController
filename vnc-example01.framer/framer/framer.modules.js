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
          y: previous.view.originalPoint != null ? previous.view.originalPoint.y : 0,
          scale: 1
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

  ViewNavigationController.prototype.pushInUp = function(view, animationOptions) {
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
        y: -this.height
      }
    };
    _.extend(move, animationOptions);
    moveOut = new Animation(move);
    moveOut.start();
    view.x = 0;
    view.y = this.height;
    animProperties = {
      properties: {
        y: view.originalPoint != null ? view.originalPoint.y : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.pushInDown = function(view, animationOptions) {
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
        y: this.height
      }
    };
    _.extend(move, animationOptions);
    moveOut = new Animation(move);
    moveOut.start();
    view.x = 0;
    view.y = -this.height;
    animProperties = {
      properties: {
        y: view.originalPoint != null ? view.originalPoint.y : 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.appleMail = function(view, animationOptions) {
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
        scale: 0.8
      }
    };
    _.extend(move, animationOptions);
    moveOut = new Animation(move);
    moveOut.start();
    view.y = this.height;
    view.x = 0;
    animProperties = {
      properties: {
        y: view.originalPoint != null ? view.originalPoint.y : 100
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.transition = function(view, direction) {
    if (direction == null) {
      direction = 'right';
    }
    switch (direction) {
      case 'up':
        return this.pushInDown(view);
      case 'right':
        return this.pushInRight(view);
      case 'down':
        return this.pushInUp(view);
      case 'left':
        return this.pushInLeft(view);
    }
  };

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFBcUMsSUFBQSxFQUFNLEVBQTNDOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtP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QUFBLFdBR00sTUFITjtlQUdrQixJQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFIbEI7QUFBQSxXQUlNLE1BSk47ZUFJa0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLEVBSmxCO0FBQUEsS0FEVztFQUFBLENBL1JaLENBQUE7O2tDQUFBOztHQUY4QyxNQUEvQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgVE9ETzpcbiMgQWRkIGN1c3RvbSBhbmltYXRpb25PcHRpb25zIHRvIC5iYWNrKCk/XG4jIEFkZCBcIm1vdmVPdXRcIiBhbmltYXRpb25zPyB3aGF0J3MgdGhlIHVzZSBjYXNlPyBjb3ZlcmVkIGJ5IGJhY2s/XG4jIElmIG5vIG5lZWQgZm9yIG1vdmVPdXQsIG1heWJlIHdlIHdvbnQgbmVlZCBjb25zaXN0ZW50IFwiSW5cIiBuYW1pbmcgc2NoZW1lXG5cbmNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5pbml0aWFsVmlld05hbWUgPz0gJ2luaXRpYWxWaWV3J1xuXHRcdG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyA/PSBjdXJ2ZTogXCJiZXppZXItY3VydmUoLjIsIDEsIC4yLCAxKVwiLCB0aW1lOiAuNlxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwicmdiYSgxOTAsMTkwLDE5MCwwLjkpXCJcblx0XHRvcHRpb25zLnBlcnNwZWN0aXZlID89IDEwMDBcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0QG9uIFwiY2hhbmdlOnN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgLT5cblx0XHRcdGlmIGNoYW5nZUxpc3QuYWRkZWRbMF0ubmFtZSBpcyBvcHRpb25zLmluaXRpYWxWaWV3TmFtZVxuXHRcdFx0XHRAc3dpdGNoSW5zdGFudCBjaGFuZ2VMaXN0LmFkZGVkWzBdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNoYW5nZUxpc3QuYWRkZWRbMF0ueCA9IEB3aWR0aFxuXG5cdGFkZDogKHZpZXcsIHBvaW50ID0ge3g6MCwgeTowfSwgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudCA9IGZhbHNlKSAtPlxuXHRcdGlmIHZpYUludGVybmFsQ2hhbmdlRXZlbnRcblx0XHRcdEBzd2l0Y2hJbnN0YW50IHZpZXdcblx0XHRlbHNlXG5cdFx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cdFx0dmlldy5vbiBFdmVudHMuQ2xpY2ssIC0+IHJldHVybiAjIHByZXZlbnQgY2xpY2stdGhyb3VnaC9idWJibGluZ1xuXHRcdHZpZXcub3JpZ2luYWxQb2ludCA9IHBvaW50XG5cdFx0dmlldy5wb2ludCA9IHBvaW50XG5cblx0cmVhZHlUb0FuaW1hdGU6ICh2aWV3KSAtPlxuXHRcdGlmIHZpZXcgaXNudCBAY3VycmVudFxuXHRcdFx0aWYgQHN1YkxheWVycy5pbmRleE9mKHZpZXcpIGlzIC0xXG5cdFx0XHRcdEBhZGQgdmlld1xuXHRcdFx0cmV0dXJuIHRydWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFxuXHRzYXZlQ3VycmVudFRvSGlzdG9yeTogKGFuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0YW5pbWF0aW9uOiBhbmltYXRpb25cblxuXHRiYWNrOiAtPiBcblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0aWYgcHJldmlvdXMudmlldz9cblxuXHRcdFx0YW5pbVByb3BlcnRpZXMgPSBcblx0XHRcdFx0bGF5ZXI6IHByZXZpb3VzLnZpZXdcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHR4OiBpZiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdFx0eTogaWYgcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdFx0XHRcdHNjYWxlOiAxXG5cblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24gYW5pbVByb3BlcnRpZXNcblx0XHRcdGFuaW1hdGlvbi5vcHRpb25zLmN1cnZlT3B0aW9ucyA9IHByZXZpb3VzLmFuaW1hdGlvbi5vcHRpb25zLmN1cnZlT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XG5cdFx0XHRhbmltID0gcHJldmlvdXMuYW5pbWF0aW9uXG5cdFx0XHRiYWNrd2FyZHMgPSBhbmltLnJldmVyc2UoKVxuXHRcdFx0YmFja3dhcmRzLnN0YXJ0KClcblx0XHRcdEBjdXJyZW50ID0gcHJldmlvdXMudmlld1xuXHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdFx0YmFja3dhcmRzLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0YXBwbHlBbmltYXRpb246ICh2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHR1bmxlc3MgdmlldyBpcyBAY3VycmVudFxuXHRcdFx0b2JqID0gbGF5ZXI6IHZpZXdcblx0XHRcdF8uZXh0ZW5kIG9iaiwgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24gb2JqXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXHRcdFx0QHNhdmVDdXJyZW50VG9IaXN0b3J5IGFuaW1hdGlvblxuXHRcdFx0QGN1cnJlbnQgPSB2aWV3XG5cdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cblx0IyMjIEFOSU1BVElPTlMgIyMjXG5cblx0c3dpdGNoSW5zdGFudDogKHZpZXcpIC0+IEBmYWRlSW4gdmlldywgdGltZTogMFxuXG5cdHNsaWRlSW5Eb3duOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnkgPSAtQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluVXA6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy55ID0gQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy54ID0gQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueCA9IC1Ad2lkdGhcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHR2aWV3LnggPSAwXG5cdFx0dmlldy55ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRjcm9zc0Rpc3NvbHZlOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdEBmYWRlSW4gdmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0XG5cdHpvb21JbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnNjYWxlID0gMC44XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHR6b29tZWRJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnNjYWxlID0gMS41XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnggPSBAd2lkdGgvMlxuXHRcdHZpZXcucm90YXRpb25ZID0gMTAwXG5cdFx0dmlldy56ID0gODAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy54ID0gLUB3aWR0aC8yXG5cdFx0dmlldy5yb3RhdGlvblkgPSAtMTAwXG5cdFx0dmlldy56ID0gODAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJblVwOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueSA9IEBoZWlnaHRcblx0XHR2aWV3LnJvdGF0aW9uWCA9IC0xMDBcblx0XHR2aWV3LnogPSA4MDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdHNwaW5JbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0dmlldy5zY2FsZSA9IDAuOFxuXHRcdHZpZXcucm90YXRpb24gPSAxODBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdHJvdGF0aW9uOiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblxuXHRwdXNoSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXHRcdG1vdmUgPVxuXHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gLUB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW5VcDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0Xy5leHRlbmQgbW92ZSwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdG1vdmVPdXQgPSBuZXcgQW5pbWF0aW9uIG1vdmVcblx0XHRtb3ZlT3V0LnN0YXJ0KClcblxuXHRcdHZpZXcueCA9IDBcblx0XHR2aWV3LnkgPSBAaGVpZ2h0XG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eTogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJbkRvd246ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXHRcdG1vdmUgPVxuXHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0Xy5leHRlbmQgbW92ZSwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdG1vdmVPdXQgPSBuZXcgQW5pbWF0aW9uIG1vdmVcblx0XHRtb3ZlT3V0LnN0YXJ0KClcblx0XHRcblx0XHR2aWV3LnggPSAwXG5cdFx0dmlldy55ID0gLUBoZWlnaHRcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0YXBwbGVNYWlsOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblx0XHRtb3ZlID1cblx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdF8uZXh0ZW5kIG1vdmUsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRtb3ZlT3V0ID0gbmV3IEFuaW1hdGlvbiBtb3ZlXG5cdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHR2aWV3LnkgPSBAaGVpZ2h0XG5cdFx0dmlldy54ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDEwMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdCMgQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0dHJhbnNpdGlvbjogKHZpZXcsIGRpcmVjdGlvbiA9ICdyaWdodCcpIC0+XG5cdFx0c3dpdGNoIGRpcmVjdGlvblxuXHRcdFx0d2hlbiAndXAnIHRoZW4gQHB1c2hJbkRvd24gdmlld1xuXHRcdFx0d2hlbiAncmlnaHQnIHRoZW4gQHB1c2hJblJpZ2h0IHZpZXdcblx0XHRcdHdoZW4gJ2Rvd24nIHRoZW4gQHB1c2hJblVwIHZpZXdcblx0XHRcdHdoZW4gJ2xlZnQnIHRoZW4gQHB1c2hJbkxlZnQgdmlldyJdfQ==
