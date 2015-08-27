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
    if (options.perspective == null) {
      options.perspective = 1000;
    }
    ViewNavigationController.__super__.constructor.call(this, options);
    this.history = [];
  }

  ViewNavigationController.prototype.add = function(view, point) {
    if (point == null) {
      point = {
        x: 0,
        y: 0
      };
    }
    view.ignoreEvents = true;
    view.superLayer = this;
    view.point = point;
    return this.current = view;
  };

  ViewNavigationController.prototype.saveCurrentToHistory = function(animation) {
    return this.history.unshift({
      view: this.current,
      animation: animation
    });
  };

  ViewNavigationController.prototype.back = function() {
    var anim, backwards;
    if (this.history[0] != null) {
      anim = this.history[0].animation;
      backwards = anim.reverse();
      backwards.start();
      return backwards.on(Events.AnimationEnd, (function(_this) {
        return function() {
          var previous;
          previous = _this.history[0];
          _this.current = previous.view;
          return _this.history.shift();
        };
      })(this));
    }
  };

  ViewNavigationController.prototype.applyAnimation = function(view, animProperties, animationOptions) {
    var anim;
    if (view !== this.current) {
      _.extend(animProperties, animationOptions);
      anim = view.animate(animProperties);
      this.saveCurrentToHistory(anim);
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

  ViewNavigationController.prototype.slideInUp = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = {
        curve: "spring(400,40)"
      };
    }
    view.y = -this.height;
    animProperties = {
      properties: {
        y: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInDown = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = {
        curve: "spring(400,40)"
      };
    }
    view.y = this.height;
    animProperties = {
      properties: {
        y: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInRight = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = {
        curve: "spring(400,40)"
      };
    }
    view.x = this.width;
    animProperties = {
      properties: {
        x: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.slideInLeft = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = {
        curve: "spring(400,40)"
      };
    }
    view.x = -this.width;
    animProperties = {
      properties: {
        x: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.fadeIn = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = {
        time: .2
      };
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
      animationOptions = {
        curve: "spring(400,40)"
      };
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
      animationOptions = {
        curve: "spring(400,40)"
      };
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
      animationOptions = {
        curve: "spring(300,40)"
      };
    }
    view.x = this.width / 2;
    view.rotationY = 100;
    view.z = 800;
    animProperties = {
      properties: {
        x: 0,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  ViewNavigationController.prototype.flipInLeft = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = {
        curve: "spring(300,40)"
      };
    }
    view.x = -this.width / 2;
    view.rotationY = -100;
    view.z = 800;
    animProperties = {
      properties: {
        x: 0,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNPQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxtQkFBb0I7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDs7S0FINUI7O01BSUEsT0FBTyxDQUFDLGtCQUFtQjtLQUozQjs7TUFLQSxPQUFPLENBQUMsY0FBZTtLQUx2QjtBQUFBLElBT0EsMERBQU0sT0FBTixDQVBBLENBQUE7QUFBQSxJQVFBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFSWCxDQURZO0VBQUEsQ0FBYjs7QUFBQSxxQ0FXQSxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBOztNQUFPLFFBQVE7QUFBQSxRQUFDLENBQUEsRUFBRSxDQUFIO0FBQUEsUUFBTSxDQUFBLEVBQUUsQ0FBUjs7S0FDbkI7QUFBQSxJQUFBLElBQUksQ0FBQyxZQUFMLEdBQW9CLElBQXBCLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxVQUFMLEdBQWtCLElBRGxCLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxLQUFMLEdBQWEsS0FGYixDQUFBO1dBR0Es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LGNBQXRCLEVBQXNDLGdCQUF0QyxFQVRXO0VBQUEsQ0E1R1osQ0FBQTs7a0NBQUE7O0dBRjhDLE1BQS9DLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBUT0RPOlxuIyBJZ25vcmUgYWxsIGV2ZW50cyBub3QgcGFydCBvZiBjaGlsZHJlbiB0byBAY3VycmVudCAoYXZvaWQgY2xpY2sgdGhyb3VnaClcbiMgQWRkIGN1c3RvbSBhbmltYXRpb25PcHRpb25zIHRvIC5iYWNrKCk/XG4jIEFkZCBcIm1vdmVPdXRcIiBhbmltYXRpb25zPyB3aGF0J3MgdGhlIHVzZSBjYXNlPyBjb3ZlcmVkIGJ5IGJhY2s/XG4jIElmIG5vIG5lZWQgZm9yIG1vdmVPdXQsIG1heWJlIHdlIHdvbnQgbmVlZCBjb25zaXN0ZW50IFwiSW5cIiBuYW1pbmcgc2NoZW1lXG4jIHRlc3QgdXNlIGNhc2Ugd2l0aCBpb3MgbmF0aXZlIHB1c2ggbWVzc2FnZXNcblxuY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIlxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwicmdiYSgxOTAsMTkwLDE5MCwwLjkpXCJcblx0XHRvcHRpb25zLnBlcnNwZWN0aXZlID89IDEwMDBcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0XHRcdFxuXHRhZGQ6ICh2aWV3LCBwb2ludCA9IHt4OjAsIHk6MH0pIC0+XG5cdFx0dmlldy5pZ25vcmVFdmVudHMgPSB0cnVlXG5cdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdHZpZXcucG9pbnQgPSBwb2ludFxuXHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFxuXHRzYXZlQ3VycmVudFRvSGlzdG9yeTogKGFuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0YW5pbWF0aW9uOiBhbmltYXRpb25cblxuXHRiYWNrOiAtPiBcblx0XHRpZiBAaGlzdG9yeVswXT9cblx0XHRcdGFuaW0gPSBAaGlzdG9yeVswXS5hbmltYXRpb25cblx0XHRcdGJhY2t3YXJkcyA9IGFuaW0ucmV2ZXJzZSgpXG5cdFx0XHRiYWNrd2FyZHMuc3RhcnQoKVxuXHRcdFx0YmFja3dhcmRzLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0XHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblxuXHRhcHBseUFuaW1hdGlvbjogKHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHVubGVzcyB2aWV3IGlzIEBjdXJyZW50XG5cdFx0XHRfLmV4dGVuZCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbSA9IHZpZXcuYW5pbWF0ZSBhbmltUHJvcGVydGllc1xuXHRcdFx0QHNhdmVDdXJyZW50VG9IaXN0b3J5IGFuaW1cblx0XHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHQjIyMgQU5JTUFUSU9OUyAjIyNcblxuXHRzd2l0Y2hJbnN0YW50OiAodmlldykgLT4gQGZhZGVJbiB2aWV3LCB0aW1lOiAwXG5cblx0c2xpZGVJblVwOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCIpIC0+IFxuXHRcdHZpZXcueSA9IC1AaGVpZ2h0XG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eTogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5Eb3duOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCIpIC0+IFxuXHRcdHZpZXcueSA9IEBoZWlnaHRcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblJpZ2h0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCIpIC0+IFxuXHRcdHZpZXcueCA9IEB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluTGVmdDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwKVwiKSAtPiBcblx0XHR2aWV3LnggPSAtQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSB0aW1lOiAuMikgLT4gXG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdFxuXHR6b29tSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIikgLT4gXG5cdFx0dmlldy5zY2FsZSA9IDAuOFxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0em9vbWVkSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIikgLT4gXG5cdFx0dmlldy5zY2FsZSA9IDEuNVxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDMwMCw0MClcIikgLT4gXG5cdFx0dmlldy54ID0gQHdpZHRoLzJcblx0XHR2aWV3LnJvdGF0aW9uWSA9IDEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZygzMDAsNDApXCIpIC0+IFxuXHRcdHZpZXcueCA9IC1Ad2lkdGgvMlxuXHRcdHZpZXcucm90YXRpb25ZID0gLTEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMiXX0=
