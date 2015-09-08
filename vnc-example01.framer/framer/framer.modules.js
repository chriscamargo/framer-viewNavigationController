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
    view.point = point;
    return view.sendToBack();
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
      newView.opacity = 1;
      newView.brightness = 100;
      newView.scale = 1;
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

  ViewNavigationController.prototype.getPoint = function(view, point) {
    return view.originalPoint || {
      x: 0,
      y: 0
    };
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
        x: this.getPoint(newView).x
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
        x: this.getPoint(newView).x
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
        y: this.getPoint(newView).y
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
        y: this.getPoint(newView).y
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
        x: this.getPoint(newView).x,
        y: this.getPoint(newView).y,
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
        x: this.getPoint(newView).x,
        y: this.getPoint(newView).y
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
        x: this.getPoint(newView).x,
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
        x: this.getPoint(newView).x,
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
        y: this.getPoint(newView).y,
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
        brightness: 80
      }
    };
    incoming = {
      start: {
        brightness: 100,
        x: this.width
      },
      end: {
        x: this.getPoint(newView).x
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
        x: this.getPoint(newView).x
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
        x: this.getPoint(newView).x
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
        x: this.getPoint(newView).x
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
        y: this.getPoint(newView).y
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
        y: this.getPoint(newView).y
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLGdDQUFQO0FBQUEsUUFBeUMsSUFBQSxFQUFNLEVBQS9DOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtP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O0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLFFBQ0EsQ0FBQSxFQUFHLElBQUMsQ0FBQSxNQURKO09BREQ7QUFBQSxNQUdBLEdBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFNLDZCQUFILEdBQStCLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBckQsR0FBNEQsSUFBQyxDQUFBLE1BQUQsR0FBUSxFQUF2RTtPQUpEO0tBTEQsQ0FBQTtXQVVBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLEVBQW1DLGdCQUFuQyxFQUFxRCxRQUFyRCxFQVhNO0VBQUEsQ0F0VVAsQ0FBQTs7QUFBQSxxQ0FvVkEsVUFBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLFNBQVYsR0FBQTs7TUFBVSxZQUFZO0tBQ2pDO0FBQUEsWUFBTyxTQUFQO0FBQUEsV0FDTSxJQUROO2VBQ2dCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQURoQjtBQUFBLFdBRU0sT0FGTjtlQUVtQixJQUFDLENBQUEsV0FBRCxDQUFhLE9BQWIsRUFGbkI7QUFBQSxXQUdNLE1BSE47ZUFHa0IsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBSGxCO0FBQUEsV0FJTSxNQUpOO2VBSWtCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQUpsQjtBQUFBLEtBRFc7RUFBQSxDQXBWWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5wZXJzcGVjdGl2ZSA/PSAxMDAwXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBvbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRpZiBjaGFuZ2VMaXN0LmFkZGVkWzBdLm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdFx0QHN3aXRjaEluc3RhbnQgY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjaGFuZ2VMaXN0LmFkZGVkWzBdLnggPSBAd2lkdGhcblxuXHRhZGQ6ICh2aWV3LCBwb2ludCA9IHt4OjAsIHk6MH0sIHZpYUludGVybmFsQ2hhbmdlRXZlbnQgPSBmYWxzZSkgLT5cblx0XHRpZiB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHRAc3dpdGNoSW5zdGFudCB2aWV3XG5cdFx0ZWxzZVxuXHRcdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdHZpZXcub24gRXZlbnRzLkNsaWNrLCAtPiByZXR1cm4gIyBwcmV2ZW50IGNsaWNrLXRocm91Z2gvYnViYmxpbmdcblx0XHR2aWV3Lm9yaWdpbmFsUG9pbnQgPSBwb2ludFxuXHRcdHZpZXcucG9pbnQgPSBwb2ludFxuXHRcdHZpZXcuc2VuZFRvQmFjaygpXG5cdFx0XG5cdHNhdmVDdXJyZW50VG9IaXN0b3J5OiAoYW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRhbmltYXRpb246IGFuaW1hdGlvblxuXG5cdGJhY2s6IC0+IFxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRhbmltUHJvcGVydGllcyA9IFxuXHRcdFx0XHRsYXllcjogcHJldmlvdXMudmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHg6IGlmIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0XHR5OiBpZiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0XHRicmlnaHRuZXNzOiAxMDBcblxuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbiBhbmltUHJvcGVydGllc1xuXHRcdFx0YW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zID0gcHJldmlvdXMuYW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXHRcblx0XHRcdGFuaW0gPSBwcmV2aW91cy5hbmltYXRpb25cblx0XHRcdGJhY2t3YXJkcyA9IGFuaW0ucmV2ZXJzZSgpXG5cdFx0XHRiYWNrd2FyZHMuc3RhcnQoKVxuXHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0XHRiYWNrd2FyZHMub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRhcHBseUFuaW1hdGlvbjogKG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZyA9IHt9KSAtPlxuXHRcdHVubGVzcyBuZXdWaWV3IGlzIEBjdXJyZW50XG5cblx0XHRcdCMgcmVzZXQgY29tbW9uIHByb3BlcnRpZXMgaW4gY2FzZSB0aGV5XG5cdFx0XHQjIHdlcmUgY2hhbmdlZCBkdXJpbmcgbGFzdCBhbmltYXRpb25cblx0XHRcdCNAY3VycmVudC56ID0gMFxuXHRcdFx0bmV3Vmlldy5vcGFjaXR5ID0gMVxuXHRcdFx0bmV3Vmlldy5icmlnaHRuZXNzID0gMTAwXG5cdFx0XHRuZXdWaWV3LnNjYWxlID0gMVxuXG5cdFx0XHRAYWRkIG5ld1ZpZXcgaWYgQHN1YkxheWVycy5pbmRleE9mKG5ld1ZpZXcpIGlzIC0xXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgY3VycmVudCB2aWV3XG5cdFx0XHRfLmV4dGVuZCBAY3VycmVudCwgb3V0Z29pbmcuc3RhcnRcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uID0gXG5cdFx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0Xy5leHRlbmQgb3V0Z29pbmdBbmltYXRpb24ucHJvcGVydGllcywgb3V0Z29pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBvdXRnb2luZ0FuaW1hdGlvbiwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihvdXRnb2luZ0FuaW1hdGlvbilcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgbmV3IHZpZXdcblx0XHRcdF8uZXh0ZW5kIG5ld1ZpZXcsIGluY29taW5nLnN0YXJ0XG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbiA9IFxuXHRcdFx0XHRsYXllcjogbmV3Vmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb24ucHJvcGVydGllcywgaW5jb21pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBpbmNvbWluZ0FuaW1hdGlvbiwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihpbmNvbWluZ0FuaW1hdGlvbilcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBhbmltYXRpb25cblx0XHRcdEBjdXJyZW50ID0gbmV3Vmlld1xuXHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRnZXRQb2ludDogKHZpZXcsIHBvaW50KSAtPiB2aWV3Lm9yaWdpbmFsUG9pbnQgfHwge3g6MCx5OjB9XG5cblx0IyMjIEFOSU1BVElPTlMgIyMjXG5cblx0c3dpdGNoSW5zdGFudDogKG5ld1ZpZXcpIC0+IEBmYWRlSW4gbmV3VmlldywgdGltZTogMFxuXG5cdHNsaWRlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBzbGlkZUluUmlnaHQgbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5VcDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRjcm9zc0Rpc3NvbHZlOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdEBmYWRlSW4gbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbkJsYWNrOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiBcblx0XHRcdFx0YnJpZ2h0bmVzczogMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdGJyaWdodG5lc3M6IDBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDogXG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0YnJpZ2h0bmVzczogMFxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblx0XHRcdFxuXHR6b29tSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHpvb21lZEluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0c2NhbGU6IDEuNVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBmbGlwSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aC8yXG5cdFx0XHRcdHo6IDgwMFxuXHRcdFx0XHRyb3RhdGlvblk6IDEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdFx0ejogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGgvMlxuXHRcdFx0XHR6OiA4MDBcblx0XHRcdFx0cm90YXRpb25ZOiAtMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0ejogODAwXG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0cm90YXRpb25YOiAtMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdHNwaW5JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdHJvdGF0aW9uOiAxODBcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0cm90YXRpb246IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBwdXNoSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC0oQHdpZHRoLzUpXG5cdFx0XHRcdGJyaWdodG5lc3M6IDgwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0cHVzaEluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogKyhAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogOTBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBtb3ZlSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0bW92ZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJblVwOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vZGFsOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMC45XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSBAaGVpZ2h0LzEwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdCMgQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0dHJhbnNpdGlvbjogKG5ld1ZpZXcsIGRpcmVjdGlvbiA9ICdyaWdodCcpIC0+XG5cdFx0c3dpdGNoIGRpcmVjdGlvblxuXHRcdFx0d2hlbiAndXAnIHRoZW4gQG1vdmVJbkRvd24gbmV3Vmlld1xuXHRcdFx0d2hlbiAncmlnaHQnIHRoZW4gQHB1c2hJblJpZ2h0IG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2Rvd24nIHRoZW4gQG1vdmVJblVwIG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2xlZnQnIHRoZW4gQHB1c2hJbkxlZnQgbmV3VmlldyJdfQ==
