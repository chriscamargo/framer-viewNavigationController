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
        curve: "cubic-bezier(0.19, 1, 0.22, 1)",
        time: .7
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
          scale: 1,
          brightness: 100
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

  ViewNavigationController.prototype.applyAnimation2 = function(view, animProperties, animationOptions) {
    var animation, obj;
    if (!this.readyToAnimate(view)) {
      return;
    }
    if (view !== this.current) {
      _.extend(view, animProperties.from);
      obj = {
        layer: view,
        properties: {}
      };
      _.extend(obj.properties, animProperties.to);
      _.extend(obj, animationOptions);
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

  ViewNavigationController.prototype.slideInLeft = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        x: -this.width
      },
      to: {
        x: view.originalPoint != null ? view.originalPoint.x : 0
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInRight = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        x: this.width
      },
      to: {
        x: view.originalPoint != null ? view.originalPoint.x : 0
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInDown = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        y: -this.height,
        x: 0
      },
      to: {
        y: view.originalPoint != null ? view.originalPoint.y : 0
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInUp = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        y: this.height,
        x: 0
      },
      to: {
        y: view.originalPoint != null ? view.originalPoint.y : 0
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.fadeIn = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        y: 0,
        x: 0,
        opacity: 0
      },
      to: {
        opacity: 1
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.crossDissolve = function(view, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.fadeIn(view, animationOptions);
  };

  ViewNavigationController.prototype.zoomIn = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        x: 0,
        y: 0,
        scale: 0.8,
        opacity: 0
      },
      to: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.zoomedIn = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        x: 0,
        y: 0,
        scale: 1.5,
        opacity: 0
      },
      to: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
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
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        x: -this.width / 2,
        z: 800,
        rotationY: -100
      },
      to: {
        x: view.originalPoint != null ? view.originalPoint.x : 0,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.flipInUp = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        x: 0,
        z: 800,
        y: this.height,
        rotationX: -100
      },
      to: {
        y: view.originalPoint != null ? view.originalPoint.y : 0,
        rotationX: 0,
        z: 0
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.spinIn = function(view, animationOptions) {
    var animationProperties;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    animationProperties = {
      from: {
        x: 0,
        y: 0,
        rotation: 180,
        scale: 0.8,
        opacity: 0
      },
      to: {
        scale: 1,
        opacity: 1,
        rotation: 0
      }
    };
    return this.applyAnimation2(view, animationProperties, animationOptions);
  };

  ViewNavigationController.prototype.iosPushInRight = function(view, animationOptions) {
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
        x: -(this.width / 5),
        brightness: 90
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLGdDQUFQO0FBQUEsUUFBeUMsSUFBQSxFQUFNLEVBQS9DOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtP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WixFQURoQjtBQUFBLFdBRU0sT0FGTjtlQUVtQixJQUFDLENBQUEsV0FBRCxDQUFhLElBQWIsRUFGbkI7QUFBQSxXQUdNLE1BSE47ZUFHa0IsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBSGxCO0FBQUEsV0FJTSxNQUpOO2VBSWtCLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixFQUpsQjtBQUFBLEtBRFc7RUFBQSxDQXpVWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJyZ2JhKDE5MCwxOTAsMTkwLDAuOSlcIlxuXHRcdG9wdGlvbnMucGVyc3BlY3RpdmUgPz0gMTAwMFxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAb24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0aWYgY2hhbmdlTGlzdC5hZGRlZFswXS5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRcdEBzd2l0Y2hJbnN0YW50IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2hhbmdlTGlzdC5hZGRlZFswXS54ID0gQHdpZHRoXG5cblx0YWRkOiAodmlldywgcG9pbnQgPSB7eDowLCB5OjB9LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50ID0gZmFsc2UpIC0+XG5cdFx0aWYgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0QHN3aXRjaEluc3RhbnQgdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0dmlldy5vcmlnaW5hbFBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblxuXHRyZWFkeVRvQW5pbWF0ZTogKHZpZXcpIC0+XG5cdFx0aWYgdmlldyBpc250IEBjdXJyZW50XG5cdFx0XHRpZiBAc3ViTGF5ZXJzLmluZGV4T2YodmlldykgaXMgLTFcblx0XHRcdFx0QGFkZCB2aWV3XG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XG5cdHNhdmVDdXJyZW50VG9IaXN0b3J5OiAoYW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRhbmltYXRpb246IGFuaW1hdGlvblxuXG5cdGJhY2s6IC0+IFxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRhbmltUHJvcGVydGllcyA9IFxuXHRcdFx0XHRsYXllcjogcHJldmlvdXMudmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHg6IGlmIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0XHR5OiBpZiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0XHRicmlnaHRuZXNzOiAxMDBcblxuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbiBhbmltUHJvcGVydGllc1xuXHRcdFx0YW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zID0gcHJldmlvdXMuYW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXHRcblx0XHRcdGFuaW0gPSBwcmV2aW91cy5hbmltYXRpb25cblx0XHRcdGJhY2t3YXJkcyA9IGFuaW0ucmV2ZXJzZSgpXG5cdFx0XHRiYWNrd2FyZHMuc3RhcnQoKVxuXHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0XHRiYWNrd2FyZHMub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRhcHBseUFuaW1hdGlvbjogKHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHVubGVzcyB2aWV3IGlzIEBjdXJyZW50XG5cdFx0XHRvYmogPSBsYXllcjogdmlld1xuXHRcdFx0Xy5leHRlbmQgb2JqLCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbiBvYmpcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgYW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudCA9IHZpZXdcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0YXBwbHlBbmltYXRpb24yOiAodmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXHRcdHVubGVzcyB2aWV3IGlzIEBjdXJyZW50XG5cdFx0XHRfLmV4dGVuZCB2aWV3LCBhbmltUHJvcGVydGllcy5mcm9tXG5cdFx0XHRvYmogPSBcblx0XHRcdFx0bGF5ZXI6IHZpZXdcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIG9iai5wcm9wZXJ0aWVzLCBhbmltUHJvcGVydGllcy50b1xuXHRcdFx0Xy5leHRlbmQgb2JqLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIG9ialxuXHRcdFx0YW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBhbmltYXRpb25cblx0XHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXG5cdCMjIyBBTklNQVRJT05TICMjI1xuXG5cdHN3aXRjaEluc3RhbnQ6ICh2aWV3KSAtPiBAZmFkZUluIHZpZXcsIHRpbWU6IDBcblxuXG5cdHNsaWRlSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRhbmltYXRpb25Qcm9wZXJ0aWVzID1cblx0XHRcdGZyb206XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdHRvOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cblx0XHRAYXBwbHlBbmltYXRpb24yIHZpZXcsIGFuaW1hdGlvblByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGFuaW1hdGlvblByb3BlcnRpZXMgPVxuXHRcdFx0ZnJvbTpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHR0bzpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXG5cdFx0QGFwcGx5QW5pbWF0aW9uMiB2aWV3LCBhbmltYXRpb25Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkRvd246ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGFuaW1hdGlvblByb3BlcnRpZXMgPVxuXHRcdFx0ZnJvbTpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0dG86XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblxuXHRcdEBhcHBseUFuaW1hdGlvbjIgdmlldywgYW5pbWF0aW9uUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5VcDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRhbmltYXRpb25Qcm9wZXJ0aWVzID1cblx0XHRcdGZyb206XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0dG86XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblxuXHRcdEBhcHBseUFuaW1hdGlvbjIgdmlldywgYW5pbWF0aW9uUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRhbmltYXRpb25Qcm9wZXJ0aWVzID1cblx0XHRcdGZyb206XG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0eDogMFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR0bzpcblx0XHRcdFx0b3BhY2l0eTogMVxuXG5cdFx0QGFwcGx5QW5pbWF0aW9uMiB2aWV3LCBhbmltYXRpb25Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0Y3Jvc3NEaXNzb2x2ZTogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRAZmFkZUluIHZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdFxuXHR6b29tSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0YW5pbWF0aW9uUHJvcGVydGllcyA9XG5cdFx0XHRmcm9tOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR0bzpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXG5cdFx0QGFwcGx5QW5pbWF0aW9uMiB2aWV3LCBhbmltYXRpb25Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0em9vbWVkSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0YW5pbWF0aW9uUHJvcGVydGllcyA9XG5cdFx0XHRmcm9tOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0c2NhbGU6IDEuNVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR0bzpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXG5cdFx0QGFwcGx5QW5pbWF0aW9uMiB2aWV3LCBhbmltYXRpb25Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy54ID0gQHdpZHRoLzJcblx0XHR2aWV3LnJvdGF0aW9uWSA9IDEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGFuaW1hdGlvblByb3BlcnRpZXMgPVxuXHRcdFx0ZnJvbTpcblx0XHRcdFx0eDogLUB3aWR0aC8yXG5cdFx0XHRcdHo6IDgwMFxuXHRcdFx0XHRyb3RhdGlvblk6IC0xMDBcblx0XHRcdHRvOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uMiB2aWV3LCBhbmltYXRpb25Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluVXA6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0YW5pbWF0aW9uUHJvcGVydGllcyA9XG5cdFx0XHRmcm9tOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHo6IDgwMFxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRcdHJvdGF0aW9uWDogLTEwMFxuXHRcdFx0dG86XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRcdFx0cm90YXRpb25YOiAwXG5cdFx0XHRcdHo6IDBcblxuXHRcdEBhcHBseUFuaW1hdGlvbjIgdmlldywgYW5pbWF0aW9uUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFxuXHRzcGluSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cblx0XHRhbmltYXRpb25Qcm9wZXJ0aWVzID1cblx0XHRcdGZyb206XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRyb3RhdGlvbjogMTgwXG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0dG86XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0cm90YXRpb246IDBcblxuXHRcdEBhcHBseUFuaW1hdGlvbjIgdmlldywgYW5pbWF0aW9uUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGlvc1B1c2hJblJpZ2h0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblx0XHRtb3ZlID1cblx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogLShAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogOTBcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJblJpZ2h0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblx0XHRtb3ZlID1cblx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdF8uZXh0ZW5kIG1vdmUsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRtb3ZlT3V0ID0gbmV3IEFuaW1hdGlvbiBtb3ZlXG5cdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHR2aWV3LnggPSBAd2lkdGhcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluTGVmdDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdF8uZXh0ZW5kIG1vdmUsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRtb3ZlT3V0ID0gbmV3IEFuaW1hdGlvbiBtb3ZlXG5cdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHR2aWV3LnggPSAtQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJblVwOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblx0XHRtb3ZlID1cblx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy54ID0gMFxuXHRcdHZpZXcueSA9IEBoZWlnaHRcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluRG93bjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXHRcdFxuXHRcdHZpZXcueCA9IDBcblx0XHR2aWV3LnkgPSAtQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRhcHBsZU1haWw6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXHRcdG1vdmUgPVxuXHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0Xy5leHRlbmQgbW92ZSwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdG1vdmVPdXQgPSBuZXcgQW5pbWF0aW9uIG1vdmVcblx0XHRtb3ZlT3V0LnN0YXJ0KClcblxuXHRcdHZpZXcueSA9IEBoZWlnaHRcblx0XHR2aWV3LnggPSAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eTogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMTAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0IyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXHR0cmFuc2l0aW9uOiAodmlldywgZGlyZWN0aW9uID0gJ3JpZ2h0JykgLT5cblx0XHRzd2l0Y2ggZGlyZWN0aW9uXG5cdFx0XHR3aGVuICd1cCcgdGhlbiBAcHVzaEluRG93biB2aWV3XG5cdFx0XHR3aGVuICdyaWdodCcgdGhlbiBAcHVzaEluUmlnaHQgdmlld1xuXHRcdFx0d2hlbiAnZG93bicgdGhlbiBAcHVzaEluVXAgdmlld1xuXHRcdFx0d2hlbiAnbGVmdCcgdGhlbiBAcHVzaEluTGVmdCB2aWV3Il19
