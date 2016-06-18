require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.animationOptions = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode != null ? this.options.debugMode : DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      return Utils.delay(0, (function(_this) {
        return function() {
          var i, len, ref, results, subLayer;
          ref = changeList.added;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subLayer = ref[i];
            results.push(_this.addView(subLayer, true));
          }
          return results;
        };
      })(this));
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.previousView.custom = {
      lastTransition: direction
    };
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit("change:view");
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, lastTransition, lastView, oppositeTransition, preventHistory, switchInstant;
    lastView = this._getLastHistoryItem();
    lastTransition = lastView.custom.lastTransition;
    oppositeTransition = this._getOppositeDirection(lastTransition);
    this.transition(lastView, direction = oppositeTransition, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  ViewNavigationController.prototype._getOppositeDirection = function(initialDirection) {
    if (initialDirection === DIR.UP) {
      return DIR.DOWN;
    } else if (initialDirection === DIR.DOWN) {
      return DIR.UP;
    } else if (initialDirection === DIR.RIGHT) {
      return DIR.LEFT;
    } else if (initialDirection === DIR.LEFT) {
      return DIR.RIGHT;
    } else {
      return DIR.LEFT;
    }
  };

  return ViewNavigationController;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY2hyaXNjYW1hcmdvL0Ryb3Bib3gvRnJhbWVyIFByb2plY3RzL2ZyYW1lci12aWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIvdm5jLWV4YW1wbGUwMS5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDO0FBR2IsTUFBQTs7OztFQUFBLGlCQUFBLEdBQW9COztFQUNwQixvQkFBQSxHQUF1Qjs7RUFDdkIsaUJBQUEsR0FDQztJQUFBLElBQUEsRUFBTSxHQUFOO0lBQ0EsS0FBQSxFQUFPLGFBRFA7OztFQUVELGlCQUFBLEdBQ0M7SUFBQSxDQUFBLEVBQUcsQ0FBSDtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsS0FBQSxFQUFPLEVBRlA7SUFHQSxNQUFBLEVBQVEsRUFIUjs7O0VBSUQsSUFBQSxHQUNDO0lBQUEsRUFBQSxFQUFRLFFBQVI7SUFDQSxJQUFBLEVBQVEsVUFEUjtJQUVBLElBQUEsRUFBUSxVQUZSO0lBR0EsS0FBQSxFQUFRLFdBSFI7SUFJQSxNQUFBLEVBQVEsWUFKUjs7O0VBS0QsR0FBQSxHQUNDO0lBQUEsRUFBQSxFQUFPLElBQVA7SUFDQSxJQUFBLEVBQU8sTUFEUDtJQUVBLElBQUEsRUFBTyxNQUZQO0lBR0EsS0FBQSxFQUFPLE9BSFA7OztFQUlELFVBQUEsR0FBYTs7RUFHQSxrQ0FBQyxPQUFEO0FBRVosUUFBQTtJQUZhLElBQUMsQ0FBQSw0QkFBRCxVQUFTO0lBRXRCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLGdCQUFELEdBQW9C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SnVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblxuXHQjIFNldHVwIENsYXNzIENvbnN0YW50c1xuXHRJTklUSUFMX1ZJRVdfTkFNRSA9IFwiaW5pdGlhbFZpZXdcIlxuXHRCQUNLQlVUVE9OX1ZJRVdfTkFNRSA9IFwidm5jLWJhY2tCdXR0b25cIlxuXHRBTklNQVRJT05fT1BUSU9OUyA9IFxuXHRcdHRpbWU6IDAuM1xuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0QkFDS19CVVRUT05fRlJBTUUgPSBcblx0XHR4OiAwXG5cdFx0eTogNDBcblx0XHR3aWR0aDogODhcblx0XHRoZWlnaHQ6IDg4XG5cdFBVU0ggPVxuXHRcdFVQOiAgICAgXCJwdXNoVXBcIlxuXHRcdERPV046ICAgXCJwdXNoRG93blwiXG5cdFx0TEVGVDogICBcInB1c2hMZWZ0XCJcblx0XHRSSUdIVDogIFwicHVzaFJpZ2h0XCJcblx0XHRDRU5URVI6IFwicHVzaENlbnRlclwiXG5cdERJUiA9XG5cdFx0VVA6ICAgIFwidXBcIlxuXHRcdERPV046ICBcImRvd25cIlxuXHRcdExFRlQ6ICBcImxlZnRcIlxuXHRcdFJJR0hUOiBcInJpZ2h0XCJcblx0REVCVUdfTU9ERSA9IGZhbHNlXG5cdFx0XG5cdCMgU2V0dXAgSW5zdGFuY2UgYW5kIEluc3RhbmNlIFZhcmlhYmxlc1x0XG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRAdmlld3MgPSBAaGlzdG9yeSA9IEBpbml0aWFsVmlldyA9IEBjdXJyZW50VmlldyA9IEBwcmV2aW91c1ZpZXcgPSBAYW5pbWF0aW9uT3B0aW9ucyA9IEBpbml0aWFsVmlld05hbWUgPSBudWxsXG5cdFx0QG9wdGlvbnMud2lkdGggICAgICAgICAgID89IFNjcmVlbi53aWR0aFxuXHRcdEBvcHRpb25zLmhlaWdodCAgICAgICAgICA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0QG9wdGlvbnMuY2xpcCAgICAgICAgICAgID89IHRydWVcblx0XHRAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCIjOTk5XCJcblx0XHRcblx0XHRzdXBlciBAb3B0aW9uc1xuXHRcdFxuXHRcdEB2aWV3cyAgID0gW11cblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0QGFuaW1hdGlvbk9wdGlvbnMgPSBAb3B0aW9ucy5hbmltYXRpb25PcHRpb25zIG9yIEFOSU1BVElPTl9PUFRJT05TXG5cdFx0QGluaXRpYWxWaWV3TmFtZSAgPSBAb3B0aW9ucy5pbml0aWFsVmlld05hbWUgIG9yIElOSVRJQUxfVklFV19OQU1FXG5cdFx0QGJhY2tCdXR0b25GcmFtZSAgPSBAb3B0aW9ucy5iYWNrQnV0dG9uRnJhbWUgIG9yIEJBQ0tfQlVUVE9OX0ZSQU1FXG5cblx0XHRAZGVidWdNb2RlID0gaWYgQG9wdGlvbnMuZGVidWdNb2RlPyB0aGVuIEBvcHRpb25zLmRlYnVnTW9kZSBlbHNlIERFQlVHX01PREVcblx0XHRcblx0XHRALm9uIFwiY2hhbmdlOnN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgLT5cblx0XHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHRcdEBhZGRWaWV3IHN1YkxheWVyLCB0cnVlIGZvciBzdWJMYXllciBpbiBjaGFuZ2VMaXN0LmFkZGVkXG5cblx0YWRkVmlldzogKHZpZXcsIHZpYUludGVybmFsQ2hhbmdlRXZlbnQpIC0+XG5cdFx0XG5cdFx0dm5jV2lkdGggID0gQG9wdGlvbnMud2lkdGhcblx0XHR2bmNIZWlnaHQgPSBAb3B0aW9ucy5oZWlnaHRcblxuXHRcdHZpZXcuc3RhdGVzLmFkZChcblx0XHRcdFwiI3sgUFVTSC5VUCB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogLXZuY0hlaWdodFxuXHRcdFx0XCIjeyBQVVNILkxFRlQgfVwiOlxuXHRcdFx0XHR4OiAtdm5jV2lkdGhcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILkNFTlRFUiB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILlJJR0hUIH1cIjpcblx0XHRcdFx0eDogdm5jV2lkdGhcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILkRPV04gfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IHZuY0hlaWdodFxuXHRcdClcblxuXHRcdFx0XG5cdFx0dmlldy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdFx0aWYgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblx0XHRcdEBpbml0aWFsVmlldyA9IHZpZXdcblx0XHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBoaXN0b3J5LnB1c2ggdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5SSUdIVFxuXHRcdFxuXHRcdHVubGVzcyB2aWV3LnN1cGVyTGF5ZXIgaXMgQCBvciB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cdFx0XHRcblx0XHRAX2FwcGx5QmFja0J1dHRvbiB2aWV3IHVubGVzcyB2aWV3Lm5hbWUgaXMgQGluaXRpYWxWaWV3TmFtZVxuXHRcdFx0XG5cdFx0QHZpZXdzLnB1c2ggdmlld1xuXG5cdHRyYW5zaXRpb246ICh2aWV3LCBkaXJlY3Rpb24gPSBESVIuUklHSFQsIHN3aXRjaEluc3RhbnQgPSBmYWxzZSwgcHJldmVudEhpc3RvcnkgPSBmYWxzZSkgLT5cblxuXHRcdHJldHVybiBmYWxzZSBpZiB2aWV3IGlzIEBjdXJyZW50Vmlld1xuXHRcdFxuXHRcdCMgU2V0dXAgVmlld3MgZm9yIHRoZSB0cmFuc2l0aW9uXG5cdFx0aWYgZGlyZWN0aW9uIGlzIERJUi5SSUdIVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5SSUdIVFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5MRUZUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLkRPV05cblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guRE9XTlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5VUFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5MRUZUXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkxFRlRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guUklHSFRcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuVVBcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guVVBcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guRE9XTlxuXHRcdGVsc2Vcblx0XHRcdCMgSWYgdGhleSBzcGVjaWZpZWQgc29tZXRoaW5nIGRpZmZlcmVudCBqdXN0IHN3aXRjaCBpbW1lZGlhdGVseVxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkNFTlRFUlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guTEVGVFxuXHRcdFxuXHRcdCMgUHVzaCB2aWV3IHRvIENlbnRlclxuXHRcdHZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkNFTlRFUlxuXHRcdCMgY3VycmVudFZpZXcgaXMgbm93IG91ciBwcmV2aW91c1ZpZXdcblx0XHRAcHJldmlvdXNWaWV3ID0gQGN1cnJlbnRWaWV3XG5cdFx0IyBTYXZlIHRyYW5zaXRpb24gZGlyZWN0aW9uIHRvIHRoZSBsYXllcidzIGN1c3RvbSBwcm9wZXJ0aWVzXG5cdFx0QHByZXZpb3VzVmlldy5jdXN0b20gPVxuXHRcdFx0bGFzdFRyYW5zaXRpb246IGRpcmVjdGlvblxuXHRcdCMgU2V0IG91ciBjdXJyZW50VmlldyB0byB0aGUgdmlldyB3ZSd2ZSBicm91Z2h0IGluXG5cdFx0QGN1cnJlbnRWaWV3ID0gdmlld1xuXG5cdFx0IyBTdG9yZSB0aGUgbGFzdCB2aWV3IGluIGhpc3Rvcnlcblx0XHRAaGlzdG9yeS5wdXNoIEBwcmV2aW91c1ZpZXcgaWYgcHJldmVudEhpc3RvcnkgaXMgZmFsc2Vcblx0XHRcblx0XHQjIEVtaXQgYW4gZXZlbnQgc28gdGhlIHByb3RvdHlwZSBjYW4gcmVhY3QgdG8gYSB2aWV3IGNoYW5nZVxuXHRcdEBlbWl0IFwiY2hhbmdlOnZpZXdcIlxuXG5cdHJlbW92ZUJhY2tCdXR0b246ICh2aWV3KSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHR2aWV3LnN1YkxheWVyc0J5TmFtZShCQUNLQlVUVE9OX1ZJRVdfTkFNRSlbMF0udmlzaWJsZSA9IGZhbHNlXG5cblx0YmFjazogKCkgLT5cblx0XHRsYXN0VmlldyA9IEBfZ2V0TGFzdEhpc3RvcnlJdGVtKClcblx0XHRsYXN0VHJhbnNpdGlvbiA9IGxhc3RWaWV3LmN1c3RvbS5sYXN0VHJhbnNpdGlvblxuXHRcdG9wcG9zaXRlVHJhbnNpdGlvbiA9IEBfZ2V0T3Bwb3NpdGVEaXJlY3Rpb24obGFzdFRyYW5zaXRpb24pXG5cdFx0QHRyYW5zaXRpb24obGFzdFZpZXcsIGRpcmVjdGlvbiA9IG9wcG9zaXRlVHJhbnNpdGlvbiwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IHRydWUpXG5cdFx0QGhpc3RvcnkucG9wKClcblxuXHRfZ2V0TGFzdEhpc3RvcnlJdGVtOiAoKSAtPlxuXHRcdHJldHVybiBAaGlzdG9yeVtAaGlzdG9yeS5sZW5ndGggLSAxXVxuXG5cdF9hcHBseUJhY2tCdXR0b246ICh2aWV3LCBmcmFtZSA9IEBiYWNrQnV0dG9uRnJhbWUpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdGlmIHZpZXcuYmFja0J1dHRvbiBpc250IGZhbHNlXG5cdFx0XHRcdGJhY2tCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRuYW1lOiBCQUNLQlVUVE9OX1ZJRVdfTkFNRVxuXHRcdFx0XHRcdHdpZHRoOiA4MFxuXHRcdFx0XHRcdGhlaWdodDogODBcblx0XHRcdFx0XHRzdXBlckxheWVyOiB2aWV3XG5cblx0XHRcdFx0aWYgQGRlYnVnTW9kZSBpcyBmYWxzZVxuXHRcdFx0XHRcdGJhY2tCdXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cblx0XHRcdFx0YmFja0J1dHRvbi5mcmFtZSA9IGZyYW1lXG5cblx0XHRcdFx0YmFja0J1dHRvbi5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdFx0QGJhY2soKVxuXG5cdF9nZXRPcHBvc2l0ZURpcmVjdGlvbjogKGluaXRpYWxEaXJlY3Rpb24pIC0+XG5cdFx0aWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuVVBcblx0XHRcdHJldHVybiBESVIuRE9XTlxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuRE9XTlxuXHRcdFx0cmV0dXJuIERJUi5VUFxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuUklHSFRcblx0XHRcdHJldHVybiBESVIuTEVGVFxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuTEVGVFxuXHRcdFx0cmV0dXJuIERJUi5SSUdIVFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBESVIuTEVGVFxuXHRcdFxuICAgIFxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBVU0FHRSBFWEFNUExFIDEgLSBEZWZpbmUgSW5pdGlhbFZpZXdOYW1lICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuIyBpbml0aWFsVmlld0tleSA9IFwidmlldzFcIlxuIyBcbiMgdm5jID0gbmV3IFZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBpbml0aWFsVmlld05hbWU6IGluaXRpYWxWaWV3S2V5XG4jIHZpZXcxID0gbmV3IExheWVyXG4jIFx0bmFtZTogaW5pdGlhbFZpZXdLZXlcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBVU0FHRSBFWEFNUExFIDIgLSBVc2UgZGVmYXVsdCBpbml0aWFsVmlld05hbWUgXCJpbml0aWFsVmlld1wiICMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jIHZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXJcblxuIyB2aWV3MSA9IG5ldyBMYXllclxuIyBcdG5hbWU6IFwiaW5pdGlhbFZpZXdcIlxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcInJlZFwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cdFxuIyB2aWV3MiA9IG5ldyBMYXllclxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblxuIyB2aWV3MS5vbiBFdmVudHMuQ2xpY2ssIC0+IHZuYy50cmFuc2l0aW9uIHZpZXcyXG4jIHZpZXcyLm9uIEV2ZW50cy5DbGljaywgLT4gdm5jLmJhY2soKVxuXHQiXX0=
