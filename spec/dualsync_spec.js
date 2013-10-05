// Generated by CoffeeScript 1.6.3
(function() {
  var Backbone, backboneSync, collection, localStorage, localsync, model, spyOnLocalsync, spyOnLocalsyncNonDirty, _ref,
    __slice = [].slice;

  Backbone = window.Backbone, backboneSync = window.backboneSync, localsync = window.localsync, localStorage = window.localStorage;

  _ref = {}, collection = _ref.collection, model = _ref.model;

  beforeEach(function() {
    backboneSync.calls = [];
    localStorage.clear();
    collection = new Backbone.Collection({
      id: 12,
      position: 'arm'
    });
    collection.url = 'bones/';
    delete collection.remote;
    model = collection.models[0];
    return delete model.remote;
  });

  spyOnLocalsync = function() {
    spyOn(window, 'localsync').andCallFake(function(method, model, options) {
      if (!options.ignoreCallbacks) {
        return typeof options.success === "function" ? options.success() : void 0;
      }
    });
    return localsync = window.localsync;
  };

  spyOnLocalsyncNonDirty = function(notifyLastModel) {
    return spyOn(window, 'localsync').andCallFake(function(method, model, options) {
      if (_.isFunction(notifyLastModel)) {
        notifyLastModel(model);
      }
      if (method === 'hasDirtyOrDestroyed') {
        return false;
      }
    });
  };

  describe('delegating to localsync and backboneSync, and calling the model callbacks', function() {
    describe('dual tier storage', function() {
      describe('create', function() {
        it('delegates to both localsync and backboneSync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return dualsync('create', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(backboneSync).toHaveBeenCalled();
            expect(backboneSync.calls[0].args[0]).toEqual('create');
            expect(localsync).toHaveBeenCalled();
            return expect(localsync.calls[0].args[0]).toEqual('create');
          });
        });
        it('always calls localsync with a backbone model', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return dualsync('create', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "success callback should have been called", 100);
          return runs(function() {
            return expect(_(localsync.calls).every(function(call) {
              return call.args[1] instanceof Backbone.Model;
            })).toBeTruthy();
          });
        });
        return it('should merge local model with received response', function() {
          var ready;
          spyOnLocalsync();
          spyOn(window, 'mergeModelWithResponse').andCallThrough();
          ready = false;
          runs(function() {
            return dualsync('create', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            return expect(window.mergeModelWithResponse).toHaveBeenCalled();
          });
        });
      });
      describe('read', function() {
        it('delegates to both localsync and backboneSync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return dualsync('read', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(backboneSync).toHaveBeenCalled();
            expect(_(backboneSync.calls).any(function(call) {
              return call.args[0] === 'read';
            })).toBeTruthy();
            expect(localsync).toHaveBeenCalled();
            return expect(_(localsync.calls).any(function(call) {
              return call.args[0] === 'create';
            })).toBeTruthy();
          });
        });
        it('always calls localsync with a backbone model when an object is received', function() {
          var ready;
          spyOnLocalsyncNonDirty();
          ready = false;
          runs(function() {
            return dualsync('read', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "success callback should have been called", 100);
          return runs(function() {
            return expect(_(localsync.calls).every(function(call) {
              return call.args[1] instanceof Backbone.Model;
            })).toBeTruthy();
          });
        });
        it('always calls localsync with a backbone model when an array is received', function() {
          var lastCalledWith, ready, _ref1;
          _ref1 = {}, ready = _ref1.ready, lastCalledWith = _ref1.lastCalledWith;
          spyOnLocalsyncNonDirty(function(lastModel) {
            return lastCalledWith = lastModel;
          });
          runs(function() {
            return dualsync('read', model, {
              success: (function() {
                return ready = true;
              }),
              serverReturnedAttributes: collection.toJSON()
            });
          });
          waitsFor((function() {
            return ready;
          }), "success callback should have been called", 100);
          return runs(function() {
            return expect(lastCalledWith instanceof Backbone.Model).toBeTruthy();
          });
        });
        return it('should merge local model with received response', function() {
          var ready;
          spyOnLocalsyncNonDirty();
          spyOn(window, 'mergeModelWithResponse').andCallThrough();
          ready = false;
          runs(function() {
            return dualsync('read', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            return expect(window.mergeModelWithResponse).toHaveBeenCalled();
          });
        });
      });
      describe('update', function() {
        it('delegates to both localsync and backboneSync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return dualsync('update', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(backboneSync).toHaveBeenCalled();
            expect(_(backboneSync.calls).any(function(call) {
              return call.args[0] === 'update';
            })).toBeTruthy();
            expect(localsync).toHaveBeenCalled();
            return expect(_(localsync.calls).any(function(call) {
              return call.args[0] === 'update';
            })).toBeTruthy();
          });
        });
        it('merges updates from the server response into the model attributes on server-persisted models', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return dualsync('update', model, {
              success: (function() {
                return ready = true;
              }),
              serverReturnedAttributes: {
                updated: 'by the server'
              }
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            var mergedAttributes;
            mergedAttributes = {
              id: 12,
              position: 'arm',
              updated: 'by the server'
            };
            return expect(localsync.calls[0].args[1].attributes).toEqual(mergedAttributes);
          });
        });
        it('always calls localsync with a backbone model for non-syncronized offline models', function() {
          var newModel, ready, store;
          store = new window.Store('bones/');
          newModel = store.create(new Backbone.Model({
            position: 'Hand'
          }));
          newModel.url = 'bones/';
          console.log(newModel);
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return dualsync('update', newModel, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "success callback should have been called", 100);
          return runs(function() {
            return expect(_(localsync.calls).every(function(call) {
              return call.args[1] instanceof Backbone.Model;
            })).toBeTruthy();
          });
        });
        return it('should merge local model with received response', function() {
          var ready;
          spyOnLocalsync();
          spyOn(window, 'mergeModelWithResponse').andCallThrough();
          ready = false;
          runs(function() {
            return dualsync('update', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            return expect(window.mergeModelWithResponse).toHaveBeenCalled();
          });
        });
      });
      return describe('delete', function() {
        return it('delegates to both localsync and backboneSync', function() {
          var ready;
          spyOnLocalsync();
          ready = false;
          runs(function() {
            return dualsync('delete', model, {
              success: (function() {
                return ready = true;
              })
            });
          });
          waitsFor((function() {
            return ready;
          }), "The success callback should have been called", 100);
          return runs(function() {
            expect(backboneSync).toHaveBeenCalled();
            expect(_(backboneSync.calls).any(function(call) {
              return call.args[0] === 'delete';
            })).toBeTruthy();
            expect(localsync).toHaveBeenCalled();
            return expect(_(localsync.calls).any(function(call) {
              return call.args[0] === 'delete';
            })).toBeTruthy();
          });
        });
      });
    });
    describe('respects the remote only attribute on models', function() {
      it('delegates for remote models', function() {
        var ready;
        ready = false;
        runs(function() {
          model.remote = true;
          return dualsync('create', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          expect(backboneSync).toHaveBeenCalled();
          return expect(backboneSync.calls[0].args[0]).toEqual('create');
        });
      });
      return it('delegates for remote collections', function() {
        var ready;
        ready = false;
        runs(function() {
          collection.remote = true;
          return dualsync('read', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          expect(backboneSync).toHaveBeenCalled();
          return expect(backboneSync.calls[0].args[0]).toEqual('read');
        });
      });
    });
    describe('respects the local only attribute on models', function() {
      it('delegates for local models', function() {
        var ready;
        spyOnLocalsync();
        ready = false;
        runs(function() {
          model.local = true;
          backboneSync.reset();
          return dualsync('update', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          expect(localsync).toHaveBeenCalled();
          return expect(localsync.calls[0].args[0]).toEqual('update');
        });
      });
      return it('delegates for local collections', function() {
        var ready;
        ready = false;
        runs(function() {
          collection.local = true;
          backboneSync.reset();
          return dualsync('delete', model, {
            success: (function() {
              return ready = true;
            })
          });
        });
        waitsFor((function() {
          return ready;
        }), "The success callback should have been called", 100);
        return runs(function() {
          return expect(backboneSync).not.toHaveBeenCalled();
        });
      });
    });
    return it('respects the remote: false sync option', function() {
      var ready;
      ready = false;
      runs(function() {
        backboneSync.reset();
        return dualsync('create', model, {
          success: (function() {
            return ready = true;
          }),
          remote: false
        });
      });
      waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
      return runs(function() {
        return expect(backboneSync).not.toHaveBeenCalled();
      });
    });
  });

  describe('offline storage', function() {
    return it('marks records dirty when options.remote is false, except if the model/collection is marked as local', function() {
      var ready;
      spyOnLocalsync();
      ready = void 0;
      runs(function() {
        ready = false;
        collection.local = true;
        return dualsync('update', model, {
          success: (function() {
            return ready = true;
          }),
          remote: false
        });
      });
      waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
      runs(function() {
        expect(localsync).toHaveBeenCalled();
        expect(localsync.calls.length).toEqual(1);
        return expect(localsync.calls[0].args[2].dirty).toBeFalsy();
      });
      runs(function() {
        localsync.reset();
        ready = false;
        collection.local = false;
        return dualsync('update', model, {
          success: (function() {
            return ready = true;
          }),
          remote: false
        });
      });
      waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
      return runs(function() {
        expect(localsync).toHaveBeenCalled();
        expect(localsync.calls.length).toEqual(1);
        return expect(localsync.calls[0].args[2].dirty).toBeTruthy();
      });
    });
  });

  describe('dualStorage hooks', function() {
    beforeEach(function() {
      var ready;
      model.parseBeforeLocalSave = function() {
        return new Backbone.Model({
          parsedRemote: true
        });
      };
      ready = false;
      runs(function() {
        return dualsync('create', model, {
          success: (function() {
            return ready = true;
          })
        });
      });
      return waitsFor((function() {
        return ready;
      }), "The success callback should have been called", 100);
    });
    return it('filters read responses through parseBeforeLocalSave when defined on the model or collection', function() {
      var response;
      response = null;
      runs(function() {
        return dualsync('read', model, {
          success: function() {
            var callback_args;
            callback_args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return response = callback_args;
          }
        });
      });
      waitsFor((function() {
        return response;
      }), "The success callback should have been called", 100);
      return runs(function() {
        return expect(response[0].get('parsedRemote') || response[1].get('parsedRemote')).toBeTruthy();
      });
    });
  });

  describe('merge local model with remote response', function() {
    var changeTriggered, localModel, newModel, remoteModel, _ref1;
    _ref1 = {}, newModel = _ref1.newModel, localModel = _ref1.localModel, remoteModel = _ref1.remoteModel, changeTriggered = _ref1.changeTriggered;
    changeTriggered = false;
    beforeEach(function() {
      var remoteResponse;
      localModel = new Backbone.Model({
        id: 1,
        name: 'model',
        origin: 'local'
      });
      remoteModel = new Backbone.Model({
        id: 1,
        name: 'model',
        origin: 'remote',
        extra: 'extra'
      });
      Backbone.listenTo(localModel, 'change', function() {
        return changeTriggered = true;
      });
      remoteResponse = remoteModel.toJSON();
      return newModel = mergeModelWithResponse(localModel, remoteResponse);
    });
    afterEach(function() {
      return Backbone.stopListening(localModel, 'change');
    });
    it('should not trigger change event on model', function() {
      return expect(changeTriggered).toBe(false);
    });
    return it('should return a model with updated attributes', function() {
      expect(newModel.get('origin')).toEqual('remote');
      return expect(newModel.get('extra')).toEqual('extra');
    });
  });

}).call(this);
