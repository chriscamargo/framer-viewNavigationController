require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Layers":[function(require,module,exports){
module.exports = {
  all: function() {
    return Framer.CurrentContext.getLayers();
  },
  withName: function(name) {
    var i, layer, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.all();
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.name === name) {
        matchingLayers.push(layer);
      }
    }
    return matchingLayers.reverse();
  },
  containing: function(name) {
    var i, layer, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.all();
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.name.indexOf(name) !== -1) {
        matchingLayers.push(layer);
      }
    }
    return matchingLayers.reverse();
  },
  startingWith: function(name) {
    var i, layer, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.all();
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.name.substring(0, name.length) === name) {
        matchingLayers.push(layer);
      }
    }
    return matchingLayers.reverse();
  },
  endingWith: function(name) {
    var i, layer, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.all();
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (layer.name.match(name + "$")) {
        matchingLayers.push(layer);
      }
    }
    return matchingLayers.reverse();
  },
  withState: function(state) {
    var i, layer, layerStates, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.all();
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      layerStates = layer.states._orderedStates;
      if (layerStates.indexOf(state) !== -1) {
        matchingLayers.push(layer);
      }
    }
    return matchingLayers.reverse();
  },
  withCurrentState: function(state) {
    var currentState, i, layer, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.all();
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      currentState = layer.states.current;
      if (currentState.indexOf(state) !== -1) {
        matchingLayers.push(layer);
      }
    }
    return matchingLayers.reverse();
  },
  withSuperLayer: function(name) {
    var i, layer, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.withName(name);
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      matchingLayers = matchingLayers.concat(layer.subLayers);
    }
    return matchingLayers.reverse();
  },
  withSubLayer: function(name) {
    var i, layer, len, matchingLayers, ref;
    matchingLayers = [];
    ref = this.withName(name);
    for (i = 0, len = ref.length; i < len; i++) {
      layer = ref[i];
      if (matchingLayers.indexOf(layer.superLayer) === -1) {
        matchingLayers.push(layer.superLayer);
      }
    }
    return matchingLayers.reverse();
  },
  where: function(obj) {
    return _.where(Framer.CurrentContext.getLayers(), obj);
  },
  get: function(name) {
    return this.withName(name)[0];
  }
};

Layer.prototype.prefixSwitch = function(newPrefix, delimiter) {
  var name, newName;
  if (delimiter == null) {
    delimiter = '_';
  }
  name = this.name;
  newName = newPrefix + name.slice(name.indexOf(delimiter));
  return module.exports.get(newName);
};

Layer.prototype.findSubLayer = function(needle, recursive) {
  var i, j, len, len1, ref, ref1, subLayer;
  if (recursive == null) {
    recursive = true;
  }
  ref = this.subLayers;
  for (i = 0, len = ref.length; i < len; i++) {
    subLayer = ref[i];
    if (subLayer.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
      return subLayer;
    }
  }
  if (recursive) {
    ref1 = this.subLayers;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      subLayer = ref1[j];
      if (subLayer.findSubLayer(needle, recursive)) {
        return subLayer.findSubLayer(needle, recursive);
      }
    }
  }
};

Layer.prototype.findSuperLayer = function(needle, recursive) {
  if (recursive == null) {
    recursive = true;
  }
  if (this.superLayer.name.toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
    return this.superLayer;
  }
  if (recursive) {
    if (this.superLayer.findSuperLayer(needle, recursive)) {
      return this.superLayer.findSuperLayer(needle, recursive);
    }
  }
};



},{}],"ViewNavigationController":[function(require,module,exports){
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
    view.superLayer = this;
    view.x = this.width;
    view.y = 0;
    return this.current = view;
  };

  ViewNavigationController.prototype.saveCurrentToHistory = function(animation) {
    return this.history.unshift({
      view: this.current,
      animation: animation
    });
  };

  ViewNavigationController.prototype.back = function() {
    var anim, backwards, previous;
    if (this.history[0] != null) {
      this.history[0].view.x = 0;
      this.history[0].view.y = 0;
      anim = this.history[0].animation;
      backwards = anim.reverse();
      backwards.start();
      previous = this.history[0];
      this.current = previous.view;
      return this.history.shift();
    }
  };

  ViewNavigationController.prototype.applyAnimation = function(view, animProperties, animationOptions) {
    var anim;
    if (view !== this.current) {
      _.extend(animProperties, animationOptions);
      anim = view.animate(animProperties);
      this.saveCurrentToHistory(anim);
      anim.on(Events.AnimationEnd, (function(_this) {
        return function() {
          var previous;
          previous = _this.history[0].view;
          return previous.x = _this.width;
        };
      })(this));
      this.current = view;
      return this.current.bringToFront();
    }
  };

  ViewNavigationController.prototype.subLayersIgnoreEvents = function(view, boolean) {
    var i, len, ref, results, subLayer;
    print(view);
    view.ignoreEvents = boolean;
    ref = view.subLayers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subLayer = ref[i];
      results.push(this.subLayersIgnoreEvents(subLayer, boolean));
    }
    return results;
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
    view.point = {
      x: 0,
      y: -this.height
    };
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
    view.point = {
      x: 0,
      y: this.height
    };
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
    view.point = {
      x: this.width,
      y: 0
    };
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
    view.point = {
      x: -this.width,
      y: 0
    };
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
    view.point = {
      x: 0,
      y: 0
    };
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
    view.point = {
      x: 0,
      y: 0
    };
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
    view.point = {
      x: 0,
      y: 0
    };
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
    view.point = {
      x: this.width / 2,
      y: 0
    };
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
    view.point = {
      x: -this.width / 2,
      y: 0
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL0xheWVycy5jb2ZmZWUiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLEVBQ2hCLEdBQUEsRUFBSyxTQUFBLEdBQUE7V0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQXRCLENBQUEsRUFBSDtFQUFBLENBRFc7QUFBQSxFQUVoQixRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFDVCxRQUFBLGtDQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFDQTtBQUFBLFNBQUEscUNBQUE7cUJBQUE7QUFDRSxNQUFBLElBQThCLEtBQUssQ0FBQyxJQUFOLEtBQWMsSUFBNUM7QUFBQSxRQUFBLGNBQWMsQ0FBQyxJQUFmLENBQW9CLEtBQXBCLENBQUEsQ0FBQTtPQURGO0FBQUEsS0FEQTtBQUdDLFdBQU8sY0FBYyxDQUFDLE9BQWYsQ0FBQSxDQUFQLENBSlE7RUFBQSxDQUZNO0FBQUEsRUFPaEIsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1gsUUFBQSxrQ0FBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixFQUFqQixDQUFBO0FBQ0E7QUFBQSxTQUFBLHFDQUFBO3FCQUFBO0FBQ0UsTUFBQSxJ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SUFBSSxDQUFDLENBQUwsR0FBUyxHQUZULENBQUE7QUFBQSxJQUdBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLFFBQ0EsU0FBQSxFQUFXLENBRFg7QUFBQSxRQUVBLENBQUEsRUFBRyxDQUZIO09BREQ7S0FKRCxDQUFBO1dBUUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBVFk7RUFBQSxDQW5IYixDQUFBOztBQUFBLHFDQThIQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNYLFFBQUEsY0FBQTs7TUFEa0IsbUJBQW1CO0FBQUEsUUFBQSxLQUFBLEVBQU8sZ0JBQVA7O0tBQ3JDO0FBQUEsSUFBQSxJQUFJLENBQUMsS0FBTCxHQUFhO0FBQUEsTUFBQSxDQUFBLEVBQUcsQ0FBQSxJQUFFLENBQUEsS0FBRixHQUFRLENBQVg7QUFBQSxNQUFjLENBQUEsRUFBRyxDQUFqQjtLQUFiLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLENBQUEsR0FEakIsQ0FBQTtBQUFBLElBRUEsSUFBSSxDQUFDLENBQUwsR0FBUyxHQUZULENBQUE7QUFBQSxJQUdBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLFFBQ0EsU0FBQSxFQUFXLENBRFg7QUFBQSxRQUVBLENBQUEsRUFBRyxDQUZIO09BREQ7S0FKRCxDQUFBO1dBUUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBVFc7RUFBQSxDQTlIWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0YWxsOiAtPiBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblx0d2l0aE5hbWU6IChuYW1lKSAtPlxuXHRcdG1hdGNoaW5nTGF5ZXJzID0gW11cblx0XHRmb3IgbGF5ZXIgaW4gQGFsbCgpXG4gXHRcdFx0bWF0Y2hpbmdMYXllcnMucHVzaChsYXllcikgaWYgbGF5ZXIubmFtZSBpcyBuYW1lXG4gXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKCkgIyB0byBtYXRjaCBsYXllcmxpc3Qgb3JkZXJcblx0Y29udGFpbmluZzogKG5hbWUpIC0+XG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcbiBcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllci5uYW1lLmluZGV4T2YobmFtZSkgaXNudCAtMVxuIFx0XHRyZXR1cm4gbWF0Y2hpbmdMYXllcnMucmV2ZXJzZSgpICMgdG8gbWF0Y2ggbGF5ZXJsaXN0IG9yZGVyXG5cdHN0YXJ0aW5nV2l0aDogKG5hbWUpIC0+XG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcbiBcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllci5uYW1lLnN1YnN0cmluZygwLG5hbWUubGVuZ3RoKSBpcyBuYW1lXG4gXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKCkgIyB0byBtYXRjaCBsYXllcmxpc3Qgb3JkZXJcblx0ZW5kaW5nV2l0aDogKG5hbWUpIC0+XG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcbiBcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllci5uYW1lLm1hdGNoKFwiI3tuYW1lfSRcIilcbiBcdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKSAjIHRvIG1hdGNoIGxheWVybGlzdCBvcmRlclxuXHR3aXRoU3RhdGU6IChzdGF0ZSkgLT4gXG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcblx0XHRcdGxheWVyU3RhdGVzID0gbGF5ZXIuc3RhdGVzLl9vcmRlcmVkU3RhdGVzXG5cdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllclN0YXRlcy5pbmRleE9mKHN0YXRlKSBpc250IC0xXG5cdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKVxuXHR3aXRoQ3VycmVudFN0YXRlOiAoc3RhdGUpIC0+IFxuXHRcdG1hdGNoaW5nTGF5ZXJzID0gW11cblx0XHRmb3IgbGF5ZXIgaW4gQGFsbCgpXG5cdFx0XHRjdXJyZW50U3RhdGUgPSBsYXllci5zdGF0ZXMuY3VycmVudFxuXHRcdFx0bWF0Y2hpbmdMYXllcnMucHVzaChsYXllcikgaWYgY3VycmVudFN0YXRlLmluZGV4T2Yoc3RhdGUpIGlzbnQgLTFcblx0XHRyZXR1cm4gbWF0Y2hpbmdMYXllcnMucmV2ZXJzZSgpXG5cdHdpdGhTdXBlckxheWVyOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEB3aXRoTmFtZShuYW1lKVxuXHRcdFx0bWF0Y2hpbmdMYXllcnMgPSBtYXRjaGluZ0xheWVycy5jb25jYXQobGF5ZXIuc3ViTGF5ZXJzKVxuXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKClcblx0d2l0aFN1YkxheWVyOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEB3aXRoTmFtZShuYW1lKVxuXHRcdFx0aWYgbWF0Y2hpbmdMYXllcnMuaW5kZXhPZihsYXllci5zdXBlckxheWVyKSBpcyAtMVxuXHRcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyLnN1cGVyTGF5ZXIpIFxuXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKClcblx0d2hlcmU6IChvYmopIC0+XG5cdFx0Xy53aGVyZSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKCksIG9ialxuXHRnZXQ6IChuYW1lKSAtPlxuXHRcdEB3aXRoTmFtZShuYW1lKVswXVxufVxuXG5MYXllcjo6cHJlZml4U3dpdGNoID0gKG5ld1ByZWZpeCwgZGVsaW1pdGVyID0gJ18nKSAtPlxuXHRuYW1lID0gdGhpcy5uYW1lXG5cdG5ld05hbWUgPSBuZXdQcmVmaXggKyBuYW1lLnNsaWNlIG5hbWUuaW5kZXhPZiBkZWxpbWl0ZXJcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzLmdldCBuZXdOYW1lXG5cbiMgQnkgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3Nob3J0Y3V0cy1mb3ItZnJhbWVyXG5MYXllcjo6ZmluZFN1YkxheWVyID0gKG5lZWRsZSwgcmVjdXJzaXZlID0gdHJ1ZSkgLT5cbiAgIyBTZWFyY2ggZGlyZWN0IGNoaWxkcmVuXG4gIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG4gICAgcmV0dXJuIHN1YkxheWVyIGlmIHN1YkxheWVyLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZS50b0xvd2VyQ2FzZSgpKSBpc250IC0xIFxuICAjIFJlY3Vyc2l2ZWx5IHNlYXJjaCBjaGlsZHJlbiBvZiBjaGlsZHJlblxuICBpZiByZWN1cnNpdmVcbiAgICBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuICAgICAgcmV0dXJuIHN1YkxheWVyLmZpbmRTdWJMYXllcihuZWVkbGUsIHJlY3Vyc2l2ZSkgaWYgc3ViTGF5ZXIuZmluZFN1YkxheWVyKG5lZWRsZSwgcmVjdXJzaXZlKVxuICAgICAgXG5MYXllcjo6ZmluZFN1cGVyTGF5ZXIgPSAobmVlZGxlLCByZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAjIFNlYXJjaCBkaXJlY3QgY2hpbGRyZW5cbiAgcmV0dXJuIEBzdXBlckxheWVyIGlmIEBzdXBlckxheWVyLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZS50b0xvd2VyQ2FzZSgpKSBpc250IC0xIFxuICAjIFJlY3Vyc2l2ZWx5IHNlYXJjaCBjaGlsZHJlbiBvZiBjaGlsZHJlblxuICBpZiByZWN1cnNpdmVcbiAgXHRyZXR1cm4gQHN1cGVyTGF5ZXIuZmluZFN1cGVyTGF5ZXIobmVlZGxlLCByZWN1cnNpdmUpIGlmIEBzdXBlckxheWVyLmZpbmRTdXBlckxheWVyKG5lZWRsZSwgcmVjdXJzaXZlKSIsIiMgVE9ETzpcbiMgSWdub3JlIGFsbCBldmVudHMgbm90IHBhcnQgb2YgY2hpbGRyZW4gdG8gQGN1cnJlbnQgKGF2b2lkIGNsaWNrIHRocm91Z2gpXG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuIyB0ZXN0IHVzZSBjYXNlIHdpdGggaW9zIG5hdGl2ZSBwdXNoIG1lc3NhZ2VzXG4jIGFkZCBwYWdlcyB3aGVuIHRyeWluZyB0byBhbmltYXRlIHRoZW0uIGVnLiBpZiBAc3ViTGF5ZXJzLmluZGV4T2YodmlldykgaXMgLTEgdGhlbiBAYWRkIHZpZXdcblxuY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIlxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwicmdiYSgxOTAsMTkwLDE5MCwwLjkpXCJcblx0XHRvcHRpb25zLnBlcnNwZWN0aXZlID89IDEwMDBcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0XHRcdFxuXHRhZGQ6ICh2aWV3LCBwb2ludCA9IHt4OjAsIHk6MH0pIC0+XG5cdFx0I3ZpZXcuaWdub3JlRXZlbnRzID0gdHJ1ZVxuXHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3LnggPSBAd2lkdGhcblx0XHR2aWV3LnkgPSAwXG5cdFx0I3ZpZXcucG9pbnQgPSBwb2ludFxuXHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFxuXHRzYXZlQ3VycmVudFRvSGlzdG9yeTogKGFuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0YW5pbWF0aW9uOiBhbmltYXRpb25cblxuXHRiYWNrOiAtPiBcblx0XHRpZiBAaGlzdG9yeVswXT9cblx0XHRcdEBoaXN0b3J5WzBdLnZpZXcueCA9IDBcblx0XHRcdEBoaXN0b3J5WzBdLnZpZXcueSA9IDBcblx0XHRcdGFuaW0gPSBAaGlzdG9yeVswXS5hbmltYXRpb25cblx0XHRcdGJhY2t3YXJkcyA9IGFuaW0ucmV2ZXJzZSgpXG5cdFx0XHRiYWNrd2FyZHMuc3RhcnQoKVxuXHRcdFx0I2JhY2t3YXJkcy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0cHJldmlvdXMgPSBAaGlzdG9yeVswXVxuXHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cblx0YXBwbHlBbmltYXRpb246ICh2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHR1bmxlc3MgdmlldyBpcyBAY3VycmVudFxuXHRcdFx0Xy5leHRlbmQgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW0gPSB2aWV3LmFuaW1hdGUgYW5pbVByb3BlcnRpZXNcblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBhbmltXG5cdFx0XHRhbmltLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+IFxuXHRcdFx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdLnZpZXdcblx0XHRcdFx0I0BzdWJMYXllcnNJZ25vcmVFdmVudHMgcHJldmlvdXMsIHRydWVcblx0XHRcdFx0cHJldmlvdXMueCA9IEB3aWR0aFxuXHRcdFx0QGN1cnJlbnQgPSB2aWV3XG5cdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cdHN1YkxheWVyc0lnbm9yZUV2ZW50czogKHZpZXcsIGJvb2xlYW4pIC0+XG5cdFx0cHJpbnQgdmlld1xuXHRcdHZpZXcuaWdub3JlRXZlbnRzID0gYm9vbGVhblxuXHRcdGZvciBzdWJMYXllciBpbiB2aWV3LnN1YkxheWVyc1xuXHRcdFx0QHN1YkxheWVyc0lnbm9yZUV2ZW50cyBzdWJMYXllciwgYm9vbGVhblxuXHRcdFx0XG5cblx0IyMjIEFOSU1BVElPTlMgIyMjXG5cblx0c3dpdGNoSW5zdGFudDogKHZpZXcpIC0+IEBmYWRlSW4gdmlldywgdGltZTogMFxuXG5cdHNsaWRlSW5VcDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwKVwiKSAtPiBcblx0XHR2aWV3LnBvaW50ID0geDogMCwgeTogLUBoZWlnaHRcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkRvd246ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIikgLT4gXG5cdFx0dmlldy5wb2ludCA9IHg6IDAsIHk6IEBoZWlnaHRcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR5OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJblJpZ2h0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCIpIC0+IFxuXHRcdHZpZXcucG9pbnQgPSB4OiBAd2lkdGgsIHk6IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIikgLT4gXG5cdFx0dmlldy5wb2ludCA9IHg6IC1Ad2lkdGgsIHk6IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IHRpbWU6IC4yKSAtPiBcblx0XHR2aWV3LnBvaW50ID0geDogMCwgeTogMFxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRcblx0em9vbUluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCIpIC0+IFxuXHRcdHZpZXcucG9pbnQgPSB4OiAwLCB5OiAwXG5cdFx0dmlldy5zY2FsZSA9IDAuOFxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0em9vbWVkSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIikgLT4gXG5cdFx0dmlldy5wb2ludCA9IHg6IDAsIHk6IDBcblx0XHR2aWV3LnNjYWxlID0gMS41XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBjdXJ2ZTogXCJzcHJpbmcoMzAwLDQwKVwiKSAtPiBcblx0XHR2aWV3LnBvaW50ID0geDogQHdpZHRoLzIsIHk6IDBcblx0XHR2aWV3LnJvdGF0aW9uWSA9IDEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZygzMDAsNDApXCIpIC0+IFxuXHRcdHZpZXcucG9pbnQgPSB4OiAtQHdpZHRoLzIsIHk6IDBcblx0XHR2aWV3LnJvdGF0aW9uWSA9IC0xMDBcblx0XHR2aWV3LnogPSA4MDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zIl19
