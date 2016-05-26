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
      var i, len, ref, results, subLayer;
      ref = changeList.added;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        results.push(this.addView(subLayer, true));
      }
      return results;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY2hyaXNjYW1hcmdvL0Ryb3Bib3gvRnJhbWVyIFByb2plY3RzL2ZyYW1lci12aWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIvdm5jLWV4YW1wbGUwMS5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDO0FBR2IsTUFBQTs7OztFQUFBLGlCQUFBLEdBQW9COztFQUNwQixvQkFBQSxHQUF1Qjs7RUFDdkIsaUJBQUEsR0FDQztJQUFBLElBQUEsRUFBTSxHQUFOO0lBQ0EsS0FBQSxFQUFPLGFBRFA7OztFQUVELGlCQUFBLEdBQ0M7SUFBQSxDQUFBLEVBQUcsQ0FBSDtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsS0FBQSxFQUFPLEVBRlA7SUFHQSxNQUFBLEVBQVEsRUFIUjs7O0VBSUQsSUFBQSxHQUNDO0lBQUEsRUFBQSxFQUFRLFFBQVI7SUFDQSxJQUFBLEVBQVEsVUFEUjtJQUVBLElBQUEsRUFBUSxVQUZSO0lBR0EsS0FBQSxFQUFRLFdBSFI7SUFJQSxNQUFBLEVBQVEsWUFKUjs7O0VBS0QsR0FBQSxHQUNDO0lBQUEsRUFBQSxFQUFPLElBQVA7SUFDQSxJQUFBLEVBQU8sTUFEUDtJQUVBLElBQUEsRUFBTyxNQUZQO0lBR0EsS0FBQSxFQUFPLE9BSFA7OztFQUlELFVBQUEsR0FBYTs7RUFHQSxrQ0FBQyxPQUFEO0FBRVosUUFBQTtJQUZhLElBQUMsQ0FBQSw0QkFBRCxVQUFTO0lBRXRCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxlQUFELEdBQW1COztV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LEVBQWUsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO0FBQ2QsWUFBQTtRQUFBLElBQUcsSUFBSSxDQUFDLFVBQUwsS0FBcUIsS0FBeEI7VUFDQyxVQUFBLEdBQWlCLElBQUEsS0FBQSxDQUNoQjtZQUFBLElBQUEsRUFBTSxvQkFBTjtZQUNBLEtBQUEsRUFBTyxFQURQO1lBRUEsTUFBQSxFQUFRLEVBRlI7WUFHQSxVQUFBLEVBQVksSUFIWjtXQURnQjtVQU1qQixJQUFHLEtBQUMsQ0FBQSxTQUFELEtBQWMsS0FBakI7WUFDQyxVQUFVLENBQUMsZUFBWCxHQUE2QixjQUQ5Qjs7VUFHQSxVQUFVLENBQUMsS0FBWCxHQUFtQjtpQkFFbkIsVUFBVSxDQUFDLEVBQVgsQ0FBYyxNQUFNLENBQUMsS0FBckIsRUFBNEIsU0FBQTttQkFDM0IsS0FBQyxDQUFBLElBQUQsQ0FBQTtVQUQyQixDQUE1QixFQVpEOztNQURjO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO0VBRGlCOztxQ0FpQmxCLHFCQUFBLEdBQXVCLFNBQUMsZ0JBQUQ7SUFDdEIsSUFBRyxnQkFBQSxLQUFvQixHQUFHLENBQUMsRUFBM0I7QUFDQyxhQUFPLEdBQUcsQ0FBQyxLQURaO0tBQUEsTUFFSyxJQUFHLGdCQUFBLEtBQW9CLEdBQUcsQ0FBQyxJQUEzQjtBQUNKLGFBQU8sR0FBRyxDQUFDLEdBRFA7S0FBQSxNQUVBLElBQUcsZ0JBQUEsS0FBb0IsR0FBRyxDQUFDLEtBQTNCO0FBQ0osYUFBTyxHQUFHLENBQUMsS0FEUDtLQUFBLE1BRUEsSUFBRyxnQkFBQSxLQUFvQixHQUFHLENBQUMsSUFBM0I7QUFDSixhQUFPLEdBQUcsQ0FBQyxNQURQO0tBQUEsTUFBQTtBQUdKLGFBQU8sR0FBRyxDQUFDLEtBSFA7O0VBUGlCOzs7O0dBOUp1QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cblx0IyBTZXR1cCBDbGFzcyBDb25zdGFudHNcblx0SU5JVElBTF9WSUVXX05BTUUgPSBcImluaXRpYWxWaWV3XCJcblx0QkFDS0JVVFRPTl9WSUVXX05BTUUgPSBcInZuYy1iYWNrQnV0dG9uXCJcblx0QU5JTUFUSU9OX09QVElPTlMgPSBcblx0XHR0aW1lOiAwLjNcblx0XHRjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cdEJBQ0tfQlVUVE9OX0ZSQU1FID0gXG5cdFx0eDogMFxuXHRcdHk6IDQwXG5cdFx0d2lkdGg6IDg4XG5cdFx0aGVpZ2h0OiA4OFxuXHRQVVNIID1cblx0XHRVUDogICAgIFwicHVzaFVwXCJcblx0XHRET1dOOiAgIFwicHVzaERvd25cIlxuXHRcdExFRlQ6ICAgXCJwdXNoTGVmdFwiXG5cdFx0UklHSFQ6ICBcInB1c2hSaWdodFwiXG5cdFx0Q0VOVEVSOiBcInB1c2hDZW50ZXJcIlxuXHRESVIgPVxuXHRcdFVQOiAgICBcInVwXCJcblx0XHRET1dOOiAgXCJkb3duXCJcblx0XHRMRUZUOiAgXCJsZWZ0XCJcblx0XHRSSUdIVDogXCJyaWdodFwiXG5cdERFQlVHX01PREUgPSBmYWxzZVxuXHRcdFxuXHQjIFNldHVwIEluc3RhbmNlIGFuZCBJbnN0YW5jZSBWYXJpYWJsZXNcdFxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXG5cdFx0QHZpZXdzID0gQGhpc3RvcnkgPSBAaW5pdGlhbFZpZXcgPSBAY3VycmVudFZpZXcgPSBAcHJldmlvdXNWaWV3ID0gQGFuaW1hdGlvbk9wdGlvbnMgPSBAaW5pdGlhbFZpZXdOYW1lID0gbnVsbFxuXHRcdEBvcHRpb25zLndpZHRoICAgICAgICAgICA/PSBTY3JlZW4ud2lkdGhcblx0XHRAb3B0aW9ucy5oZWlnaHQgICAgICAgICAgPz0gU2NyZWVuLmhlaWdodFxuXHRcdEBvcHRpb25zLmNsaXAgICAgICAgICAgICA/PSB0cnVlXG5cdFx0QG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiIzk5OVwiXG5cdFx0XG5cdFx0c3VwZXIgQG9wdGlvbnNcblx0XHRcblx0XHRAdmlld3MgICA9IFtdXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBhbmltYXRpb25PcHRpb25zID0gQG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyBvciBBTklNQVRJT05fT1BUSU9OU1xuXHRcdEBpbml0aWFsVmlld05hbWUgID0gQG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lICBvciBJTklUSUFMX1ZJRVdfTkFNRVxuXHRcdEBiYWNrQnV0dG9uRnJhbWUgID0gQG9wdGlvbnMuYmFja0J1dHRvbkZyYW1lICBvciBCQUNLX0JVVFRPTl9GUkFNRVxuXG5cdFx0QGRlYnVnTW9kZSA9IGlmIEBvcHRpb25zLmRlYnVnTW9kZT8gdGhlbiBAb3B0aW9ucy5kZWJ1Z01vZGUgZWxzZSBERUJVR19NT0RFXG5cdFx0XG5cdFx0QC5vbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRAYWRkVmlldyBzdWJMYXllciwgdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gY2hhbmdlTGlzdC5hZGRlZFxuXG5cdGFkZFZpZXc6ICh2aWV3LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50KSAtPlxuXHRcdFxuXHRcdHZuY1dpZHRoICA9IEBvcHRpb25zLndpZHRoXG5cdFx0dm5jSGVpZ2h0ID0gQG9wdGlvbnMuaGVpZ2h0XG5cblx0XHR2aWV3LnN0YXRlcy5hZGQoXG5cdFx0XHRcIiN7IFBVU0guVVAgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC12bmNIZWlnaHRcblx0XHRcdFwiI3sgUFVTSC5MRUZUIH1cIjpcblx0XHRcdFx0eDogLXZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5DRU5URVIgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5SSUdIVCB9XCI6XG5cdFx0XHRcdHg6IHZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5ET1dOIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiB2bmNIZWlnaHRcblx0XHQpXG5cblx0XHRcdFxuXHRcdHZpZXcuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFxuXHRcdGlmIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRAaW5pdGlhbFZpZXcgPSB2aWV3XG5cdFx0XHRAY3VycmVudFZpZXcgPSB2aWV3XG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guQ0VOVEVSXG5cdFx0XHRAaGlzdG9yeS5wdXNoIHZpZXdcblx0XHRlbHNlXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guUklHSFRcblx0XHRcblx0XHR1bmxlc3Mgdmlldy5zdXBlckxheWVyIGlzIEAgb3IgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdFx0XG5cdFx0QF9hcHBseUJhY2tCdXR0b24gdmlldyB1bmxlc3Mgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblx0XHRcdFxuXHRcdEB2aWV3cy5wdXNoIHZpZXdcblxuXHR0cmFuc2l0aW9uOiAodmlldywgZGlyZWN0aW9uID0gRElSLlJJR0hULCBzd2l0Y2hJbnN0YW50ID0gZmFsc2UsIHByZXZlbnRIaXN0b3J5ID0gZmFsc2UpIC0+XG5cblx0XHRyZXR1cm4gZmFsc2UgaWYgdmlldyBpcyBAY3VycmVudFZpZXdcblx0XHRcblx0XHQjIFNldHVwIFZpZXdzIGZvciB0aGUgdHJhbnNpdGlvblxuXHRcdGlmIGRpcmVjdGlvbiBpcyBESVIuUklHSFRcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guUklHSFRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guTEVGVFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5ET1dOXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkRPV05cblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guVVBcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuTEVGVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5MRUZUXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILlJJR0hUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLlVQXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILlVQXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkRPV05cblx0XHRlbHNlXG5cdFx0XHQjIElmIHRoZXkgc3BlY2lmaWVkIHNvbWV0aGluZyBkaWZmZXJlbnQganVzdCBzd2l0Y2ggaW1tZWRpYXRlbHlcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkxFRlRcblx0XHRcblx0XHQjIFB1c2ggdmlldyB0byBDZW50ZXJcblx0XHR2aWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5DRU5URVJcblx0XHQjIGN1cnJlbnRWaWV3IGlzIG5vdyBvdXIgcHJldmlvdXNWaWV3XG5cdFx0QHByZXZpb3VzVmlldyA9IEBjdXJyZW50Vmlld1xuXHRcdCMgU2F2ZSB0cmFuc2l0aW9uIGRpcmVjdGlvbiB0byB0aGUgbGF5ZXIncyBjdXN0b20gcHJvcGVydGllc1xuXHRcdEBwcmV2aW91c1ZpZXcuY3VzdG9tID1cblx0XHRcdGxhc3RUcmFuc2l0aW9uOiBkaXJlY3Rpb25cblx0XHQjIFNldCBvdXIgY3VycmVudFZpZXcgdG8gdGhlIHZpZXcgd2UndmUgYnJvdWdodCBpblxuXHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblxuXHRcdCMgU3RvcmUgdGhlIGxhc3QgdmlldyBpbiBoaXN0b3J5XG5cdFx0QGhpc3RvcnkucHVzaCBAcHJldmlvdXNWaWV3IGlmIHByZXZlbnRIaXN0b3J5IGlzIGZhbHNlXG5cdFx0XG5cdFx0IyBFbWl0IGFuIGV2ZW50IHNvIHRoZSBwcm90b3R5cGUgY2FuIHJlYWN0IHRvIGEgdmlldyBjaGFuZ2Vcblx0XHRAZW1pdCBcImNoYW5nZTp2aWV3XCJcblxuXHRyZW1vdmVCYWNrQnV0dG9uOiAodmlldykgLT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHRcdFx0dmlldy5zdWJMYXllcnNCeU5hbWUoQkFDS0JVVFRPTl9WSUVXX05BTUUpWzBdLnZpc2libGUgPSBmYWxzZVxuXG5cdGJhY2s6ICgpIC0+XG5cdFx0bGFzdFZpZXcgPSBAX2dldExhc3RIaXN0b3J5SXRlbSgpXG5cdFx0bGFzdFRyYW5zaXRpb24gPSBsYXN0Vmlldy5jdXN0b20ubGFzdFRyYW5zaXRpb25cblx0XHRvcHBvc2l0ZVRyYW5zaXRpb24gPSBAX2dldE9wcG9zaXRlRGlyZWN0aW9uKGxhc3RUcmFuc2l0aW9uKVxuXHRcdEB0cmFuc2l0aW9uKGxhc3RWaWV3LCBkaXJlY3Rpb24gPSBvcHBvc2l0ZVRyYW5zaXRpb24sIHN3aXRjaEluc3RhbnQgPSBmYWxzZSwgcHJldmVudEhpc3RvcnkgPSB0cnVlKVxuXHRcdEBoaXN0b3J5LnBvcCgpXG5cblx0X2dldExhc3RIaXN0b3J5SXRlbTogKCkgLT5cblx0XHRyZXR1cm4gQGhpc3RvcnlbQGhpc3RvcnkubGVuZ3RoIC0gMV1cblxuXHRfYXBwbHlCYWNrQnV0dG9uOiAodmlldywgZnJhbWUgPSBAYmFja0J1dHRvbkZyYW1lKSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHRpZiB2aWV3LmJhY2tCdXR0b24gaXNudCBmYWxzZVxuXHRcdFx0XHRiYWNrQnV0dG9uID0gbmV3IExheWVyXG5cdFx0XHRcdFx0bmFtZTogQkFDS0JVVFRPTl9WSUVXX05BTUVcblx0XHRcdFx0XHR3aWR0aDogODBcblx0XHRcdFx0XHRoZWlnaHQ6IDgwXG5cdFx0XHRcdFx0c3VwZXJMYXllcjogdmlld1xuXG5cdFx0XHRcdGlmIEBkZWJ1Z01vZGUgaXMgZmFsc2Vcblx0XHRcdFx0XHRiYWNrQnV0dG9uLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIlxuXG5cdFx0XHRcdGJhY2tCdXR0b24uZnJhbWUgPSBmcmFtZVxuXG5cdFx0XHRcdGJhY2tCdXR0b24ub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0XHRcdEBiYWNrKClcblxuXHRfZ2V0T3Bwb3NpdGVEaXJlY3Rpb246IChpbml0aWFsRGlyZWN0aW9uKSAtPlxuXHRcdGlmIGluaXRpYWxEaXJlY3Rpb24gaXMgRElSLlVQXG5cdFx0XHRyZXR1cm4gRElSLkRPV05cblx0XHRlbHNlIGlmIGluaXRpYWxEaXJlY3Rpb24gaXMgRElSLkRPV05cblx0XHRcdHJldHVybiBESVIuVVBcblx0XHRlbHNlIGlmIGluaXRpYWxEaXJlY3Rpb24gaXMgRElSLlJJR0hUXG5cdFx0XHRyZXR1cm4gRElSLkxFRlRcblx0XHRlbHNlIGlmIGluaXRpYWxEaXJlY3Rpb24gaXMgRElSLkxFRlRcblx0XHRcdHJldHVybiBESVIuUklHSFRcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gRElSLkxFRlRcblx0XHRcbiAgICBcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVVNBR0UgRVhBTVBMRSAxIC0gRGVmaW5lIEluaXRpYWxWaWV3TmFtZSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiMgaW5pdGlhbFZpZXdLZXkgPSBcInZpZXcxXCJcbiMgXG4jIHZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgaW5pdGlhbFZpZXdOYW1lOiBpbml0aWFsVmlld0tleVxuIyB2aWV3MSA9IG5ldyBMYXllclxuIyBcdG5hbWU6IGluaXRpYWxWaWV3S2V5XG4jIFx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcbiMgXHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVVNBR0UgRVhBTVBMRSAyIC0gVXNlIGRlZmF1bHQgaW5pdGlhbFZpZXdOYW1lIFwiaW5pdGlhbFZpZXdcIiAjIyMjIyMjIyMjIyMjIyMjIyNcblxuIyB2bmMgPSBuZXcgVmlld05hdmlnYXRpb25Db250cm9sbGVyXG5cbiMgdmlldzEgPSBuZXcgTGF5ZXJcbiMgXHRuYW1lOiBcImluaXRpYWxWaWV3XCJcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXHRcbiMgdmlldzIgPSBuZXcgTGF5ZXJcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMgdmlldzEub24gRXZlbnRzLkNsaWNrLCAtPiB2bmMudHJhbnNpdGlvbiB2aWV3MlxuIyB2aWV3Mi5vbiBFdmVudHMuQ2xpY2ssIC0+IHZuYy5iYWNrKClcblx0Il19
