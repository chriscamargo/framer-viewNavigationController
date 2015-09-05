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

  ViewNavigationController.prototype.iosPushInRight = function(newView, animationOptions) {
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

  ViewNavigationController.prototype.iosPushInLeft = function(newView, animationOptions) {
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

  ViewNavigationController.prototype.pushInRight = function(newView, animationOptions) {
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

  ViewNavigationController.prototype.pushInLeft = function(view, animationOptions) {
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

  ViewNavigationController.prototype.pushInUp = function(view, animationOptions) {
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
        y: view.originalPoint != null ? view.originalPoint.y : 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewNavigationController.prototype.pushInDown = function(newView, animationOptions) {
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

  ViewNavigationController.prototype.appleMail = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        scale: 0.8
      }
    };
    incoming = {
      start: {
        x: 0,
        y: this.height
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : 100
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLGdDQUFQO0FBQUEsUUFBeUMsSUFBQSxFQUFNLEVBQS9DOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtPQUFBLE1BQUE7ZUFHQyxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLENBQXBCLEdBQXdCLElBQUMsQ0FBQSxNQUgxQjtPQUR1QjtJQUFBLENBQXhCLENBVkEsQ0FEWTtFQUFBLENBQWI7O0FBQUEscUNBaUJBLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQTJCLHNCQUEzQixHQUFBOztNQUFPLFFBQVE7QUFBQSxRQUFDLENBQUEsRUFBRSxDQUFIO0FBQUEsUUFBTSxDQUFBLEVBQUUsQ0FBUjs7S0FDbkI7O01BRCtCLHlCQUF5QjtLQUN4RDtBQUFBLElBQUEsSUFBRyxzQkFBSDtBQUNDLE1BQUEsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmLENBQUEsQ0FERDtLQUFBLE1BQUE7QUFHQyxNQUFBLElBQUksQ0FBQyxVQUFMLEdBQWtCLElBQWxCLENBSEQ7S0FBQTtBQUFBLElBSUEsSUFBSSxDQUFDLEVBQUwsQ0FBUSxNQUFNLENBQUMsS0FBZixFQUFzQixTQUFBLEdBQUEsQ0FBdEIsQ0FKQSxDQUFBO0FBQUEsSUFLQSxJQUFJLENBQUMsYUFBTCxHQUFxQixLQUxyQixDQUFBO1dBTUEsSUFBSSxDQUFDLEtBQUwsR0FBYSxNQVBUO0VBQUEsQ0FqQkwsQ0FBQTs7QUFBQSxxQ0EwQkEsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNmLElBQUEsSUFBRyxJQUFBLEtBQVUsSUFBQyxDQUFBLE9BQWQ7QUFDQyxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLElBQW5CLENBQUEsS0FBNEIsQ0FBQSxDQUEvQjtBQUNDLFFBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLENBQUEsQ0FERDtPQUFBO0FBRUEsYUFBTyxJQUFQLENBSEQ7S0FBQSxNQUFBO0FBS0MsYUFBTyxLQUFQLENBTEQ7S0FEZTtFQUFBLENBMUJoQixDQUFBOztBQUFBLHFDQW1DQSxvQkFBQSxHQUFzQixTQUFDLFNBQUQsR0FBQTtXQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FDQztBQUFBLE1BQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxPQUFQO0FBQUEsTUFDQSxTQUFBLEVBQVcsU0FEWDtLQURELEVBRHFCO0VBQUEsQ0FuQ3RCLENBQUE7O0FBQUEscUNBd0NBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDTCxRQUFBLG9EQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQXBCLENBQUE7QUFDQSxJQUFBLElBQUcscUJBQUg7QUFFQyxNQUFBLGNBQUEsR0FDQztBQUFBLFFBQUEsS0FBQSxFQUFPLFFBQVEsQ0FBQyxJQUFoQjtBQUFBLFFBQ0EsVUFBQSxFQUNDO0FBQUEsVUFBQSxDQUFBLEVBQU0sbUNBQUgsR0FBcUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBakUsR0FBd0UsQ0FBM0U7QUFBQSxVQUNBLENBQUEsRUFBTSxtQ0FBSCxHQUFxQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFqRSxHQUF3RSxDQUQzRTtBQUFBLFVBRUEsS0FBQSxFQUFPLENBRlA7QUFBQSxVQUdBLFVBQUEsRUFBWSxHQUhaO1NBRkQ7T0FERCxDQUFBO0FBQUEsTUFRQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLGNBQVYsQ0FSaEIsQ0FBQTtBQUFBLE1BU0EsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFsQixHQUFpQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQVQ1RCxDQUFBO0FBQUEsTUFVQSxTQUFTLENBQUMsS0FBVixDQUFBLENBVkEsQ0FBQTtBQUFBLE1BWUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxTQVpoQixDQUFBO0FBQUEsTUFhQSxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQWJaLENBQUE7QUFBQSxNQWNBLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FkQSxDQUFBO0FBQUEsTUFlQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxJQWZwQixDQUFBO0FBQUEsTUFnQkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQUEsQ0FoQkEsQ0FBQTthQWlCQSxTQUFTLENBQUMsRUFBVixDQUFhLE1BQU0sQ0FBQyxZQUFwQixFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNqQyxLQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxFQURpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBbkJEO0tBRks7RUFBQSxDQXhDTixDQUFBOztBQUFBLHFDQWdFQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsZ0JBQXBCLEVBQXNDLFFBQXRDLEdBQUE7QUFDZixRQUFBLCtDQUFBOztNQURxRCxXQUFXO0tBQ2hFO0FBQUEsSUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsQ0FBZDtBQUFBLFlBQUEsQ0FBQTtLQUFBO0FBQ0EsSUFBQSxJQUFPLE9BQUEsS0FBVyxJQUFDLENBQUEsT0FBbkI7QUFHQyxNQUFBLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLE9BQVYsRUFBbUIsUUFBUSxDQUFDLEtBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsaUJBQUEsR0FDQztBQUFBLFFBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxPQUFSO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQUZELENBQUE7QUFBQSxNQUlBLENBQUMsQ0FBQyxNQUFGLENBQVMsaUJBQWlCLENBQUMsVUFBM0IsRUFBdUMsUUFBUSxDQUFDLEdBQWhELENBSkEsQ0FBQTtBQUFBLE1BS0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxpQkFBVCxFQUE0QixnQkFBNUIsQ0FMQSxDQUFBO0FBQUEsTUFNQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLGlCQUFWLENBTmhCLENBQUE7QUFBQSxNQU9BLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FQQSxDQUFBO0FBQUEsTUFVQSxDQUFDLENBQUMsTUFBRixDQUFTLE9BQVQsRUFBa0IsUUFBUSxDQUFDLEtBQTNCLENBVkEsQ0FBQTtBQUFBLE1BV0EsaUJBQUEsR0FDQztBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUNBLFVBQUEsRUFBWSxFQURaO09BWkQsQ0FBQTtBQUFBLE1BY0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxpQkFBaUIsQ0FBQyxVQUEzQixFQUF1QyxRQUFRLENBQUMsR0FBaEQsQ0FkQSxDQUFBO0FBQUEsTUFlQSxDQUFDLENBQUMsTUFBRixDQUFTLGlCQUFULEVBQTRCLGdCQUE1QixDQWZBLENBQUE7QUFBQSxNQWdCQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLGlCQUFWLENBaEJoQixDQUFBO0FBQUEsTUFpQkEsU0FBUyxDQUFDLEtBQVYsQ0FBQSxDQWpCQSxDQUFBO0FBQUEsTUFtQkEsSUFBQyxDQUFBLG9CQUFELENBQXNCLFNBQXRCLENBbkJBLENBQUE7QUFBQSxNQW9CQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BcEJYLENBQUE7YUFxQkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsRUF4QkQ7S0FGZTtFQUFBLENBaEVoQixDQUFBOztBQTZGQTtBQUFBLGtCQTdGQTs7QUFBQSxxQ0ErRkEsYUFBQSxHQUFlLFNBQUMsT0FBRCxHQUFBO1dBQWEsSUFBQyxDQUFBLE1BQUQsQ0FBUSxPQUFSLEVBQWlCO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBTjtLQUFqQixFQUFiO0VBQUEsQ0EvRmYsQ0FBQTs7QUFBQSxxQ0FrR0EsV0FBQSxHQUFhLFNBQUMsT0FBRCxFQUFVLGdCQUFWLEdBQUE7QUFDWixRQUFBLFFBQUE7O01BRHNCLG1CQUFtQixJQUFDLENBQUE7S0FDMUM7QUFBQSxJQUFBLFFBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBQSxJQUFFLENBQUEsS0FBTDtPQUREO0FBQUEsTUFFQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSw2QkFBSCxHQUErQixPQUFPLENBQUMsYUFBYSxDQUFDLENBQXJELEdBQTRELENBQS9EO09BSEQ7S0FERCxDQUFBO1dBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBUFk7RUFBQSxDQWxHYixDQUFBOztBQUFBLHFDQTJHQSxZQUFBLEdBQWMsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNiLFFBQUEsUUFBQTs7TUFEdUIsbUJBQW1CLElBQUMsQ0FBQTtLQUMzQztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxJQUFDLENBQUEsS0FBSjtPQUREO0FBQUEsTUFFQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSw2QkFBSCxHQUErQixPQUFPLENBQUMsYUFBYSxDQUFDLENBQXJELEdBQTRELENBQS9EO09BSEQ7S0FERCxDQUFBO1dBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBUGE7RUFBQSxDQTNHZCxDQUFBOztBQUFBLHFDQW9IQSxXQUFBLEdBQWEsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNaLFFBQUEsUUFBQTs7TUFEc0IsbUJBQW1CLElBQUMsQ0FBQTtLQUMxQztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFBLElBQUUsQ0FBQSxNQUFMO0FBQUEsUUFDQSxDQUFBLEVBQUcsQ0FESDtPQUREO0FBQUEsTUFHQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSw2QkFBSCxHQUErQixPQUFPLENBQUMsYUFBYSxDQUFDLENBQXJELEdBQTRELENBQS9EO09BSkQ7S0FERCxDQUFBO1dBT0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBUlk7RUFBQSxDQXBIYixDQUFBOztBQUFBLHFDQThIQSxTQUFBLEdBQVcsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNWLFFBQUEsUUFBQTs7TUFEb0IsbUJBQW1CLElBQUMsQ0FBQTtLQUN4QztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxJQUFDLENBQUEsTUFBSjtBQUFBLFFBQ0EsQ0FBQSxFQUFHLENBREg7T0FERDtBQUFBLE1BR0EsR0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sNkJBQUgsR0FBK0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFyRCxHQUE0RCxDQUEvRDtPQUpEO0tBREQsQ0FBQTtXQU9BLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLEVBQW1DLGdCQUFuQyxFQVJVO0VBQUEsQ0E5SFgsQ0FBQTs7QUFBQSxxQ0F3SUEsTUFBQSxHQUFRLFNBQUMsT0FBRCxFQUFVLGdCQUFWLEdBQUE7QUFDUCxRQUFBLFFBQUE7O01BRGlCLG1CQUFtQixJQUFDLENBQUE7S0FDckM7QUFBQSxJQUFBLFFBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLFFBQ0EsQ0FBQSxFQUFHLENBREg7QUFBQSxRQUVBLE9BQUEsRUFBUyxDQUZUO09BREQ7QUFBQSxNQUlBLEdBQUEsRUFDQztBQUFBLFFBQUEsT0FBQSxFQUFTLENBQVQ7T0FMRDtLQURELENBQUE7V0FRQSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixRQUF6QixFQUFtQyxnQkFBbkMsRUFUTztFQUFBLENBeElSLENBQUE7O0FBQUEscUNBbUpBLGFBQUEsR0FBZSxTQUFDLE9BQUQsRUFBVSxnQkFBVixHQUFBOztNQUFVLG1CQUFtQixJQUFDLENBQUE7S0FDNUM7V0FBQSxJQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBaUIsZ0JBQWpCLEVBRGM7RUFBQSxDQW5KZixDQUFBOztBQUFBLHFDQXNKQSxNQUFBLEdBQVEsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNQLFFBQUEsUUFBQTs7TUFEaUIsbUJBQW1CLElBQUMsQ0FBQTtLQUNyQztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsUUFDQSxDQUFBLEVBQUcsQ0FESDtBQUFBLFFBRUEsS0FBQSxFQUFPLEdBRlA7QUFBQSxRQUdBLE9BQUEsRUFBUyxDQUhUO09BREQ7QUFBQSxNQUtBLEdBQUEsRUFDQztBQUFBLFFBQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQURUO09BTkQ7S0FERCxDQUFBO1dBVUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBWE87RUFBQSxDQXRKUixDQUFBOztBQUFBLHFDQW1LQSxRQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNULFFBQUEsUUFBQTs7TUFEbUIsbUJBQW1CLElBQUMsQ0FBQTtLQUN2QztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsUUFDQSxDQUFBLEVBQUcsQ0FESDtBQUFBLFFBRUEsS0FBQSxFQUFPLEdBRlA7QUFBQSxRQUdBLE9BQUEsRUFBUyxDQUhUO09BREQ7QUFBQSxNQUtBLEdBQUEsRUFDQztBQUFBLFFBQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQURUO09BTkQ7S0FERCxDQUFBO1dBU0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBVlM7RUFBQSxDQW5LVixDQUFBOztBQUFBLHFDQStLQSxXQUFBLEdBQWEsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNaLFFBQUEsUUFBQTs7TUFEc0IsbUJBQW1CLElBQUMsQ0FBQTtLQUMxQztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxJQUFDLENBQUEsS0FBRCxHQUFPLENBQVY7QUFBQSxRQUNBLENBQUEsRUFBRyxHQURIO0FBQUEsUUFFQSxTQUFBLEVBQVcsR0FGWDtPQUREO0FBQUEsTUFJQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSw2QkFBSCxHQUErQixPQUFPLENBQUMsYUFBYSxDQUFDLENBQXJELEdBQTRELENBQS9EO0FBQUEsUUFDQSxTQUFBLEVBQVcsQ0FEWDtBQUFBLFFBRUEsQ0FBQSxFQUFHLENBRkg7T0FMRDtLQURELENBQUE7V0FTQSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixRQUF6QixFQUFtQyxnQkFBbkMsRUFWWTtFQUFBLENBL0tiLENBQUE7O0FBQUEscUNBMkxBLFVBQUEsR0FBWSxTQUFDLE9BQUQsRUFBVSxnQkFBVixHQUFBO0FBQ1gsUUFBQSxRQUFBOztNQURxQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3pDO0FBQUEsSUFBQSxRQUFBLEdBQ0M7QUFBQSxNQUFBLEtBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUEsSUFBRSxDQUFBLEtBQUYsR0FBUSxDQUFYO0FBQUEsUUFDQSxDQUFBLEVBQUcsR0FESDtBQUFBLFFBRUEsU0FBQSxFQUFXLENBQUEsR0FGWDtPQUREO0FBQUEsTUFJQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSw2QkFBSCxHQUErQixPQUFPLENBQUMsYUFBYSxDQUFDLENBQXJELEdBQTRELENBQS9EO0FBQUEsUUFDQSxTQUFBLEVBQVcsQ0FEWDtBQUFBLFFBRUEsQ0FBQSxFQUFHLENBRkg7T0FMRDtLQURELENBQUE7V0FTQSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixRQUF6QixFQUFtQyxnQkFBbkMsRUFWVztFQUFBLENBM0xaLENBQUE7O0FBQUEscUNBdU1BLFFBQUEsR0FBVSxTQUFDLE9BQUQsRUFBVSxnQkFBVixHQUFBO0FBQ1QsUUFBQSxRQUFBOztNQURtQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3ZDO0FBQUEsSUFBQSxRQUFBLEdBQ0M7QUFBQSxNQUFBLEtBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxHQURIO0FBQUEsUUFFQSxDQUFBLEVBQUcsSUFBQyxDQUFBLE1BRko7QUFBQSxRQUdBLFNBQUEsRUFBVyxDQUFBLEdBSFg7T0FERDtBQUFBLE1BS0EsR0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sNkJBQUgsR0FBK0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFyRCxHQUE0RCxDQUEvRDtBQUFBLFFBQ0EsU0FBQSxFQUFXLENBRFg7QUFBQSxRQUVBLENBQUEsRUFBRyxDQUZIO09BTkQ7S0FERCxDQUFBO1dBVUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBWFM7RUFBQSxDQXZNVixDQUFBOztBQUFBLHFDQW9OQSxNQUFBLEdBQVEsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNQLFFBQUEsUUFBQTs7TUFEaUIsbUJBQW1CLElBQUMsQ0FBQTtLQUNyQztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsUUFDQSxDQUFBLEVBQUcsQ0FESDtBQUFBLFFBRUEsUUFBQSxFQUFVLEdBRlY7QUFBQSxRQUdBLEtBQUEsRUFBTyxHQUhQO0FBQUEsUUFJQSxPQUFBLEVBQVMsQ0FKVDtPQUREO0FBQUEsTUFNQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLEtBQUEsRUFBTyxDQUFQO0FBQUEsUUFDQSxPQUFBLEVBQVMsQ0FEVDtBQUFBLFFBRUEsUUFBQSxFQUFVLENBRlY7T0FQRDtLQURELENBQUE7V0FXQSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixRQUF6QixFQUFtQyxnQkFBbkMsRUFaTztFQUFBLENBcE5SLENBQUE7O0FBQUEscUNBa09BLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNmLFFBQUEsa0JBQUE7O01BRHlCLG1CQUFtQixJQUFDLENBQUE7S0FDN0M7QUFBQSxJQUFBLFFBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLEdBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUEsQ0FBRSxJQUFDLENBQUEsS0FBRCxHQUFPLENBQVIsQ0FBSjtBQUFBLFFBQ0EsVUFBQSxFQUFZLEVBRFo7T0FGRDtLQURELENBQUE7QUFBQSxJQUtBLFFBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsSUFBQyxDQUFBLEtBQUo7T0FERDtBQUFBLE1BRUEsR0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sNkJBQUgsR0FBK0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFyRCxHQUE0RCxDQUEvRDtPQUhEO0tBTkQsQ0FBQTtXQVVBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLEVBQW1DLGdCQUFuQyxFQUFxRCxRQUFyRCxFQVhlO0VBQUEsQ0FsT2hCLENBQUE7O0FBQUEscUNBK09BLGFBQUEsR0FBZSxTQUFDLE9BQUQsRUFBVSxnQkFBVixHQUFBO0FBQ2QsUUFBQSxrQkFBQTs7TUFEd0IsbUJBQW1CLElBQUMsQ0FBQTtLQUM1QztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLE1BQ0EsR0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBQSxDQUFFLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBUixDQUFKO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQUZEO0tBREQsQ0FBQTtBQUFBLElBS0EsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFBLElBQUUsQ0FBQSxLQUFMO09BREQ7QUFBQSxNQUVBLEdBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFNLDZCQUFILEdBQStCLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBckQsR0FBNEQsQ0FBL0Q7T0FIRDtLQU5ELENBQUE7V0FVQSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixRQUF6QixFQUFtQyxnQkFBbkMsRUFBcUQsUUFBckQsRUFYYztFQUFBLENBL09mLENBQUE7O0FBQUEscUNBNFBBLFdBQUEsR0FBYSxTQUFDLE9BQUQsRUFBVSxnQkFBVixHQUFBO0FBQ1osUUFBQSxrQkFBQTs7TUFEc0IsbUJBQW1CLElBQUMsQ0FBQTtLQUMxQztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLE1BQ0EsR0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBQSxJQUFFLENBQUEsS0FBTDtPQUZEO0tBREQsQ0FBQTtBQUFBLElBSUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxJQUFDLENBQUEsS0FBSjtPQUREO0FBQUEsTUFFQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSw2QkFBSCxHQUErQixPQUFPLENBQUMsYUFBYSxDQUFDLENBQXJELEdBQTRELENBQS9EO09BSEQ7S0FMRCxDQUFBO1dBU0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBQXFELFFBQXJELEVBVlk7RUFBQSxDQTVQYixDQUFBOztBQUFBLHFDQXdRQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNYLFFBQUEsa0JBQUE7O01BRGtCLG1CQUFtQixJQUFDLENBQUE7S0FDdEM7QUFBQSxJQUFBLFFBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLEdBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLElBQUMsQ0FBQSxLQUFKO09BRkQ7S0FERCxDQUFBO0FBQUEsSUFJQSxRQUFBLEdBQ0M7QUFBQSxNQUFBLEtBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUEsSUFBRSxDQUFBLEtBQUw7T0FERDtBQUFBLE1BRUEsR0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sNkJBQUgsR0FBK0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFyRCxHQUE0RCxDQUEvRDtPQUhEO0tBTEQsQ0FBQTtXQVNBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLEVBQW1DLGdCQUFuQyxFQUFxRCxRQUFyRCxFQVZXO0VBQUEsQ0F4UVosQ0FBQTs7QUFBQSxxQ0FvUkEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLGdCQUFQLEdBQUE7QUFDVCxRQUFBLGtCQUFBOztNQURnQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3BDO0FBQUEsSUFBQSxRQUFBLEdBQ0M7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFBLElBQUUsQ0FBQSxNQUFMO09BRkQ7S0FERCxDQUFBO0FBQUEsSUFJQSxRQUFBLEdBQ0M7QUFBQSxNQUFBLEtBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxJQUFDLENBQUEsTUFESjtPQUREO0FBQUEsTUFHQSxHQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBTSwwQkFBSCxHQUE0QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQS9DLEdBQXNELENBQXpEO09BSkQ7S0FMRCxDQUFBO1dBVUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUMsZ0JBQW5DLEVBQXFELFFBQXJELEVBWFM7RUFBQSxDQXBSVixDQUFBOztBQUFBLHFDQWlTQSxVQUFBLEdBQVksU0FBQyxPQUFELEVBQVUsZ0JBQVYsR0FBQTtBQUNYLFFBQUEsa0JBQUE7O01BRHFCLG1CQUFtQixJQUFDLENBQUE7S0FDekM7QUFBQSxJQUFBLFFBQUEsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLEdBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLElBQUMsQ0FBQSxNQUFKO09BRkQ7S0FERCxDQUFBO0FBQUEsSUFJQSxRQUFBLEdBQ0M7QUFBQSxNQUFBLEtBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxDQUFBLElBQUUsQ0FBQSxNQURMO09BREQ7QUFBQSxNQUdBLEdBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFNLDZCQUFILEdBQStCLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBckQsR0FBNEQsQ0FBL0Q7T0FKRDtLQUxELENBQUE7V0FVQSxJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixRQUF6QixFQUFtQyxnQkFBbkMsRUFBcUQsUUFBckQsRUFYVztFQUFBLENBalNaLENBQUE7O0FBQUEscUNBOFNBLFNBQUEsR0FBVyxTQUFDLE9BQUQsRUFBVSxnQkFBVixHQUFBO0FBQ1YsUUFBQSxrQkFBQTs7TUFEb0IsbUJBQW1CLElBQUMsQ0FBQTtLQUN4QztBQUFBLElBQUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLE1BQ0EsR0FBQSxFQUNDO0FBQUEsUUFBQSxLQUFBLEVBQU8sR0FBUDtPQUZEO0tBREQsQ0FBQTtBQUFBLElBSUEsUUFBQSxHQUNDO0FBQUEsTUFBQSxLQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsUUFDQSxDQUFBLEVBQUcsSUFBQyxDQUFBLE1BREo7T0FERDtBQUFBLE1BR0EsR0FBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQU0sNkJBQUgsR0FBK0IsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFyRCxHQUE0RCxHQUEvRDtPQUpEO0tBTEQsQ0FBQTtXQVVBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFFBQXpCLEVBQW1DLGdCQUFuQyxFQUFxRCxRQUFyRCxFQVhVO0VBQUEsQ0E5U1gsQ0FBQTs7QUFBQSxxQ0E0VEEsVUFBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLFNBQVYsR0FBQTs7TUFBVSxZQUFZO0tBQ2pDO0FBQUEsWUFBTyxTQUFQO0FBQUEsV0FDTSxJQUROO2VBQ2dCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQURoQjtBQUFBLFdBRU0sT0FGTjtlQUVtQixJQUFDLENBQUEsV0FBRCxDQUFhLE9BQWIsRUFGbkI7QUFBQSxXQUdNLE1BSE47ZUFHa0IsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBSGxCO0FBQUEsV0FJTSxNQUpOO2VBSWtCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixFQUpsQjtBQUFBLEtBRFc7RUFBQSxDQTVUWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJyZ2JhKDE5MCwxOTAsMTkwLDAuOSlcIlxuXHRcdG9wdGlvbnMucGVyc3BlY3RpdmUgPz0gMTAwMFxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAb24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0aWYgY2hhbmdlTGlzdC5hZGRlZFswXS5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRcdEBzd2l0Y2hJbnN0YW50IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2hhbmdlTGlzdC5hZGRlZFswXS54ID0gQHdpZHRoXG5cblx0YWRkOiAodmlldywgcG9pbnQgPSB7eDowLCB5OjB9LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50ID0gZmFsc2UpIC0+XG5cdFx0aWYgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0QHN3aXRjaEluc3RhbnQgdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0dmlldy5vcmlnaW5hbFBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblxuXHRyZWFkeVRvQW5pbWF0ZTogKHZpZXcpIC0+XG5cdFx0aWYgdmlldyBpc250IEBjdXJyZW50XG5cdFx0XHRpZiBAc3ViTGF5ZXJzLmluZGV4T2YodmlldykgaXMgLTFcblx0XHRcdFx0QGFkZCB2aWV3XG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XG5cdHNhdmVDdXJyZW50VG9IaXN0b3J5OiAoYW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRhbmltYXRpb246IGFuaW1hdGlvblxuXG5cdGJhY2s6IC0+IFxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRhbmltUHJvcGVydGllcyA9IFxuXHRcdFx0XHRsYXllcjogcHJldmlvdXMudmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHg6IGlmIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0XHR5OiBpZiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0XHRicmlnaHRuZXNzOiAxMDBcblxuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbiBhbmltUHJvcGVydGllc1xuXHRcdFx0YW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zID0gcHJldmlvdXMuYW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXHRcblx0XHRcdGFuaW0gPSBwcmV2aW91cy5hbmltYXRpb25cblx0XHRcdGJhY2t3YXJkcyA9IGFuaW0ucmV2ZXJzZSgpXG5cdFx0XHRiYWNrd2FyZHMuc3RhcnQoKVxuXHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0XHRiYWNrd2FyZHMub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRhcHBseUFuaW1hdGlvbjogKG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZyA9IHt9KSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIG5ld1ZpZXdcblx0XHR1bmxlc3MgbmV3VmlldyBpcyBAY3VycmVudFxuXG5cdFx0XHQjIEFuaW1hdGUgdGhlIGN1cnJlbnQgdmlld1xuXHRcdFx0Xy5leHRlbmQgQGN1cnJlbnQsIG91dGdvaW5nLnN0YXJ0XG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbiA9IFxuXHRcdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIG91dGdvaW5nQW5pbWF0aW9uLnByb3BlcnRpZXMsIG91dGdvaW5nLmVuZFxuXHRcdFx0Xy5leHRlbmQgb3V0Z29pbmdBbmltYXRpb24sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24ob3V0Z29pbmdBbmltYXRpb24pXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHQjIEFuaW1hdGUgdGhlIG5ldyB2aWV3XG5cdFx0XHRfLmV4dGVuZCBuZXdWaWV3LCBpbmNvbWluZy5zdGFydFxuXHRcdFx0aW5jb21pbmdBbmltYXRpb24gPSBcblx0XHRcdFx0bGF5ZXI6IG5ld1ZpZXdcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIGluY29taW5nQW5pbWF0aW9uLnByb3BlcnRpZXMsIGluY29taW5nLmVuZFxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb24sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24oaW5jb21pbmdBbmltYXRpb24pXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgYW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudCA9IG5ld1ZpZXdcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblxuXHQjIyMgQU5JTUFUSU9OUyAjIyNcblxuXHRzd2l0Y2hJbnN0YW50OiAobmV3VmlldykgLT4gQGZhZGVJbiBuZXdWaWV3LCB0aW1lOiAwXG5cblxuXHRzbGlkZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblJpZ2h0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmYWRlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0eDogMFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGNyb3NzRGlzc29sdmU6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0QGZhZGVJbiBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRcblx0em9vbUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHpvb21lZEluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0c2NhbGU6IDEuNVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoLzJcblx0XHRcdFx0ejogODAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoLzJcblx0XHRcdFx0ejogODAwXG5cdFx0XHRcdHJvdGF0aW9uWTogLTEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0ejogODAwXG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0cm90YXRpb25YOiAtMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRcdFx0cm90YXRpb25YOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcblx0c3BpbkluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0cm90YXRpb246IDE4MFxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRyb3RhdGlvbjogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGlvc1B1c2hJblJpZ2h0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAtKEB3aWR0aC81KVxuXHRcdFx0XHRicmlnaHRuZXNzOiA5MFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRpb3NQdXNoSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiArKEB3aWR0aC81KVxuXHRcdFx0XHRicmlnaHRuZXNzOiA5MFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0cHVzaEluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0cHVzaEluTGVmdDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogaWYgbmV3Vmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIG5ld1ZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRwdXNoSW5VcDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0cHVzaEluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IGlmIG5ld1ZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0YXBwbGVNYWlsOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAxMDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0IyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXHR0cmFuc2l0aW9uOiAobmV3VmlldywgZGlyZWN0aW9uID0gJ3JpZ2h0JykgLT5cblx0XHRzd2l0Y2ggZGlyZWN0aW9uXG5cdFx0XHR3aGVuICd1cCcgdGhlbiBAcHVzaEluRG93biBuZXdWaWV3XG5cdFx0XHR3aGVuICdyaWdodCcgdGhlbiBAcHVzaEluUmlnaHQgbmV3Vmlld1xuXHRcdFx0d2hlbiAnZG93bicgdGhlbiBAcHVzaEluVXAgbmV3Vmlld1xuXHRcdFx0d2hlbiAnbGVmdCcgdGhlbiBAcHVzaEluTGVmdCBuZXdWaWV3Il19
