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
      return view.bringToFront();
    }
  };


  /* ANIMATIONS <3 */

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

  ViewNavigationController.prototype.spinIn = function(view, animationOptions) {
    var animProperties;
    if (animationOptions == null) {
      animationOptions = {
        curve: "spring(200,30)"
      };
    }
    view.rotation = 0;
    view.opacity = 0;
    view.scale = 0.4;
    animProperties = {
      properties: {
        rotation: 360,
        opacity: 1,
        scale: 1
      }
    };
    return this.applyAnimation(view, animProperties, animationOptions);
  };

  return ViewNavigationController;

})(Layer);



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvZnJhbWVyLXZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci92bmMtZXhhbXBsZTAxLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzZCQUFBOztBQUFBLE9BQWEsQ0FBQztBQUViLDhDQUFBLENBQUE7O0FBQWEsRUFBQSxrQ0FBQyxPQUFELEdBQUE7O01BQUMsVUFBUTtLQUNyQjs7TUFBQSxPQUFPLENBQUMsUUFBUyxNQUFNLENBQUM7S0FBeEI7O01BQ0EsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDO0tBRHpCOztNQUVBLE9BQU8sQ0FBQyxPQUFRO0tBRmhCOztNQUdBLE9BQU8sQ0FBQyxtQkFBb0I7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDs7S0FINUI7O01BSUEsT0FBTyxDQUFDLGtCQUFtQjtLQUozQjtBQUFBLElBS0EsMERBQU0sT0FBTixDQUxBLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFQWCxDQURZO0VBQUEsQ0FBYjs7QUFBQSxxQ0FVQSxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBOztNQUFPLFFBQVE7QUFBQSxRQUFDLENBQUEsRUFBRSxDQUFIO0FBQUEsUUFBTSxDQUFBLEVBQUUsQ0FBUjs7S0FHbkI7QUFBQSxJQUFBLElBQUksQ0FBQyxVQUFMLEdBQWtCLElBQWxCLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxLQUFMLEdBQWEsS0FEYixDQUFBO1dBUUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQVhQO0VBQUEsQ0FWTCxDQUFBOztBQUFBLHFDQXVCQSxvQkFBQSxHQUFzQixTQUFD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QUFBQSxJQUFBLElBQUksQ0FBQyxRQUFMLEdBQWdCLENBQWhCLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxPQUFMLEdBQWUsQ0FEZixDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsS0FBTCxHQUFhLEdBRmIsQ0FBQTtBQUFBLElBR0EsY0FBQSxHQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLFFBQUEsRUFBVSxHQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsQ0FEVDtBQUFBLFFBRUEsS0FBQSxFQUFPLENBRlA7T0FERDtLQUpELENBQUE7V0FRQSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFoQixFQUFzQixjQUF0QixFQUFzQyxnQkFBdEMsRUFUTztFQUFBLENBekVSLENBQUE7O2tDQUFBOztHQUY4QyxNQUEvQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcInNwcmluZyg0MDAsNDApXCJcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcInJnYmEoMTkwLDE5MCwxOTAsMC45KVwiXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdFxuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRcdFx0XG5cdGFkZDogKHZpZXcsIHBvaW50ID0ge3g6MCwgeTowfSkgLT5cblx0XHQjc3ViTGF5ZXIuaWdub3JlRXZlbnRzID0gdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdCN2aWV3Lmlnbm9yZUV2ZW50cyA9IGZhbHNlXG5cdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdHZpZXcucG9pbnQgPSBwb2ludFxuXHRcdCMgdmlldy5zdGF0ZXMuYWRkXG5cdFx0IyBcdHVwOiAgICAge3g6IDAsIHk6IC1AaGVpZ2h0fVxuXHRcdCMgXHRyaWdodDogIHt4OiBAd2lkdGgsIHk6IDB9XG5cdFx0IyBcdGRvd246ICAge3g6IDAsIHk6IEBoZWlnaHR9XG5cdFx0IyBcdGxlZnQ6ICAge3g6IC1Ad2lkdGgsIHk6IDB9XG5cdFx0IyB2aWV3LnN0YXRlcy5hbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnNcblx0XHRAY3VycmVudCA9IHZpZXdcblx0XHRcblx0c2F2ZUN1cnJlbnRUb0hpc3Rvcnk6IChhbmltYXRpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRcblx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uXG5cblx0YmFjazogLT5cblx0XHRpZiBAaGlzdG9yeVswXT9cblx0XHRcdCNzdWJMYXllci5pZ25vcmVFdmVudHMgPSBmYWxzZSBmb3Igc3ViTGF5ZXIgaW4gQHN1YkxheWVyc1xuXHRcdFx0I0BjdXJyZW50LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICdkZWZhdWx0J1xuXHRcdFx0I3ByaW50IEBoaXN0b3J5WzBdLm5hbWVcblx0XHRcdCNAaGlzdG9yeVswXS5vcGFjaXR5ID0gMC40XG5cdFx0XHRhbmltID0gQGhpc3RvcnlbMF0uYW5pbWF0aW9uXG5cdFx0XHRiYWNrd2FyZHMgPSBhbmltLnJldmVyc2UoKVxuXHRcdFx0YmFja3dhcmRzLnN0YXJ0KClcblx0XHRcdGJhY2t3YXJkcy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0XHRcdEBjdXJyZW50ID0gcHJldmlvdXMudmlld1xuXHRcdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cblxuXHQjIGFwcGVhcjogKHZpZXcsIGRpcmVjdGlvbiA9ICdkZWZhdWx0JykgLT5cblx0IyBcdEBjdXJyZW50ID0gdmlld1xuXHQjIFx0I3N1YkxheWVyLmlnbm9yZUV2ZW50cyA9IHRydWUgZm9yIHN1YkxheWVyIGluIEBzdWJMYXllcnNcblx0IyBcdCN2aWV3Lmlnbm9yZUV2ZW50cyA9IGZhbHNlXG5cdFx0XG5cblx0YXBwbHlBbmltYXRpb246ICh2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHR1bmxlc3MgdmlldyBpcyBAY3VycmVudFxuXHRcdFx0Xy5leHRlbmQgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdGFuaW0gPSB2aWV3LmFuaW1hdGUgYW5pbVByb3BlcnRpZXNcblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBhbmltXG5cdFx0XHRAY3VycmVudCA9IHZpZXdcblx0XHRcdHZpZXcuYnJpbmdUb0Zyb250KClcblxuXHQjIyMgQU5JTUFUSU9OUyA8MyAjIyNcblxuXHRzbGlkZUluUmlnaHQ6ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDQwMCw0MClcIikgLT4gXG5cdFx0dmlldy54ID0gQHdpZHRoXG5cdFx0YW5pbVByb3BlcnRpZXMgPVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKHZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSB0aW1lOiAuMikgLT4gXG5cdFx0dmlldy5vcGFjaXR5ID0gMFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gdmlldywgYW5pbVByb3BlcnRpZXMsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdFxuXHRzcGluSW46ICh2aWV3LCBhbmltYXRpb25PcHRpb25zID0gY3VydmU6IFwic3ByaW5nKDIwMCwzMClcIikgLT4gXG5cdFx0dmlldy5yb3RhdGlvbiA9IDBcblx0XHR2aWV3Lm9wYWNpdHkgPSAwXG5cdFx0dmlldy5zY2FsZSA9IDAuNFxuXHRcdGFuaW1Qcm9wZXJ0aWVzID1cblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHJvdGF0aW9uOiAzNjBcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiB2aWV3LCBhbmltUHJvcGVydGllcywgYW5pbWF0aW9uT3B0aW9ucyJdfQ==
