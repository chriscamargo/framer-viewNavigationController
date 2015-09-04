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

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNLQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxrQkFBbUI7S0FIM0I7O01BSUEsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFBcUMsSUFBQSxFQUFNLEVBQTNDOztLQUo1Qjs7TUFLQSxPQUFPLENBQUMsa0JBQW1CO0tBTDNCOztNQU1BLE9BQU8sQ0FBQyxjQUFlO0tBTnZCO0FBQUEsSUFRQSwwREFBTSxPQUFOLENBUkEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFELEdBQUE7QUFDdkIsTUFBQSxJQUFHLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBcEIsS0FBNEIsT0FBTyxDQUFDLGVBQXZDO2VBQ0MsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFVLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBaEMsRUFERDtP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MEJBQUgsR0FBNEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUEvQyxHQUFzRCxHQUF6RDtPQUREO0tBWkQsQ0FBQTtXQWNBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLGNBQXRCLEVBQXNDLGdCQUF0QyxFQWZVO0VBQUEsQ0EzT1gsQ0FBQTs7a0NBQUE7O0dBRjhDLE1BQS9DLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBUT0RPOlxuIyBBZGQgY3VzdG9tIGFuaW1hdGlvbk9wdGlvbnMgdG8gLmJhY2soKT9cbiMgQWRkIFwibW92ZU91dFwiIGFuaW1hdGlvbnM/IHdoYXQncyB0aGUgdXNlIGNhc2U/IGNvdmVyZWQgYnkgYmFjaz9cbiMgSWYgbm8gbmVlZCBmb3IgbW92ZU91dCwgbWF5YmUgd2Ugd29udCBuZWVkIGNvbnNpc3RlbnQgXCJJblwiIG5hbWluZyBzY2hlbWVcblxuY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmluaXRpYWxWaWV3TmFtZSA/PSAnaW5pdGlhbFZpZXcnXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcImJlemllci1jdXJ2ZSguMiwgMSwgLjIsIDEpXCIsIHRpbWU6IC42XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJyZ2JhKDE5MCwxOTAsMTkwLDAuOSlcIlxuXHRcdG9wdGlvbnMucGVyc3BlY3RpdmUgPz0gMTAwMFxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAb24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0aWYgY2hhbmdlTGlzdC5hZGRlZFswXS5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRcdEBzd2l0Y2hJbnN0YW50IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2hhbmdlTGlzdC5hZGRlZFswXS54ID0gQHdpZHRoXG5cblx0YWRkOiAodmlldywgcG9pbnQgPSB7eDowLCB5OjB9LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50ID0gZmFsc2UpIC0+XG5cdFx0aWYgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0QHN3aXRjaEluc3RhbnQgdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0dmlldy5vcmlnaW5hbFBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblxuXHRyZWFkeVRvQW5pbWF0ZTogKHZpZXcpIC0+XG5cdFx0aWYgdmlldyBpc250IEBjdXJyZW50XG5cdFx0XHRpZiBAc3ViTGF5ZXJzLmluZGV4T2YodmlldykgaXMgLTFcblx0XHRcdFx0QGFkZCB2aWV3XG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XG5cdHNhdmVDdXJyZW50VG9IaXN0b3J5OiAoYW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRhbmltYXRpb246IGFuaW1hdGlvblxuXG5cdGJhY2s6IC0+IFxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRhbmltUHJvcGVydGllcyA9IFxuXHRcdFx0XHRsYXllcjogcHJldmlvdXMudmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHg6IGlmIHByZXZpb3VzLnZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRcdFx0XHR5OiBpZiBwcmV2aW91cy52aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gcHJldmlvdXMudmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAwXG5cdFx0XHRcdFx0c2NhbGU6IDFcblxuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbiBhbmltUHJvcGVydGllc1xuXHRcdFx0YW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zID0gcHJldmlvdXMuYW5pbWF0aW9uLm9wdGlvbnMuY3VydmVPcHRpb25zXG5cdFx0XHRhbmltYXRpb24uc3RhcnQoKVxuXHRcblx0XHRcdGFuaW0gPSBwcmV2aW91cy5hbmltYXRpb25cblx0XHRcdGJhY2t3YXJkcyA9IGFuaW0ucmV2ZXJzZSgpXG5cdFx0XHRiYWNrd2FyZHMuc3RhcnQoKVxuXHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0XHRiYWNrd2FyZHMub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRhcHBseUFuaW1hdGlvbjogKHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHVubGVzcyB2aWV3IGlzIEBjdXJyZW50XG5cdFx0XHRvYmogPSBsYXllcjogdmlld1xuXHRcdFx0Xy5leHRlbmQgb2JqLCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbiBvYmpcblx0XHRcdGFuaW1hdGlvbi5zdGFydCgpXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgYW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudCA9IHZpZXdcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblxuXHQjIyMgQU5JTUFUSU9OUyAjIyNcblxuXHRzd2l0Y2hJbnN0YW50OiAodmlldykgLT4gQGZhZGVJbiB2aWV3LCB0aW1lOiAwXG5cblx0c2xpZGVJbkRvd246ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueSA9IC1AaGVpZ2h0XG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eTogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5VcDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnkgPSBAaGVpZ2h0XG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eTogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC55IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnggPSBAd2lkdGhcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy54ID0gLUB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueCBlbHNlIDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmYWRlSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdHZpZXcueCA9IDBcblx0XHR2aWV3LnkgPSAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGNyb3NzRGlzc29sdmU6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0QGZhZGVJbiB2aWV3LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRcblx0em9vbUluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcuc2NhbGUgPSAwLjhcblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHpvb21lZEluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcuc2NhbGUgPSAxLjVcblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJblJpZ2h0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcueCA9IEB3aWR0aC8yXG5cdFx0dmlldy5yb3RhdGlvblkgPSAxMDBcblx0XHR2aWV3LnogPSA4MDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluTGVmdDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cblx0XHR2aWV3LnggPSAtQHdpZHRoLzJcblx0XHR2aWV3LnJvdGF0aW9uWSA9IC0xMDBcblx0XHR2aWV3LnogPSA4MDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluVXA6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0cmV0dXJuIHVubGVzcyBAcmVhZHlUb0FuaW1hdGUgdmlld1xuXG5cdFx0dmlldy55ID0gQGhlaWdodFxuXHRcdHZpZXcucm90YXRpb25YID0gLTEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IGlmIHZpZXcub3JpZ2luYWxQb2ludD8gdGhlbiB2aWV3Lm9yaWdpbmFsUG9pbnQueSBlbHNlIDBcblx0XHRcdFx0cm90YXRpb25YOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcblx0c3BpbkluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHR2aWV3LnNjYWxlID0gMC44XG5cdFx0dmlldy5yb3RhdGlvbiA9IDE4MFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0cm90YXRpb246IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXG5cdHB1c2hJblJpZ2h0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHJldHVybiB1bmxlc3MgQHJlYWR5VG9BbmltYXRlIHZpZXdcblx0XHRtb3ZlID1cblx0XHRcdGxheWVyOiBAY3VycmVudFxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdF8uZXh0ZW5kIG1vdmUsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRtb3ZlT3V0ID0gbmV3IEFuaW1hdGlvbiBtb3ZlXG5cdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHR2aWV3LnggPSBAd2lkdGhcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnggZWxzZSAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluTGVmdDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdF8uZXh0ZW5kIG1vdmUsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRtb3ZlT3V0ID0gbmV3IEFuaW1hdGlvbiBtb3ZlXG5cdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHR2aWV3LnggPSAtQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogaWYgdmlldy5vcmlnaW5hbFBvaW50PyB0aGVuIHZpZXcub3JpZ2luYWxQb2ludC54IGVsc2UgMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGFwcGxlTWFpbDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRyZXR1cm4gdW5sZXNzIEByZWFkeVRvQW5pbWF0ZSB2aWV3XG5cdFx0bW92ZSA9XG5cdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRfLmV4dGVuZCBtb3ZlLCBhbmltYXRpb25PcHRpb25zXG5cdFx0bW92ZU91dCA9IG5ldyBBbmltYXRpb24gbW92ZVxuXHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0dmlldy55ID0gQGhlaWdodFxuXHRcdHZpZXcueCA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiBpZiB2aWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gdmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSAxMDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMiXX0=
