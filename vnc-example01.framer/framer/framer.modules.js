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
      options.backgroundColor = "black";
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

  ViewNavigationController.prototype.applyAnimation = function(newView, incoming, animationOptions, outgoing) {
    var animation, incomingAnimation, outgoingAnimation;
    if (outgoing == null) {
      outgoing = {};
    }
    if (!this.readyToAnimate(newView)) {
      return;
    }
    if (newView !== this.current) {
      _.extend(this.current, outgoing.start);
      outgoingAnimation = {
        layer: this.current,
        properties: {}
      };
      _.extend(outgoingAnimation.properties, outgoing.end);
      _.extend(outgoingAnimation, animationOptions);
      animation = new Animation(outgoingAnimation);
      animation.start();
      _.extend(newView, incoming.start);
      incomingAnimation = {
        layer: newView,
        properties: {}
      };
      _.extend(incomingAnimation.properties, incoming.end);
      _.extend(incomingAnimation, animationOptions);
      animation = new Animation(incomingAnimation);
      animation.start();
      this.saveCurrentToHistory(animation);
      this.current = newView;
      return this.current.bringToFront();
    }
  };


  /* ANIMATIONS */

  ViewNavigationController.prototype.switchInstant = function(newView) {
    return this.fadeIn(newView, {
      time: 0
    });
  };

  ViewNavigationController.prototype.slideIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.slideInRight(newView, animationOptions);
  };

  ViewNavigationController.prototype.slideInLeft = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.slideInRight = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: this.width
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.slideInDown = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        y: -this.height,
        x: 0
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.slideInUp = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        y: this.height,
        x: 0
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.fadeIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        y: 0,
        x: 0,
        opacity: 0
      },
      end: {
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.crossDissolve = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.fadeIn(newView, animationOptions);
  };

  ViewNavigationController.prototype.fadeInBlack = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {
        brightness: 100
      },
      end: {
        brightness: 0
      }
    };
    incoming = {
      start: {
        opacity: 0,
        brightness: 0,
        x: newView.originalPoint != null ? newView.originalPoint.x : 0,
        y: newView.originalPoint != null ? newView.originalPoint.y : 0
      },
      end: {
        opacity: 1,
        brightness: 100
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.zoomIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        y: 0,
        scale: 0.8,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.zoomedIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        y: 0,
        scale: 1.5,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.flipIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.flipInRight(newView, animationOptions);
  };

  ViewNavigationController.prototype.flipInRight = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: this.width / 2,
        z: 800,
        rotationY: 100
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.flipInLeft = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: -this.width / 2,
        z: 800,
        rotationY: -100
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.flipInUp = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        z: 800,
        y: this.height,
        rotationX: -100
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : 0,
        rotationX: 0,
        z: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.spinIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        y: 0,
        rotation: 180,
        scale: 0.8,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1,
        rotation: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewNavigationController.prototype.pushIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.pushInRight(newView, animationOptions);
  };

  ViewNavigationController.prototype.pushInRight = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: -(this.width / 5),
        brightness: 90
      }
    };
    incoming = {
      start: {
        x: this.width
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.pushInLeft = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: +(this.width / 5),
        brightness: 90
      }
    };
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.moveIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.moveInRight(newView, animationOptions);
  };

  ViewNavigationController.prototype.moveInRight = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: -this.width
      }
    };
    incoming = {
      start: {
        x: this.width
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.moveInLeft = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: this.width
      }
    };
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: newView.originalPoint != null ? newView.originalPoint.x : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.moveInUp = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        y: -this.height
      }
    };
    incoming = {
      start: {
        x: 0,
        y: this.height
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.moveInDown = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        y: this.height
      }
    };
    incoming = {
      start: {
        x: 0,
        y: -this.height
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.modal = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        scale: 0.9
      }
    };
    incoming = {
      start: {
        x: 0,
        y: this.height
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : this.height / 10
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.transition = function(newView, direction) {
    if (direction == null) {
      direction = 'right';
    }
    switch (direction) {
      case 'up':
        return this.pushInDown(newView);
      case 'right':
        return this.pushInRight(newView);
      case 'down':
        return this.pushInUp(newView);
      case 'left':
        return this.pushInLeft(newView);
    }
  };

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLGdDQUFQO0FBQUEsUUFBeUMsSUFBQSxFQUFNLEVBQS9DOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtP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QUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFNLDZCQUFILEdBQStCLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBckQsR0FBNEQsSUFBQyxDQUFBLE1BQUQsR0FBUSxFQUF2RTtPQUpEO0tBTEQsQ0FBQTtXQVVBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLEVBQW1DLGdCQUFuQyxFQUFxRCxRQUFyRCxFQVhNO0VBQUEsQ0F0VVAsQ0FBQTs7QUFBQSxxQ0FvVkEsVUFBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLFNBQVYsR0FBQTs7TUFBVSxZQUFZO0tBQ2pDO0FBQUEsWUFBTyxTQUFQO0FBQUEsV0FDTSxJQUROO2VBQ2dCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQURoQjtBQUFBLFdBRU0sT0FGTjtlQUVtQixJQUFDLENBQUEsV0FBRCxDQUFhLE9BQWIsRUFGbkI7QUFBQSxXQUdNLE1BSE47ZUFHa0IsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBSGxCO0FBQUEsV0FJTSxNQUpOO2VBSWtCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQUpsQjtBQUFBLEtBRFc7RUFBQSxDQXBWWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5wZXJzcGVjdGl2ZSA/PSAxMDAwXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBvbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRpZiBjaGFuZ2VMaXN0LmFkZGVkWzBdLm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdFx0QHN3aXRjaEluc3RhbnQgY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjaGFuZ2VMaXN0LmFkZGVkWzBdLnggPSBAd2lkdGhcblxuXHRhZGQ6ICh2aWV3LCBwb2ludCA9IHt4OjAsIHk6MH0sIHZpYUludGVybmFsQ2hhbmdlRXZlbnQgPSBmYWxzZSkgLT5cblx0XHRpZiB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHRAc3dpdGNoSW5zdGFudCB2aWV3XG5cdFx0ZWxzZVxuXHRcdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdHZpZXcub24gRXZlbnRzLkNsaWNrLCAtPiByZXR1cm4gIyBwcmV2ZW50IGNsaWNrLXRocm91Z2gvYnViYmxpbmdcblx0XHR2aWV3Lm9yaWdpbmFsUG9pbnQgPSBwb2ludFxuXHRcdHZpZXcucG9pbnQgPSBwb2ludFxuXG5cdHJlYWR5VG9BbmltYXRlOiAodmlldykgLT5cblx0XHRpZiB2aWV3IGlzbnQgQGN1cnJlbnRcblx0XHRcdGlmIEBzdWJMYXllcnMuaW5kZXhPZih2aWV3KSBpcyAtMVxuXHRcdFx0XHRAYWRkIHZpZXdcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcblx0c2F2ZUN1cnJlbnRUb0hpc3Rvcnk6IChhbmltYXRpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRcblx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uXG5cblx0YmFjazogLT4gXG5cdFx0cHJldmlvdXMgPSBAaGlzdG9yeVswXVxuXHRcdGlmIHByZXZpb3VzLnZpZXc/XG5cblx0XHRcdGFuaW1Qcm9wZXJ0aWVzID0gXG5cdFx0XHRcdGxheWVyOiBwcmV2aW91cy52aWV3XG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0eDogaWYgcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRcdHk6IGlmIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIGFuaW1Qcm9wZXJ0aWVzXG5cdFx0XHRhbmltYXRpb24ub3B0aW9ucy5jdXJ2ZU9wdGlvbnMgPSBwcmV2aW91cy5hbmltYXRpb24ub3B0aW9ucy5jdXJ2ZU9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cdFxuXHRcdFx0YW5pbSA9IHByZXZpb3VzLmFuaW1hdGlvblxuXHRcdFx0YmFja3dhcmRzID0gYW5pbS5yZXZlcnNlKClcblx0XHRcdGJhY2t3YXJkcy5zdGFydCgpXG5cdFx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdGJhY2t3YXJkcy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cdGFwcGx5QW5pbWF0aW9uOiAobmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nID0ge30pIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgbmV3Vmlld1xuXHRcdHVubGVzcyBuZXdWaWV3IGlzIEBjdXJyZW50XG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgY3VycmVudCB2aWV3XG5cdFx0XHRfLmV4dGVuZCBAY3VycmVudCwgb3V0Z29pbmcuc3RhcnRcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uID0gXG5cdFx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0Xy5leHRlbmQgb3V0Z29pbmdBbmltYXRpb24ucHJvcGVydGllcywgb3V0Z29pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBvdXRnb2luZ0FuaW1hdGlvbiwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihvdXRnb2luZ0FuaW1hdGlvbilcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgbmV3IHZpZXdcblx0XHRcdF8uZXh0ZW5kIG5ld1ZpZXcsIGluY29taW5nLnN0YXJ0XG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbiA9IFxuXHRcdFx0XHRsYXllcjogbmV3Vmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb24ucHJvcGVydGllcywgaW5jb21pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBpbmNvbWluZ0FuaW1hdGlvbiwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihpbmNvbWluZ0FuaW1hdGlvbilcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBhbmltYXRpb25cblx0XHRcdEBjdXJyZW50ID0gbmV3Vmlld1xuXHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXG5cdCMjIyBBTklNQVRJT05TICMjI1xuXG5cdHN3aXRjaEluc3RhbnQ6IChuZXdWaWV3KSAtPiBAZmFkZUluIG5ld1ZpZXcsIHRpbWU6IDBcblxuXHRzbGlkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAc2xpZGVJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkRvd246IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0Y3Jvc3NEaXNzb2x2ZTogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRAZmFkZUluIG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmYWRlSW5CbGFjazogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDogXG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRicmlnaHRuZXNzOiAwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6IFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdGJyaWdodG5lc3M6IDBcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0YnJpZ2h0bmVzczogMTAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXHRcdFx0XG5cdHpvb21JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0em9vbWVkSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRzY2FsZTogMS41XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QGZsaXBJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoLzJcblx0XHRcdFx0ejogODAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoLzJcblx0XHRcdFx0ejogODAwXG5cdFx0XHRcdHJvdGF0aW9uWTogLTEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0ejogODAwXG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0cm90YXRpb25YOiAtMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRcdFx0cm90YXRpb25YOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcblx0c3BpbkluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0cm90YXRpb246IDE4MFxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRyb3RhdGlvbjogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QHB1c2hJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogLShAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogOTBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0cHVzaEluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogKyhAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogOTBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QG1vdmVJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRtb3ZlSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJblVwOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXG5cblx0bW9kYWw6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAwLjlcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIEBoZWlnaHQvMTBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0IyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXHR0cmFuc2l0aW9uOiAobmV3VmlldywgZGlyZWN0aW9uID0gJ3JpZ2h0JykgLT5cblx0XHRzd2l0Y2ggZGlyZWN0aW9uXG5cdFx0XHR3aGVuICd1cCcgdGhlbiBAcHVzaEluRG93biBuZXdWaWV3XG5cdFx0XHR3aGVuICdyaWdodCcgdGhlbiBAcHVzaEluUmlnaHQgbmV3Vmlld1xuXHRcdFx0d2hlbiAnZG93bicgdGhlbiBAcHVzaEluVXAgbmV3Vmlld1xuXHRcdFx0d2hlbiAnbGVmdCcgdGhlbiBAcHVzaEluTGVmdCBuZXdWaWV3Il19
