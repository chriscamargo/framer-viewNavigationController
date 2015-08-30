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
    view.on(Events.Click, function() {});
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
    var anim, backwards, previous;
    if (this.history[0] != null) {
      anim = this.history[0].animation;
      backwards = anim.reverse();
      backwards.start();
      previous = this.history[0];
      this.current = previous.view;
      backwards.on(Events.AnimationEnd, (function(_this) {
        return function() {
          return _this.current.bringToFront();
        };
      })(this));
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
        return function() {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL0xheWVycy5jb2ZmZWUiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLEVBQ2hCLEdBQUEsRUFBSyxTQUFBLEdBQUE7V0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQXRCLENBQUEsRUFBSDtFQUFBLENBRFc7QUFBQSxFQUVoQixRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFDVCxRQUFBLGtDQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFDQTtBQUFBLFNBQUEscUNBQUE7cUJBQUE7QUFDRSxNQUFBLElBQThCLEtBQUssQ0FBQyxJQUFOLEtBQWMsSUFBNUM7QUFBQSxRQUFBLGNBQWMsQ0FBQyxJQUFmLENBQW9CLEtBQXBCLENBQUEsQ0FBQTtPQURGO0FBQUEsS0FEQTtBQUdDLFdBQU8sY0FBYyxDQUFDLE9BQWYsQ0FBQSxDQUFQLENBSlE7RUFBQSxDQUZNO0FBQUEsRUFPaEIsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1gsUUFBQSxrQ0FBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixFQUFqQixDQUFBO0FBQ0E7QUFBQSxTQUFBLHFDQUFBO3FCQUFBO0FBQ0UsTUFBQSxJ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LElBR0EsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsUUFDQSxTQUFBLEVBQVcsQ0FEWDtBQUFBLFFBRUEsQ0FBQSxFQUFHLENBRkg7T0FERDtLQUpELENBQUE7V0FRQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFUVztFQUFBLENBaklaLENBQUE7O2tDQUFBOztHQUY4QyxNQUEvQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRhbGw6IC0+IEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKVxuXHR3aXRoTmFtZTogKG5hbWUpIC0+XG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcbiBcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllci5uYW1lIGlzIG5hbWVcbiBcdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKSAjIHRvIG1hdGNoIGxheWVybGlzdCBvcmRlclxuXHRjb250YWluaW5nOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEBhbGwoKVxuIFx0XHRcdG1hdGNoaW5nTGF5ZXJzLnB1c2gobGF5ZXIpIGlmIGxheWVyLm5hbWUuaW5kZXhPZihuYW1lKSBpc250IC0xXG4gXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKCkgIyB0byBtYXRjaCBsYXllcmxpc3Qgb3JkZXJcblx0c3RhcnRpbmdXaXRoOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEBhbGwoKVxuIFx0XHRcdG1hdGNoaW5nTGF5ZXJzLnB1c2gobGF5ZXIpIGlmIGxheWVyLm5hbWUuc3Vic3RyaW5nKDAsbmFtZS5sZW5ndGgpIGlzIG5hbWVcbiBcdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKSAjIHRvIG1hdGNoIGxheWVybGlzdCBvcmRlclxuXHRlbmRpbmdXaXRoOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEBhbGwoKVxuIFx0XHRcdG1hdGNoaW5nTGF5ZXJzLnB1c2gobGF5ZXIpIGlmIGxheWVyLm5hbWUubWF0Y2goXCIje25hbWV9JFwiKVxuIFx0XHRyZXR1cm4gbWF0Y2hpbmdMYXllcnMucmV2ZXJzZSgpICMgdG8gbWF0Y2ggbGF5ZXJsaXN0IG9yZGVyXG5cdHdpdGhTdGF0ZTogKHN0YXRlKSAtPiBcblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEBhbGwoKVxuXHRcdFx0bGF5ZXJTdGF0ZXMgPSBsYXllci5zdGF0ZXMuX29yZGVyZWRTdGF0ZXNcblx0XHRcdG1hdGNoaW5nTGF5ZXJzLnB1c2gobGF5ZXIpIGlmIGxheWVyU3RhdGVzLmluZGV4T2Yoc3RhdGUpIGlzbnQgLTFcblx0XHRyZXR1cm4gbWF0Y2hpbmdMYXllcnMucmV2ZXJzZSgpXG5cdHdpdGhDdXJyZW50U3RhdGU6IChzdGF0ZSkgLT4gXG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcblx0XHRcdGN1cnJlbnRTdGF0ZSA9IGxheWVyLnN0YXRlcy5jdXJyZW50XG5cdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBjdXJyZW50U3RhdGUuaW5kZXhPZihzdGF0ZSkgaXNudCAtMVxuXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKClcblx0d2l0aFN1cGVyTGF5ZXI6IChuYW1lKSAtPlxuXHRcdG1hdGNoaW5nTGF5ZXJzID0gW11cblx0XHRmb3IgbGF5ZXIgaW4gQHdpdGhOYW1lKG5hbWUpXG5cdFx0XHRtYXRjaGluZ0xheWVycyA9IG1hdGNoaW5nTGF5ZXJzLmNvbmNhdChsYXllci5zdWJMYXllcnMpXG5cdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKVxuXHR3aXRoU3ViTGF5ZXI6IChuYW1lKSAtPlxuXHRcdG1hdGNoaW5nTGF5ZXJzID0gW11cblx0XHRmb3IgbGF5ZXIgaW4gQHdpdGhOYW1lKG5hbWUpXG5cdFx0XHRpZiBtYXRjaGluZ0xheWVycy5pbmRleE9mKGxheWVyLnN1cGVyTGF5ZXIpIGlzIC0xXG5cdFx0XHRcdG1hdGNoaW5nTGF5ZXJzLnB1c2gobGF5ZXIuc3VwZXJMYXllcikgXG5cdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKVxuXHR3aGVyZTogKG9iaikgLT5cblx0XHRfLndoZXJlIEZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKSwgb2JqXG5cdGdldDogKG5hbWUpIC0+XG5cdFx0QHdpdGhOYW1lKG5hbWUpWzBdXG59XG5cbkxheWVyOjpwcmVmaXhTd2l0Y2ggPSAobmV3UHJlZml4LCBkZWxpbWl0ZXIgPSAnXycpIC0+XG5cdG5hbWUgPSB0aGlzLm5hbWVcblx0bmV3TmFtZSA9IG5ld1ByZWZpeCArIG5hbWUuc2xpY2UgbmFtZS5pbmRleE9mIGRlbGltaXRlclxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHMuZ2V0IG5ld05hbWVcblxuIyBCeSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svc2hvcnRjdXRzLWZvci1mcmFtZXJcbkxheWVyOjpmaW5kU3ViTGF5ZXIgPSAobmVlZGxlLCByZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAjIFNlYXJjaCBkaXJlY3QgY2hpbGRyZW5cbiAgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcbiAgICByZXR1cm4gc3ViTGF5ZXIgaWYgc3ViTGF5ZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTEgXG4gICMgUmVjdXJzaXZlbHkgc2VhcmNoIGNoaWxkcmVuIG9mIGNoaWxkcmVuXG4gIGlmIHJlY3Vyc2l2ZVxuICAgIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG4gICAgICByZXR1cm4gc3ViTGF5ZXIuZmluZFN1YkxheWVyKG5lZWRsZSwgcmVjdXJzaXZlKSBpZiBzdWJMYXllci5maW5kU3ViTGF5ZXIobmVlZGxlLCByZWN1cnNpdmUpXG4gICAgICBcbkxheWVyOjpmaW5kU3VwZXJMYXllciA9IChuZWVkbGUsIHJlY3Vyc2l2ZSA9IHRydWUpIC0+XG4gICMgU2VhcmNoIGRpcmVjdCBjaGlsZHJlblxuICByZXR1cm4gQHN1cGVyTGF5ZXIgaWYgQHN1cGVyTGF5ZXIubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTEgXG4gICMgUmVjdXJzaXZlbHkgc2VhcmNoIGNoaWxkcmVuIG9mIGNoaWxkcmVuXG4gIGlmIHJlY3Vyc2l2ZVxuICBcdHJldHVybiBAc3VwZXJMYXllci5maW5kU3VwZXJMYXllcihuZWVkbGUsIHJlY3Vyc2l2ZSkgaWYgQHN1cGVyTGF5ZXIuZmluZFN1cGVyTGF5ZXIobmVlZGxlLCByZWN1cnNpdmUpIiwiIyBUT0RPOlxuIyBJZ25vcmUgYWxsIGV2ZW50cyBub3QgcGFydCBvZiBjaGlsZHJlbiB0byBAY3VycmVudCAoYXZvaWQgY2xpY2sgdGhyb3VnaClcbiMgQWRkIGN1c3RvbSBhbmltYXRpb25PcHRpb25zIHRvIC5iYWNrKCk/XG4jIEFkZCBcIm1vdmVPdXRcIiBhbmltYXRpb25zPyB3aGF0J3MgdGhlIHVzZSBjYXNlPyBjb3ZlcmVkIGJ5IGJhY2s/XG4jIElmIG5vIG5lZWQgZm9yIG1vdmVPdXQsIG1heWJlIHdlIHdvbnQgbmVlZCBjb25zaXN0ZW50IFwiSW5cIiBuYW1pbmcgc2NoZW1lXG4jIHRlc3QgdXNlIGNhc2Ugd2l0aCBpb3MgbmF0aXZlIHB1c2ggbWVzc2FnZXNcbiMgYWRkIHBhZ2VzIHdoZW4gdHJ5aW5nIHRvIGFuaW1hdGUgdGhlbS4gZWcuIGlmIEBzdWJMYXllcnMuaW5kZXhPZih2aWV3KSBpcyAtMSB0aGVuIEBhZGQgdmlld1xuXG5jbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyA/PSBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwKVwiXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJyZ2JhKDE5MCwxOTAsMTkwLDAuOSlcIlxuXHRcdG9wdGlvbnMucGVyc3BlY3RpdmUgPz0gMTAwMFxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRcdFx0XG5cdGFkZDogKHZpZXcsIHBvaW50ID0ge3g6MCwgeTowfSkgLT5cblx0XHQjdmlldy5pZ25vcmVFdmVudHMgPSB0cnVlXG5cdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdCN2aWV3LnggPSBAd2lkdGhcblx0XHQjdmlldy55ID0gMFxuXHRcdHZpZXcub24gRXZlbnRzLkNsaWNrLCAtPiByZXR1cm4gIyBwcmV2ZW50IGNsaWNrLXRocm91Z2gvYnViYmxpbmdcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblx0XHRAY3VycmVudCA9IHZpZXdcblx0XHRcblx0c2F2ZUN1cnJlbnRUb0hpc3Rvcnk6IChhbmltYXRpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRcblx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uXG5cblx0YmFjazogLT4gXG5cdFx0aWYgQGhpc3RvcnlbMF0/XG5cdFx0XHQjQGhpc3RvcnlbMF0udmlldy54ID0gMFxuXHRcdFx0I0BoaXN0b3J5WzBdLnZpZXcueSA9IDBcblx0XHRcdGFuaW0gPSBAaGlzdG9yeVswXS5hbmltYXRpb25cblx0XHRcdGJhY2t3YXJkcyA9IGFuaW0ucmV2ZXJzZSgpXG5cdFx0XHRiYWNrd2FyZHMuc3RhcnQoKVxuXHRcdFx0cHJldmlvdXMgPSBAaGlzdG9yeVswXVxuXHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRiYWNrd2FyZHMub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblxuXHRhcHBseUFuaW1hdGlvbjogKHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdHVubGVzcyB2aWV3IGlzIEBjdXJyZW50XG5cdFx0XHRfLmV4dGVuZCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0YW5pbSA9IHZpZXcuYW5pbWF0ZSBhbmltUHJvcGVydGllc1xuXHRcdFx0QHNhdmVDdXJyZW50VG9IaXN0b3J5IGFuaW1cblx0XHRcdGFuaW0ub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gXG5cdFx0XHRcdCNwcmV2aW91cyA9IEBoaXN0b3J5WzBdLnZpZXdcblx0XHRcdFx0I0BzdWJMYXllcnNJZ25vcmVFdmVudHMgcHJldmlvdXMsIHRydWVcblx0XHRcdFx0I3ByZXZpb3VzLnggPSBAd2lkdGhcblx0XHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFx0XG5cdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXG5cdHN1YkxheWVyc0lnbm9yZUV2ZW50czogKHZpZXcsIGJvb2xlYW4pIC0+XG5cdFx0cHJpbnQgdmlld1xuXHRcdHZpZXcuaWdub3JlRXZlbnRzID0gYm9vbGVhblxuXHRcdGZvciBzdWJMYXllciBpbiB2aWV3LnN1YkxheWVyc1xuXHRcdFx0QHN1YkxheWVyc0lnbm9yZUV2ZW50cyBzdWJMYXllciwgYm9vbGVhblxuXHRcdFx0XG5cblx0IyMjIEFOSU1BVElPTlMgIyMjXG5cblx0c3dpdGNoSW5zdGFudDogKHZpZXcpIC0+IEBmYWRlSW4gdmlldywgdGltZTogMFxuXG5cdHNsaWRlSW5VcDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwKVwiKSAtPiBcblx0XHR2aWV3LnkgPSAtQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluRG93bjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwKVwiKSAtPiBcblx0XHR2aWV3LnkgPSBAaGVpZ2h0XG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eTogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBjdXJ2ZTogXCJzcHJpbmcoNDAwLDQwKVwiKSAtPiBcblx0XHR2aWV3LnggPSBAd2lkdGhcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0c2xpZGVJbkxlZnQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIikgLT4gXG5cdFx0dmlldy54ID0gLUB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmYWRlSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gdGltZTogLjIpIC0+IFxuXHRcdCN2aWV3LnBvaW50ID0geDogMCwgeTogMFxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRcblx0em9vbUluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCIpIC0+IFxuXHRcdCN2aWV3LnBvaW50ID0geDogMCwgeTogMFxuXHRcdHZpZXcuc2NhbGUgPSAwLjhcblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHpvb21lZEluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCIpIC0+IFxuXHRcdHZpZXcucG9pbnQgPSB4OiAwLCB5OiAwXG5cdFx0dmlldy5zY2FsZSA9IDEuNVxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDMwMCw0MClcIikgLT4gXG5cdFx0dmlldy54ID0gQHdpZHRoLzJcblx0XHR2aWV3LnJvdGF0aW9uWSA9IDEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IGN1cnZlOiBcInNwcmluZygzMDAsNDApXCIpIC0+IFxuXHRcdHZpZXcueCA9IC1Ad2lkdGgvMlxuXHRcdHZpZXcucm90YXRpb25ZID0gLTEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMiXX0=
