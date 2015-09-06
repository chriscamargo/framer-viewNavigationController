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
    if (newView !== this.current) {
      if (this.subLayers.indexOf(newView) === -1) {
        this.add(newView);
      }
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
        return this.moveInDown(newView);
      case 'right':
        return this.pushInRight(newView);
      case 'down':
        return this.moveInUp(newView);
      case 'left':
        return this.pushInLeft(newView);
    }
  };

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLGdDQUFQO0FBQUEsUUFBeUMsSUFBQSxFQUFNLEVBQS9DOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtP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Q0FBSDtBQUFBLFFBQ0EsQ0FBQSxFQUFHLElBQUMsQ0FBQSxNQURKO09BREQ7QUFBQSxNQUdBLEdBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFNLDZCQUFILEdBQStCLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBckQsR0FBNEQsSUFBQyxDQUFBLE1BQUQsR0FBUSxFQUF2RTtPQUpEO0tBTEQsQ0FBQTtXQVVBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLEVBQW1DLGdCQUFuQyxFQUFxRCxRQUFyRCxFQVhNO0VBQUEsQ0F4VVAsQ0FBQTs7QUFBQSxxQ0FzVkEsVUFBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLFNBQVYsR0FBQTs7TUFBVSxZQUFZO0tBQ2pDO0FBQUEsWUFBTyxTQUFQO0FBQUEsV0FDTSxJQUROO2VBQ2dCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQURoQjtBQUFBLFdBRU0sT0FGTjtlQUVtQixJQUFDLENBQUEsV0FBRCxDQUFhLE9BQWIsRUFGbkI7QUFBQSxXQUdNLE1BSE47ZUFHa0IsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBSGxCO0FBQUEsV0FJTSxNQUpOO2VBSWtCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQUpsQjtBQUFBLEtBRFc7RUFBQSxDQXRWWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5wZXJzcGVjdGl2ZSA/PSAxMDAwXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBvbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRpZiBjaGFuZ2VMaXN0LmFkZGVkWzBdLm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdFx0QHN3aXRjaEluc3RhbnQgY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjaGFuZ2VMaXN0LmFkZGVkWzBdLnggPSBAd2lkdGhcblxuXHRhZGQ6ICh2aWV3LCBwb2ludCA9IHt4OjAsIHk6MH0sIHZpYUludGVybmFsQ2hhbmdlRXZlbnQgPSBmYWxzZSkgLT5cblx0XHRpZiB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHRAc3dpdGNoSW5zdGFudCB2aWV3XG5cdFx0ZWxzZVxuXHRcdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdHZpZXcub24gRXZlbnRzLkNsaWNrLCAtPiByZXR1cm4gIyBwcmV2ZW50IGNsaWNrLXRocm91Z2gvYnViYmxpbmdcblx0XHR2aWV3Lm9yaWdpbmFsUG9pbnQgPSBwb2ludFxuXHRcdHZpZXcucG9pbnQgPSBwb2ludFxuXG5cdHJlYWR5VG9BbmltYXRlOiAodmlldykgLT5cblx0XHRpZiB2aWV3IGlzbnQgQGN1cnJlbnRcblx0XHRcdGlmIEBzdWJMYXllcnMuaW5kZXhPZih2aWV3KSBpcyAtMVxuXHRcdFx0XHRAYWRkIHZpZXdcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcblx0c2F2ZUN1cnJlbnRUb0hpc3Rvcnk6IChhbmltYXRpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRcblx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uXG5cblx0YmFjazogLT4gXG5cdFx0cHJldmlvdXMgPSBAaGlzdG9yeVswXVxuXHRcdGlmIHByZXZpb3VzLnZpZXc/XG5cblx0XHRcdGFuaW1Qcm9wZXJ0aWVzID0gXG5cdFx0XHRcdGxheWVyOiBwcmV2aW91cy52aWV3XG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0eDogaWYgcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRcdHk6IGlmIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXG5cdFx0XHRhbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uIGFuaW1Qcm9wZXJ0aWVzXG5cdFx0XHRhbmltYXRpb24ub3B0aW9ucy5jdXJ2ZU9wdGlvbnMgPSBwcmV2aW91cy5hbmltYXRpb24ub3B0aW9ucy5jdXJ2ZU9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cdFxuXHRcdFx0YW5pbSA9IHByZXZpb3VzLmFuaW1hdGlvblxuXHRcdFx0YmFja3dhcmRzID0gYW5pbS5yZXZlcnNlKClcblx0XHRcdGJhY2t3YXJkcy5zdGFydCgpXG5cdFx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdGJhY2t3YXJkcy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cdGFwcGx5QW5pbWF0aW9uOiAobmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nID0ge30pIC0+XG5cdFx0dW5sZXNzIG5ld1ZpZXcgaXMgQGN1cnJlbnRcblxuXHRcdFx0aWYgQHN1YkxheWVycy5pbmRleE9mKG5ld1ZpZXcpIGlzIC0xXG5cdFx0XHRcdEBhZGQgbmV3Vmlld1xuXG5cdFx0XHQjIEFuaW1hdGUgdGhlIGN1cnJlbnQgdmlld1xuXHRcdFx0Xy5leHRlbmQgQGN1cnJlbnQsIG91dGdvaW5nLnN0YXJ0XG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbiA9IFxuXHRcdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIG91dGdvaW5nQW5pbWF0aW9uLnByb3BlcnRpZXMsIG91dGdvaW5nLmVuZFxuXHRcdFx0Xy5leHRlbmQgb3V0Z29pbmdBbmltYXRpb24sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24ob3V0Z29pbmdBbmltYXRpb24pXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHQjIEFuaW1hdGUgdGhlIG5ldyB2aWV3XG5cdFx0XHRfLmV4dGVuZCBuZXdWaWV3LCBpbmNvbWluZy5zdGFydFxuXHRcdFx0aW5jb21pbmdBbmltYXRpb24gPSBcblx0XHRcdFx0bGF5ZXI6IG5ld1ZpZXdcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIGluY29taW5nQW5pbWF0aW9uLnByb3BlcnRpZXMsIGluY29taW5nLmVuZFxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb24sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24oaW5jb21pbmdBbmltYXRpb24pXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgYW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudCA9IG5ld1ZpZXdcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblxuXHQjIyMgQU5JTUFUSU9OUyAjIyNcblxuXHRzd2l0Y2hJbnN0YW50OiAobmV3VmlldykgLT4gQGZhZGVJbiBuZXdWaWV3LCB0aW1lOiAwXG5cblx0c2xpZGVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QHNsaWRlSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblVwOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogMFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGNyb3NzRGlzc29sdmU6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0QGZhZGVJbiBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluQmxhY2s6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IFxuXHRcdFx0XHRicmlnaHRuZXNzOiAxMDBcblx0XHRcdGVuZDpcblx0XHRcdFx0YnJpZ2h0bmVzczogMFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OiBcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRicmlnaHRuZXNzOiAwXG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0eTogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblx0XHRcdFxuXHR6b29tSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHpvb21lZEluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0c2NhbGU6IDEuNVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBmbGlwSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aC8yXG5cdFx0XHRcdHo6IDgwMFxuXHRcdFx0XHRyb3RhdGlvblk6IDEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aC8yXG5cdFx0XHRcdHo6IDgwMFxuXHRcdFx0XHRyb3RhdGlvblk6IC0xMDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJblVwOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHo6IDgwMFxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRcdHJvdGF0aW9uWDogLTEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdHNwaW5JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdHJvdGF0aW9uOiAxODBcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0cm90YXRpb246IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBwdXNoSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC0oQHdpZHRoLzUpXG5cdFx0XHRcdGJyaWdodG5lc3M6IDkwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdHB1c2hJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6ICsoQHdpZHRoLzUpXG5cdFx0XHRcdGJyaWdodG5lc3M6IDkwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBtb3ZlSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0bW92ZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5VcDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblxuXG5cdG1vZGFsOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMC45XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSBAaGVpZ2h0LzEwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdCMgQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0dHJhbnNpdGlvbjogKG5ld1ZpZXcsIGRpcmVjdGlvbiA9ICdyaWdodCcpIC0+XG5cdFx0c3dpdGNoIGRpcmVjdGlvblxuXHRcdFx0d2hlbiAndXAnIHRoZW4gQG1vdmVJbkRvd24gbmV3Vmlld1xuXHRcdFx0d2hlbiAncmlnaHQnIHRoZW4gQHB1c2hJblJpZ2h0IG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2Rvd24nIHRoZW4gQG1vdmVJblVwIG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2xlZnQnIHRoZW4gQHB1c2hJbkxlZnQgbmV3VmlldyJdfQ==
