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
      animationOptions = this.animationOptions;
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
      animationOptions = this.animationOptions;
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
      animationOptions = this.animationOptions;
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
      animationOptions = this.animationOptions;
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
      animationOptions = this.animationOptions;
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
      animationOptions = this.animationOptions;
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
      animationOptions = this.animationOptions;
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
      animationOptions = this.animationOptions;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL0xheWVycy5jb2ZmZWUiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLEVBQ2hCLEdBQUEsRUFBSyxTQUFBLEdBQUE7V0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQXRCLENBQUEsRUFBSDtFQUFBLENBRFc7QUFBQSxFQUVoQixRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFDVCxRQUFBLGtDQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFDQTtBQUFBLFNBQUEscUNBQUE7cUJBQUE7QUFDRSxNQUFBLElBQThCLEtBQUssQ0FBQyxJQUFOLEtBQWMsSUFBNUM7QUFBQSxRQUFBLGNBQWMsQ0FBQyxJQUFmLENBQW9CLEtBQXBCLENBQUEsQ0FBQTtPQURGO0FBQUEsS0FEQTtBQUdDLFdBQU8sY0FBYyxDQUFDLE9BQWYsQ0FBQSxDQUFQLENBSlE7RUFBQSxDQUZNO0FBQUEsRUFPaEIsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1gsUUFBQSxrQ0FBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixFQUFqQixDQUFBO0FBQ0E7QUFBQSxTQUFBLHFDQUFBO3FCQUFBO0FBQ0UsTUFBQSxJQUE4QixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsQ0FBQSxLQUE4QixDQUFBLENBQTVEO0FBQUEsUUFBQSxjQUFjLENBQUMsSUFBZixDQUFvQixLQUFwQixDQUFBLENBQUE7T0FERjtBQUFBLEtBREE7QUFHQyxXQUFPLGNBQWMsQ0FBQyxPQUFmLENBQUEsQ0FBUCxDQUpVO0VBQUEsQ0FQSTtBQUFBLEVBWWhCLFlBQUEsRUFBYyxTQUFDLElBQUQsR0FBQTtBQUNiLFFBQUEsa0NBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsRUFBakIsQ0FBQTtBQUNBO0FBQUEsU0FBQSxxQ0FBQTtxQkFBQTtBQUNFLE1BQUEsSUFBOEIsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFYLENBQXFCLENBQXJCLEVBQXVCLElBQUksQ0FBQyxNQUE1QixDQUFBLEtBQXVDLElBQXJFO0FBQUEsUUFBQSxjQUFjLENBQUMsSUFBZixDQUFvQixLQUFwQixDQUFBLENBQUE7T0FERjtBQUFBLEtBREE7QUFHQyxXQUFPLGNBQWMsQ0FBQyxPQUFmLENBQUEsQ0FBUCxDQUpZO0VBQUEsQ0FaRTtBQUFBLEVBaUJoQixVQUFBLEVBQVksU0FBQyxJQUFELEdBQUE7QUFDWCxRQUFBLGtDQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFDQTtBQUFBLFNBQUEscUNBQUE7cUJBQUE7QUFDRSxNQUFBLElBQThCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBWCxDQUFvQixJQUFELEdBQU0sR0FBekIsQ0FBOUI7QUFBQSxRQUFBLGNBQWMsQ0FBQyxJQUFmLENBQW9CLEtBQXBCLENBQUEsQ0FBQTtPQURGO0FBQUEsS0FEQTtBQUdDLFdBQU8sY0FBYyxDQUFDLE9BQWYsQ0FBQSxDQUFQLENBSlU7RUFBQSxDQWpCSTtBQUFBLEVBc0JoQixTQUFBLEVBQVcsU0FBQyxLQUFELEdBQUE7QUFDVixRQUFBLCtDQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFDQTtBQUFBLFNBQUEscUNBQUE7cUJBQUE7QUFDQyxNQUFBLFdBQUEsR0FBYyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQTNCLENBQUE7QUFDQSxNQUFBLElBQThCLFdBQVcsQ0FBQyxPQUFaLENBQW9CLEtBQXBCLENBQUEsS0FBZ0MsQ0FBQSxDQUE5RDtBQUFBLFFBQUEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsS0FBcEIsQ0FBQSxDQUFBO09BRkQ7QUFBQSxLQURBO0FBSUEsV0FBTyxjQUFjLENBQUMsT0FBZixDQUFBLENBQVAsQ0FMVTtFQUFBLENBdEJLO0FBQUEsRUE0QmhCLGdCQUFBLEVBQWtCLFNBQUMsS0FBRCxHQUFBO0FBQ2pCLFFBQUEsZ0RBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsRUFBakIsQ0FBQTtBQUNBO0FBQUEsU0FBQSxxQ0FBQTtxQkFBQTtBQUNDLE1BQUEsWUFBQSxHQUFlLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBNUIsQ0FBQTtBQUNBLE1BQUEsSUFBOEIsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsS0FBckIsQ0FBQSxLQUFpQyxDQUFBLENBQS9EO0FBQUEsUUFBQSxjQUFjLENBQUMsSUFBZixDQUFvQixLQUFwQixDQUFBLENBQUE7T0FGRDtBQUFBLEtBREE7QUFJQSxXQUFPLGNBQWMsQ0FBQyxPQUFmLENBQUEsQ0FBUCxDQUxpQjtFQUFBLENBNUJGO0FBQUEsRUFrQ2hCLGNBQUEsRUFBZ0IsU0FBQyxJQUFELEdBQUE7QUFDZixRQUFBLGtDQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFDQTtBQUFBLFNBQUEscUNBQUE7cUJBQUE7QUFDQyxNQUFBLGNBQUEsR0FBaUIsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsS0FBSyxDQUFDLFNBQTVCLENBQWpCLENBREQ7QUFBQSxLQURBO0FBR0EsV0FBTyxjQUFjLENBQUMsT0FBZixDQUFBLENBQVAsQ0FKZTtFQUFBLENBbENBO0FBQUEsRUF1Q2hCLFlBQUEsRUFBYyxTQUFDLElBQUQsR0FBQTtBQUNiLFFBQUEsa0NBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsRUFBakIsQ0FBQTtBQUNBO0FBQUEsU0FBQSxxQ0FBQTtxQkFBQTtBQUNDLE1BQUEsSUFBRyxjQUFjLENBQUMsT0FBZixDQUF1QixLQUFLLENBQUMsVUFBN0IsQ0FBQSxLQUE0QyxDQUFBLENBQS9DO0FBQ0MsUUFBQSxjQUFjLENBQUMsSUFBZixDQUFvQixLQUFLLENBQUMsVUFBMUIsQ0FBQSxDQUREO09BREQ7QUFBQSxLQURBO0FBSUEsV0FBTyxjQUFjLENBQUMsT0FBZixDQUFBLENBQVAsQ0FMYTtFQUFBLENBdkNFO0FBQUEsRUE2Q2hCLEtBQUEsRUFBTyxTQUFDLEdBQUQsR0FBQTtXQUNOLENBQUMsQ0FBQyxLQUFGLENBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUF0QixDQUFBLENBQVIsRUFBMkMsR0FBM0MsRUFETTtFQUFBLENBN0NTO0FBQUEsRUErQ2hCLEdBQUEsRUFBSyxTQUFDLElBQUQsR0FBQTtXQUNKLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixDQUFnQixDQUFBLENBQUEsRUFEWjtFQUFBLENBL0NXO0NBQWpCLENBQUE7O0FBQUEsS0FtREssQ0FBQSxTQUFFLENBQUEsWUFBUCxHQUFzQixTQUFDLFNBQUQsRUFBWSxTQUFaLEdBQUE7QUFDckIsTUFBQSxhQUFBOztJQURpQyxZQUFZO0dBQzdDO0FBQUEsRUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQVosQ0FBQTtBQUFBLEVBQ0EsT0FBQSxHQUFVLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixDQUFYLENBRHRCLENBQUE7QUFFQSxTQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBZixDQUFtQixPQUFuQixDQUFQLENBSHFCO0FBQUEsQ0FuRHRCLENBQUE7O0FBQUEsS0F5REssQ0FBQSxTQUFFLENBQUEsWUFBUCxHQUFzQixTQUFDLE1BQUQsRUFBUyxTQUFULEdBQUE7QUFFcEIsTUFBQSxvQ0FBQTs7SUFGNkIsWUFBWTtHQUV6QztBQUFBO0FBQUEsT0FBQSxxQ0FBQTtzQkFBQTtBQUNFLElBQUEsSUFBbUIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFkLENBQUEsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxNQUFNLENBQUMsV0FBUCxDQUFBLENBQXBDLENBQUEsS0FBK0QsQ0FBQSxDQUFsRjtBQUFBLGFBQU8sUUFBUCxDQUFBO0tBREY7QUFBQSxHQUFBO0FBR0EsRUFBQSxJQUFHLFNBQUg7QUFDRTtBQUFBLFNBQUEsd0NBQUE7eUJBQUE7QUFDRSxNQUFBLElBQW1ELFFBQVEsQ0FBQyxZQUFULENBQXNCLE1BQXRCLEVBQThCLFNBQTlCLENBQW5EO0FBQUEsZUFBTyxRQUFRLENBQUMsWUFBVCxDQUFzQixNQUF0QixFQUE4QixTQUE5QixDQUFQLENBQUE7T0FERjtBQUFBLEtBREY7R0FMb0I7QUFBQSxDQXpEdEIsQ0FBQTs7QUFBQSxLQWtFSyxDQUFBLFNBQUUsQ0FBQSxjQUFQLEdBQXdCLFNBQUMsTUFBRCxFQUFTLFNBQVQsR0FBQTs7SUFBUyxZQUFZO0dBRTNDO0FBQUEsRUFBQSxJQUFzQixJQUFDLENBQUEsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFqQixDQUFBLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUF2QyxDQUFBLEtBQWtFLENBQUEsQ0FBeEY7QUFBQSxXQUFPLElBQUMsQ0FBQSxVQUFSLENBQUE7R0FBQTtBQUVBLEVBQUEsSUFBRyxTQUFIO0FBQ0MsSUFBQSxJQUF3RCxJQUFDLENBQUEsVUFBVSxDQUFDLGNBQVosQ0FBMkIsTUFBM0IsRUFBbUMsU0FBbkMsQ0FBeEQ7QUFBQSxhQUFPLElBQUMsQ0FBQSxVQUFVLENBQUMsY0FBWixDQUEyQixNQUEzQixFQUFtQyxTQUFuQyxDQUFQLENBQUE7S0FERDtHQUpzQjtBQUFBLENBbEV4QixDQUFBOzs7OztBQ1FBLElBQUE7NkJBQUE7O0FBQUEsT0FBYSxDQUFDO0FBRWIsOENBQUEsQ0FBQTs7QUFBYSxFQUFBLGtDQUFDLE9BQUQsR0FBQTs7TUFBQyxVQUFRO0tBQ3JCOztNQUFBLE9BQU8sQ0FBQyxRQUFTLE1BQU0sQ0FBQztLQUF4Qjs7TUFDQSxPQUFPLENBQUMsU0FBVSxNQUFNLENBQUM7S0FEekI7O01BRUEsT0FBTyxDQUFDLE9BQVE7S0FGaEI7O01BR0EsT0FBTyxDQUFDLG1CQUFvQjtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFBcUMsSUFBQSxFQUFNLEVBQTNDOztLQUg1Qjs7TUFJQSxPQUFPLENBQUMsa0JBQW1CO0tBSjNCOztNQUtBLE9BQU8sQ0FBQyxjQUFlO0tBTHZCO0FBQUEsSUFPQSwwREFBTSxPQUFOLENBUEEsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVJYLENBRFk7RUFBQSxDQUFiOztBQUFBLHFDQVdBLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7O01BQU8sUUFBUTtBQUFBLFFBQUMsQ0FBQSxFQUFFLENBQUg7QUFBQSxRQUFNLENBQUEsRUFBRSxDQUFSOztLQUVuQjtBQUFBLElBQUEsSUFBSSxDQUFDLFVBQUwsR0FBa0IsSUFBbEIsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLEVBQUwsQ0FBUSxNQUFNLENBQUMsS0FBZixFQUFzQixTQUFBLEdBQUEsQ0FBdEIsQ0FIQSxDQUFBO0FBQUEsSUFJQSxJQUFJLENBQUMsS0FBTCxHQUFhLEtBSmIsQ0FBQTtXQUtBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FQUDtFQUFBLENBWEwsQ0FBQTs7QUFBQSxxQ0FvQkEsb0JBQUEsR0FBc0IsU0FBQyxTQUFELEdBQUE7V0FDckIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQ0M7QUFBQSxNQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBUDtBQUFBLE1BQ0EsU0FBQSxFQUFXLFNBRFg7S0FERCxFQURxQjtFQUFBLENBcEJ0QixDQUFBOztBQUFBLHFDQXlCQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0wsUUFBQSx5QkFBQTtBQUFBLElBQUEsSUFBRyx1QkFBSDtBQUdDLE1BQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBbkIsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FEWixDQUFBO0FBQUEsTUFFQSxTQUFTLENBQUMsS0FBVixDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUhwQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxJQUpwQixDQUFBO0FBQUEsTUFLQSxTQUFTLENBQUMsRUFBVixDQUFhLE1BQU0sQ0FBQyxZQUFwQixFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNqQyxLQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBQSxFQURpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBTEEsQ0FBQTthQU9BLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFBLEVBVkQ7S0FESztFQUFBLENBekJOLENBQUE7O0FBQUEscUNBc0NBLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sY0FBUCxFQUF1QixnQkFBdkIsR0FBQTtBQUNmLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBTyxJQUFBLEtBQVEsSUFBQyxDQUFBLE9BQWhCO0FBQ0MsTUFBQSxDQUFDLENBQUMsTUFBRixDQUFTLGNBQVQsRUFBeUIsZ0JBQXpCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsY0FBYixDQURQLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixJQUF0QixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxFQUFMLENBQVEsTUFBTSxDQUFDLFlBQWYsRUFBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixDQUhBLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFQWCxDQUFBO2FBU0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQUEsRUFWRDtLQURlO0VBQUEsQ0F0Q2hCLENBQUE7O0FBQUEscUNBbURBLHFCQUFBLEdBQXVCLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtBQUN0QixRQUFBLDhCQUFBO0FBQUEsSUFBQSxLQUFBLENBQU0sSUFBTixDQUFBLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxZQUFMLEdBQW9CLE9BRHBCLENBQUE7QUFFQTtBQUFBO1NBQUEscUNBQUE7d0JBQUE7QUFDQyxtQkFBQSxJQUFDLENBQUEscUJBQUQsQ0FBdUIsUUFBdkIsRUFBaUMsT0FBakMsRUFBQSxDQUREO0FBQUE7bUJBSHNCO0VBQUEsQ0FuRHZCLENBQUE7O0FBMERBO0FBQUEsa0JBMURBOztBQUFBLHFDQTREQSxhQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7V0FBVSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQVIsRUFBYztBQUFBLE1BQUEsSUFBQSxFQUFNLENBQU47S0FBZCxFQUFWO0VBQUEsQ0E1RGYsQ0FBQTs7QUFBQSxxQ0E4REEsU0FBQSxHQUFXLFNBQUMsSUFBRCxFQUFPLGdCQUFQLEdBQUE7QUFDVixRQUFBLGNBQUE7O01BRGlCLG1CQUFtQixJQUFDLENBQUE7S0FDckM7QUFBQSxJQUFBLElBQUksQ0FBQyxDQUFMLEdBQVMsQ0FBQSxJQUFFLENBQUEsTUFBWCxDQUFBO0FBQUEsSUFDQSxjQUFBLEdBQ0M7QUFBQSxNQUFBLFVBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7T0FERDtLQUZELENBQUE7V0FJQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFMVTtFQUFBLENBOURYLENBQUE7O0FBQUEscUNBcUVBLFdBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxnQkFBUCxHQUFBO0FBQ1osUUFBQSxjQUFBOztNQURtQixtQkFBbUIsSUFBQyxDQUFBO0tBQ3ZDO0FBQUEsSUFBQSxJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUMsQ0FBQSxNQUFWLENBQUE7QUFBQSxJQUNBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtPQUREO0tBRkQsQ0FBQTtXQUlBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLGNBQXRCLEVBQXNDLGdCQUF0QyxFQUxZO0VBQUEsQ0FyRWIsQ0FBQTs7QUFBQSxxQ0E0RUEsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLGdCQUFQLEdBQUE7QUFDYixRQUFBLGNBQUE7O01BRG9CLG1CQUFtQixJQUFDLENBQUE7S0FDeEM7QUFBQSxJQUFBLElBQUksQ0FBQyxDQUFMLEdBQVMsSUFBQyxDQUFBLEtBQVYsQ0FBQTtBQUFBLElBQ0EsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO09BREQ7S0FGRCxDQUFBO1dBSUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBTGE7RUFBQSxDQTVFZCxDQUFBOztBQUFBLHFDQW1GQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNaLFFBQUEsY0FBQTs7TUFEbUIsbUJBQW1CLElBQUMsQ0FBQTtLQUN2QztBQUFBLElBQUEsSUFBSSxDQUFDLENBQUwsR0FBUyxDQUFBLElBQUUsQ0FBQSxLQUFYLENBQUE7QUFBQSxJQUNBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtPQUREO0tBRkQsQ0FBQTtXQUlBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLGNBQXRCLEVBQXNDLGdCQUF0QyxFQUxZO0VBQUEsQ0FuRmIsQ0FBQTs7QUFBQSxxQ0EwRkEsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLGdCQUFQLEdBQUE7QUFFUCxRQUFBLGNBQUE7O01BRmMsbUJBQW1CLElBQUMsQ0FBQTtLQUVsQztBQUFBLElBQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxDQUFmLENBQUE7QUFBQSxJQUNBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxPQUFBLEVBQVMsQ0FBVDtPQUREO0tBRkQsQ0FBQTtXQUlBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLGNBQXRCLEVBQXNDLGdCQUF0QyxFQU5PO0VBQUEsQ0ExRlIsQ0FBQTs7QUFBQSxxQ0FrR0EsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLGdCQUFQLEdBQUE7QUFFUCxRQUFBLGNBQUE7O01BRmMsbUJBQW1CLElBQUMsQ0FBQTtLQUVsQztBQUFBLElBQUEsSUFBSSxDQUFDLEtBQUwsR0FBYSxHQUFiLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxPQUFMLEdBQWUsQ0FEZixDQUFBO0FBQUEsSUFFQSxjQUFBLEdBQ0M7QUFBQSxNQUFBLFVBQUEsRUFDQztBQUFBLFFBQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQURUO09BREQ7S0FIRCxDQUFBO1dBTUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBUk87RUFBQSxDQWxHUixDQUFBOztBQUFBLHFDQTRHQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNULFFBQUEsY0FBQTs7TUFEZ0IsbUJBQW1CLElBQUMsQ0FBQTtLQUNwQztBQUFBLElBQUEsSUFBSSxDQUFDLEtBQUwsR0FBYTtBQUFBLE1BQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxNQUFNLENBQUEsRUFBRyxDQUFUO0tBQWIsQ0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLEtBQUwsR0FBYSxHQURiLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxPQUFMLEdBQWUsQ0FGZixDQUFBO0FBQUEsSUFHQSxjQUFBLEdBQ0M7QUFBQSxNQUFBLFVBQUEsRUFDQztBQUFBLFFBQUEsS0FBQSxFQUFPLENBQVA7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQURUO09BREQ7S0FKRCxDQUFBO1dBT0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBUlM7RUFBQSxDQTVHVixDQUFBOztBQUFBLHFDQXNIQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sZ0JBQVAsR0FBQTtBQUNaLFFBQUEsY0FBQTs7TUFEbUIsbUJBQW1CLElBQUMsQ0FBQTtLQUN2QztBQUFBLElBQUEsSUFBSSxDQUFDLENBQUwsR0FBUyxJQUFDLENBQUEsS0FBRCxHQUFPLENBQWhCLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLEdBRGpCLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxDQUFMLEdBQVMsR0FGVCxDQUFBO0FBQUEsSUFHQSxjQUFBLEdBQ0M7QUFBQSxNQUFBLFVBQUEsRUFDQztBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLFNBQUEsRUFBVyxDQURYO0FBQUEsUUFFQSxDQUFBLEVBQUcsQ0FGSDtPQUREO0tBSkQsQ0FBQTtXQVFBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQWhCLEVBQXNCLGNBQXRCLEVBQXNDLGdCQUF0QyxFQVRZO0VBQUEsQ0F0SGIsQ0FBQTs7QUFBQSxxQ0FpSUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLGdCQUFQLEdBQUE7QUFDWCxRQUFBLGNBQUE7O01BRGtCLG1CQUFtQixJQUFDLENBQUE7S0FDdEM7QUFBQSxJQUFBLElBQUksQ0FBQyxDQUFMLEdBQVMsQ0FBQSxJQUFFLENBQUEsS0FBRixHQUFRLENBQWpCLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxTQUFMLEdBQWlCLENBQUEsR0FEakIsQ0FBQTtBQUFBLElBRUEsSUFBSSxDQUFDLENBQUwsR0FBUyxHQUZULENBQUE7QUFBQSxJQUdBLGNBQUEsR0FDQztBQUFBLE1BQUEsVUFBQSxFQUNDO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLFFBQ0EsU0FBQSxFQUFXLENBRFg7QUFBQSxRQUVBLENBQUEsRUFBRyxDQUZIO09BREQ7S0FKRCxDQUFBO1dBUUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFBc0IsY0FBdEIsRUFBc0MsZ0JBQXRDLEVBVFc7RUFBQSxDQWpJWixDQUFBOztrQ0FBQTs7R0FGOEMsTUFBL0MsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0YWxsOiAtPiBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblx0d2l0aE5hbWU6IChuYW1lKSAtPlxuXHRcdG1hdGNoaW5nTGF5ZXJzID0gW11cblx0XHRmb3IgbGF5ZXIgaW4gQGFsbCgpXG4gXHRcdFx0bWF0Y2hpbmdMYXllcnMucHVzaChsYXllcikgaWYgbGF5ZXIubmFtZSBpcyBuYW1lXG4gXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKCkgIyB0byBtYXRjaCBsYXllcmxpc3Qgb3JkZXJcblx0Y29udGFpbmluZzogKG5hbWUpIC0+XG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcbiBcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllci5uYW1lLmluZGV4T2YobmFtZSkgaXNudCAtMVxuIFx0XHRyZXR1cm4gbWF0Y2hpbmdMYXllcnMucmV2ZXJzZSgpICMgdG8gbWF0Y2ggbGF5ZXJsaXN0IG9yZGVyXG5cdHN0YXJ0aW5nV2l0aDogKG5hbWUpIC0+XG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcbiBcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllci5uYW1lLnN1YnN0cmluZygwLG5hbWUubGVuZ3RoKSBpcyBuYW1lXG4gXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKCkgIyB0byBtYXRjaCBsYXllcmxpc3Qgb3JkZXJcblx0ZW5kaW5nV2l0aDogKG5hbWUpIC0+XG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcbiBcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllci5uYW1lLm1hdGNoKFwiI3tuYW1lfSRcIilcbiBcdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKSAjIHRvIG1hdGNoIGxheWVybGlzdCBvcmRlclxuXHR3aXRoU3RhdGU6IChzdGF0ZSkgLT4gXG5cdFx0bWF0Y2hpbmdMYXllcnMgPSBbXVxuXHRcdGZvciBsYXllciBpbiBAYWxsKClcblx0XHRcdGxheWVyU3RhdGVzID0gbGF5ZXIuc3RhdGVzLl9vcmRlcmVkU3RhdGVzXG5cdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyKSBpZiBsYXllclN0YXRlcy5pbmRleE9mKHN0YXRlKSBpc250IC0xXG5cdFx0cmV0dXJuIG1hdGNoaW5nTGF5ZXJzLnJldmVyc2UoKVxuXHR3aXRoQ3VycmVudFN0YXRlOiAoc3RhdGUpIC0+IFxuXHRcdG1hdGNoaW5nTGF5ZXJzID0gW11cblx0XHRmb3IgbGF5ZXIgaW4gQGFsbCgpXG5cdFx0XHRjdXJyZW50U3RhdGUgPSBsYXllci5zdGF0ZXMuY3VycmVudFxuXHRcdFx0bWF0Y2hpbmdMYXllcnMucHVzaChsYXllcikgaWYgY3VycmVudFN0YXRlLmluZGV4T2Yoc3RhdGUpIGlzbnQgLTFcblx0XHRyZXR1cm4gbWF0Y2hpbmdMYXllcnMucmV2ZXJzZSgpXG5cdHdpdGhTdXBlckxheWVyOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEB3aXRoTmFtZShuYW1lKVxuXHRcdFx0bWF0Y2hpbmdMYXllcnMgPSBtYXRjaGluZ0xheWVycy5jb25jYXQobGF5ZXIuc3ViTGF5ZXJzKVxuXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKClcblx0d2l0aFN1YkxheWVyOiAobmFtZSkgLT5cblx0XHRtYXRjaGluZ0xheWVycyA9IFtdXG5cdFx0Zm9yIGxheWVyIGluIEB3aXRoTmFtZShuYW1lKVxuXHRcdFx0aWYgbWF0Y2hpbmdMYXllcnMuaW5kZXhPZihsYXllci5zdXBlckxheWVyKSBpcyAtMVxuXHRcdFx0XHRtYXRjaGluZ0xheWVycy5wdXNoKGxheWVyLnN1cGVyTGF5ZXIpIFxuXHRcdHJldHVybiBtYXRjaGluZ0xheWVycy5yZXZlcnNlKClcblx0d2hlcmU6IChvYmopIC0+XG5cdFx0Xy53aGVyZSBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKCksIG9ialxuXHRnZXQ6IChuYW1lKSAtPlxuXHRcdEB3aXRoTmFtZShuYW1lKVswXVxufVxuXG5MYXllcjo6cHJlZml4U3dpdGNoID0gKG5ld1ByZWZpeCwgZGVsaW1pdGVyID0gJ18nKSAtPlxuXHRuYW1lID0gdGhpcy5uYW1lXG5cdG5ld05hbWUgPSBuZXdQcmVmaXggKyBuYW1lLnNsaWNlIG5hbWUuaW5kZXhPZiBkZWxpbWl0ZXJcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzLmdldCBuZXdOYW1lXG5cbiMgQnkgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3Nob3J0Y3V0cy1mb3ItZnJhbWVyXG5MYXllcjo6ZmluZFN1YkxheWVyID0gKG5lZWRsZSwgcmVjdXJzaXZlID0gdHJ1ZSkgLT5cbiAgIyBTZWFyY2ggZGlyZWN0IGNoaWxkcmVuXG4gIGZvciBzdWJMYXllciBpbiBAc3ViTGF5ZXJzXG4gICAgcmV0dXJuIHN1YkxheWVyIGlmIHN1YkxheWVyLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZS50b0xvd2VyQ2FzZSgpKSBpc250IC0xIFxuICAjIFJlY3Vyc2l2ZWx5IHNlYXJjaCBjaGlsZHJlbiBvZiBjaGlsZHJlblxuICBpZiByZWN1cnNpdmVcbiAgICBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuICAgICAgcmV0dXJuIHN1YkxheWVyLmZpbmRTdWJMYXllcihuZWVkbGUsIHJlY3Vyc2l2ZSkgaWYgc3ViTGF5ZXIuZmluZFN1YkxheWVyKG5lZWRsZSwgcmVjdXJzaXZlKVxuICAgICAgXG5MYXllcjo6ZmluZFN1cGVyTGF5ZXIgPSAobmVlZGxlLCByZWN1cnNpdmUgPSB0cnVlKSAtPlxuICAjIFNlYXJjaCBkaXJlY3QgY2hpbGRyZW5cbiAgcmV0dXJuIEBzdXBlckxheWVyIGlmIEBzdXBlckxheWVyLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZS50b0xvd2VyQ2FzZSgpKSBpc250IC0xIFxuICAjIFJlY3Vyc2l2ZWx5IHNlYXJjaCBjaGlsZHJlbiBvZiBjaGlsZHJlblxuICBpZiByZWN1cnNpdmVcbiAgXHRyZXR1cm4gQHN1cGVyTGF5ZXIuZmluZFN1cGVyTGF5ZXIobmVlZGxlLCByZWN1cnNpdmUpIGlmIEBzdXBlckxheWVyLmZpbmRTdXBlckxheWVyKG5lZWRsZSwgcmVjdXJzaXZlKSIsIiMgVE9ETzpcbiMgSWdub3JlIGFsbCBldmVudHMgbm90IHBhcnQgb2YgY2hpbGRyZW4gdG8gQGN1cnJlbnQgKGF2b2lkIGNsaWNrIHRocm91Z2gpXG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuIyB0ZXN0IHVzZSBjYXNlIHdpdGggaW9zIG5hdGl2ZSBwdXNoIG1lc3NhZ2VzXG4jIGFkZCBwYWdlcyB3aGVuIHRyeWluZyB0byBhbmltYXRlIHRoZW0uIGVnLiBpZiBAc3ViTGF5ZXJzLmluZGV4T2YodmlldykgaXMgLTEgdGhlbiBAYWRkIHZpZXdcblxuY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiYmV6aWVyLWN1cnZlKC4yLCAxLCAuMiwgMSlcIiwgdGltZTogLjZcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcInJnYmEoMTkwLDE5MCwxOTAsMC45KVwiXG5cdFx0b3B0aW9ucy5wZXJzcGVjdGl2ZSA/PSAxMDAwXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdFx0XHRcblx0YWRkOiAodmlldywgcG9pbnQgPSB7eDowLCB5OjB9KSAtPlxuXHRcdCN2aWV3Lmlnbm9yZUV2ZW50cyA9IHRydWVcblx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cdFx0I3ZpZXcueCA9IEB3aWR0aFxuXHRcdCN2aWV3LnkgPSAwXG5cdFx0dmlldy5vbiBFdmVudHMuQ2xpY2ssIC0+IHJldHVybiAjIHByZXZlbnQgY2xpY2stdGhyb3VnaC9idWJibGluZ1xuXHRcdHZpZXcucG9pbnQgPSBwb2ludFxuXHRcdEBjdXJyZW50ID0gdmlld1xuXHRcdFxuXHRzYXZlQ3VycmVudFRvSGlzdG9yeTogKGFuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0YW5pbWF0aW9uOiBhbmltYXRpb25cblxuXHRiYWNrOiAtPiBcblx0XHRpZiBAaGlzdG9yeVswXT9cblx0XHRcdCNAaGlzdG9yeVswXS52aWV3LnggPSAwXG5cdFx0XHQjQGhpc3RvcnlbMF0udmlldy55ID0gMFxuXHRcdFx0YW5pbSA9IEBoaXN0b3J5WzBdLmFuaW1hdGlvblxuXHRcdFx0YmFja3dhcmRzID0gYW5pbS5yZXZlcnNlKClcblx0XHRcdGJhY2t3YXJkcy5zdGFydCgpXG5cdFx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRcdGJhY2t3YXJkcy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXG5cdGFwcGx5QW5pbWF0aW9uOiAodmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0dW5sZXNzIHZpZXcgaXMgQGN1cnJlbnRcblx0XHRcdF8uZXh0ZW5kIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRhbmltID0gdmlldy5hbmltYXRlIGFuaW1Qcm9wZXJ0aWVzXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgYW5pbVxuXHRcdFx0YW5pbS5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PiBcblx0XHRcdFx0I3ByZXZpb3VzID0gQGhpc3RvcnlbMF0udmlld1xuXHRcdFx0XHQjQHN1YkxheWVyc0lnbm9yZUV2ZW50cyBwcmV2aW91cywgdHJ1ZVxuXHRcdFx0XHQjcHJldmlvdXMueCA9IEB3aWR0aFxuXHRcdFx0QGN1cnJlbnQgPSB2aWV3XG5cdFx0XHRcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0c3ViTGF5ZXJzSWdub3JlRXZlbnRzOiAodmlldywgYm9vbGVhbikgLT5cblx0XHRwcmludCB2aWV3XG5cdFx0dmlldy5pZ25vcmVFdmVudHMgPSBib29sZWFuXG5cdFx0Zm9yIHN1YkxheWVyIGluIHZpZXcuc3ViTGF5ZXJzXG5cdFx0XHRAc3ViTGF5ZXJzSWdub3JlRXZlbnRzIHN1YkxheWVyLCBib29sZWFuXG5cdFx0XHRcblxuXHQjIyMgQU5JTUFUSU9OUyAjIyNcblxuXHRzd2l0Y2hJbnN0YW50OiAodmlldykgLT4gQGZhZGVJbiB2aWV3LCB0aW1lOiAwXG5cblx0c2xpZGVJblVwOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHR2aWV3LnkgPSAtQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluRG93bjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0dmlldy55ID0gQGhlaWdodFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHk6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdHZpZXcueCA9IEB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluTGVmdDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0dmlldy54ID0gLUB3aWR0aFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmYWRlSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdCN2aWV3LnBvaW50ID0geDogMCwgeTogMFxuXHRcdHZpZXcub3BhY2l0eSA9IDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRcblx0em9vbUluOiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHQjdmlldy5wb2ludCA9IHg6IDAsIHk6IDBcblx0XHR2aWV3LnNjYWxlID0gMC44XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHR6b29tZWRJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0dmlldy5wb2ludCA9IHg6IDAsIHk6IDBcblx0XHR2aWV3LnNjYWxlID0gMS41XG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0dmlldy54ID0gQHdpZHRoLzJcblx0XHR2aWV3LnJvdGF0aW9uWSA9IDEwMFxuXHRcdHZpZXcueiA9IDgwMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5MZWZ0OiAodmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHR2aWV3LnggPSAtQHdpZHRoLzJcblx0XHR2aWV3LnJvdGF0aW9uWSA9IC0xMDBcblx0XHR2aWV3LnogPSA4MDBcblx0XHRhbmltUHJvcGVydGllcyA9XG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIHZpZXcsIGFuaW1Qcm9wZXJ0aWVzLCBhbmltYXRpb25PcHRpb25zIl19
