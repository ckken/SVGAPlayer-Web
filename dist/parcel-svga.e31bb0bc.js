// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/@svgaplus/core/dist/index.js":[function(require,module,exports) {
var define;
/*!
 * SVGAPlus - Enhanced SVGA Player.
 * © LancerComet | # Carry Your World #
 * Version: 1.0.0
 * License: MIT
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SVGAPlus=t():e.SVGAPlus=t()}(window,(function(){return function(e){var t={};function r(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(i,n,function(t){return e[t]}.bind(null,n));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=44)}([function(e,t,r){"use strict";var i,n,o=e.exports=r(1),s=r(14);o.codegen=r(39),o.fetch=r(40),o.path=r(41),o.fs=o.inquire("fs"),o.toArray=function(e){if(e){for(var t=Object.keys(e),r=new Array(t.length),i=0;i<t.length;)r[i]=e[t[i++]];return r}return[]},o.toObject=function(e){for(var t={},r=0;r<e.length;){var i=e[r++],n=e[r++];void 0!==n&&(t[i]=n)}return t};var a=/\\/g,u=/"/g;o.isReserved=function(e){return/^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/.test(e)},o.safeProp=function(e){return!/^[$\w_]+$/.test(e)||o.isReserved(e)?'["'+e.replace(a,"\\\\").replace(u,'\\"')+'"]':"."+e},o.ucFirst=function(e){return e.charAt(0).toUpperCase()+e.substring(1)};var l=/_([a-z])/g;o.camelCase=function(e){return e.substring(0,1)+e.substring(1).replace(l,(function(e,t){return t.toUpperCase()}))},o.compareFieldsById=function(e,t){return e.id-t.id},o.decorateType=function(e,t){if(e.$type)return t&&e.$type.name!==t&&(o.decorateRoot.remove(e.$type),e.$type.name=t,o.decorateRoot.add(e.$type)),e.$type;i||(i=r(16));var n=new i(t||e.name);return o.decorateRoot.add(n),n.ctor=e,Object.defineProperty(e,"$type",{value:n,enumerable:!1}),Object.defineProperty(e.prototype,"$type",{value:n,enumerable:!1}),n};var f=0;o.decorateEnum=function(e){if(e.$type)return e.$type;n||(n=r(2));var t=new n("Enum"+f++,e);return o.decorateRoot.add(t),Object.defineProperty(e,"$type",{value:t,enumerable:!1}),t},Object.defineProperty(o,"decorateRoot",{get:function(){return s.decorated||(s.decorated=new(r(24)))}})},function(e,t,r){"use strict";(function(e){var i=t;function n(e,t,r){for(var i=Object.keys(t),n=0;n<i.length;++n)void 0!==e[i[n]]&&r||(e[i[n]]=t[i[n]]);return e}function o(e){function t(e,r){if(!(this instanceof t))return new t(e,r);Object.defineProperty(this,"message",{get:function(){return e}}),Error.captureStackTrace?Error.captureStackTrace(this,t):Object.defineProperty(this,"stack",{value:(new Error).stack||""}),r&&n(this,r)}return(t.prototype=Object.create(Error.prototype)).constructor=t,Object.defineProperty(t.prototype,"name",{get:function(){return e}}),t.prototype.toString=function(){return this.name+": "+this.message},t}i.asPromise=r(11),i.base64=r(30),i.EventEmitter=r(31),i.float=r(32),i.inquire=r(12),i.utf8=r(33),i.pool=r(34),i.LongBits=r(35),i.global="undefined"!=typeof window&&window||void 0!==e&&e||"undefined"!=typeof self&&self||this,i.emptyArray=Object.freeze?Object.freeze([]):[],i.emptyObject=Object.freeze?Object.freeze({}):{},i.isNode=Boolean(i.global.process&&i.global.process.versions&&i.global.process.versions.node),i.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},i.isString=function(e){return"string"==typeof e||e instanceof String},i.isObject=function(e){return e&&"object"==typeof e},i.isset=i.isSet=function(e,t){var r=e[t];return!(null==r||!e.hasOwnProperty(t))&&("object"!=typeof r||(Array.isArray(r)?r.length:Object.keys(r).length)>0)},i.Buffer=function(){try{var e=i.inquire("buffer").Buffer;return e.prototype.utf8Write?e:null}catch(e){return null}}(),i._Buffer_from=null,i._Buffer_allocUnsafe=null,i.newBuffer=function(e){return"number"==typeof e?i.Buffer?i._Buffer_allocUnsafe(e):new i.Array(e):i.Buffer?i._Buffer_from(e):"undefined"==typeof Uint8Array?e:new Uint8Array(e)},i.Array="undefined"!=typeof Uint8Array?Uint8Array:Array,i.Long=i.global.dcodeIO&&i.global.dcodeIO.Long||i.global.Long||i.inquire("long"),i.key2Re=/^true|false|0|1$/,i.key32Re=/^-?(?:0|[1-9][0-9]*)$/,i.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,i.longToHash=function(e){return e?i.LongBits.from(e).toHash():i.LongBits.zeroHash},i.longFromHash=function(e,t){var r=i.LongBits.fromHash(e);return i.Long?i.Long.fromBits(r.lo,r.hi,t):r.toNumber(Boolean(t))},i.merge=n,i.lcFirst=function(e){return e.charAt(0).toLowerCase()+e.substring(1)},i.newError=o,i.ProtocolError=o("ProtocolError"),i.oneOfGetter=function(e){for(var t={},r=0;r<e.length;++r)t[e[r]]=1;return function(){for(var e=Object.keys(this),r=e.length-1;r>-1;--r)if(1===t[e[r]]&&void 0!==this[e[r]]&&null!==this[e[r]])return e[r]}},i.oneOfSetter=function(e){return function(t){for(var r=0;r<e.length;++r)e[r]!==t&&delete this[e[r]]}},i.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},i._configure=function(){var e=i.Buffer;e?(i._Buffer_from=e.from!==Uint8Array.from&&e.from||function(t,r){return new e(t,r)},i._Buffer_allocUnsafe=e.allocUnsafe||function(t){return new e(t)}):i._Buffer_from=i._Buffer_allocUnsafe=null}}).call(this,r(29))},function(e,t,r){"use strict";e.exports=s;var i=r(3);((s.prototype=Object.create(i.prototype)).constructor=s).className="Enum";var n=r(5),o=r(0);function s(e,t,r,n,o){if(i.call(this,e,r),t&&"object"!=typeof t)throw TypeError("values must be an object");if(this.valuesById={},this.values=Object.create(this.valuesById),this.comment=n,this.comments=o||{},this.reserved=void 0,t)for(var s=Object.keys(t),a=0;a<s.length;++a)"number"==typeof t[s[a]]&&(this.valuesById[this.values[s[a]]=t[s[a]]]=s[a])}s.fromJSON=function(e,t){var r=new s(e,t.values,t.options,t.comment,t.comments);return r.reserved=t.reserved,r},s.prototype.toJSON=function(e){var t=!!e&&Boolean(e.keepComments);return o.toObject(["options",this.options,"values",this.values,"reserved",this.reserved&&this.reserved.length?this.reserved:void 0,"comment",t?this.comment:void 0,"comments",t?this.comments:void 0])},s.prototype.add=function(e,t,r){if(!o.isString(e))throw TypeError("name must be a string");if(!o.isInteger(t))throw TypeError("id must be an integer");if(void 0!==this.values[e])throw Error("duplicate name '"+e+"' in "+this);if(this.isReservedId(t))throw Error("id "+t+" is reserved in "+this);if(this.isReservedName(e))throw Error("name '"+e+"' is reserved in "+this);if(void 0!==this.valuesById[t]){if(!this.options||!this.options.allow_alias)throw Error("duplicate id "+t+" in "+this);this.values[e]=t}else this.valuesById[this.values[e]=t]=e;return this.comments[e]=r||null,this},s.prototype.remove=function(e){if(!o.isString(e))throw TypeError("name must be a string");var t=this.values[e];if(null==t)throw Error("name '"+e+"' does not exist in "+this);return delete this.valuesById[t],delete this.values[e],delete this.comments[e],this},s.prototype.isReservedId=function(e){return n.isReservedId(this.reserved,e)},s.prototype.isReservedName=function(e){return n.isReservedName(this.reserved,e)}},function(e,t,r){"use strict";e.exports=o,o.className="ReflectionObject";var i,n=r(0);function o(e,t){if(!n.isString(e))throw TypeError("name must be a string");if(t&&!n.isObject(t))throw TypeError("options must be an object");this.options=t,this.name=e,this.parent=null,this.resolved=!1,this.comment=null,this.filename=null}Object.defineProperties(o.prototype,{root:{get:function(){for(var e=this;null!==e.parent;)e=e.parent;return e}},fullName:{get:function(){for(var e=[this.name],t=this.parent;t;)e.unshift(t.name),t=t.parent;return e.join(".")}}}),o.prototype.toJSON=function(){throw Error()},o.prototype.onAdd=function(e){this.parent&&this.parent!==e&&this.parent.remove(this),this.parent=e,this.resolved=!1;var t=e.root;t instanceof i&&t._handleAdd(this)},o.prototype.onRemove=function(e){var t=e.root;t instanceof i&&t._handleRemove(this),this.parent=null,this.resolved=!1},o.prototype.resolve=function(){return this.resolved||this.root instanceof i&&(this.resolved=!0),this},o.prototype.getOption=function(e){if(this.options)return this.options[e]},o.prototype.setOption=function(e,t,r){return r&&this.options&&void 0!==this.options[e]||((this.options||(this.options={}))[e]=t),this},o.prototype.setOptions=function(e,t){if(e)for(var r=Object.keys(e),i=0;i<r.length;++i)this.setOption(r[i],e[r[i]],t);return this},o.prototype.toString=function(){var e=this.constructor.className,t=this.fullName;return t.length?e+" "+t:e},o._configure=function(e){i=e}},function(e,t,r){"use strict";e.exports=l;var i=r(3);((l.prototype=Object.create(i.prototype)).constructor=l).className="Field";var n,o=r(2),s=r(6),a=r(0),u=/^required|optional|repeated$/;function l(e,t,r,n,o,l,f){if(a.isObject(n)?(f=o,l=n,n=o=void 0):a.isObject(o)&&(f=l,l=o,o=void 0),i.call(this,e,l),!a.isInteger(t)||t<0)throw TypeError("id must be a non-negative integer");if(!a.isString(r))throw TypeError("type must be a string");if(void 0!==n&&!u.test(n=n.toString().toLowerCase()))throw TypeError("rule must be a string rule");if(void 0!==o&&!a.isString(o))throw TypeError("extend must be a string");this.rule=n&&"optional"!==n?n:void 0,this.type=r,this.id=t,this.extend=o||void 0,this.required="required"===n,this.optional=!this.required,this.repeated="repeated"===n,this.map=!1,this.message=null,this.partOf=null,this.typeDefault=null,this.defaultValue=null,this.long=!!a.Long&&void 0!==s.long[r],this.bytes="bytes"===r,this.resolvedType=null,this.extensionField=null,this.declaringField=null,this._packed=null,this.comment=f}l.fromJSON=function(e,t){return new l(e,t.id,t.type,t.rule,t.extend,t.options,t.comment)},Object.defineProperty(l.prototype,"packed",{get:function(){return null===this._packed&&(this._packed=!1!==this.getOption("packed")),this._packed}}),l.prototype.setOption=function(e,t,r){return"packed"===e&&(this._packed=null),i.prototype.setOption.call(this,e,t,r)},l.prototype.toJSON=function(e){var t=!!e&&Boolean(e.keepComments);return a.toObject(["rule","optional"!==this.rule&&this.rule||void 0,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options,"comment",t?this.comment:void 0])},l.prototype.resolve=function(){if(this.resolved)return this;if(void 0===(this.typeDefault=s.defaults[this.type])&&(this.resolvedType=(this.declaringField?this.declaringField.parent:this.parent).lookupTypeOrEnum(this.type),this.resolvedType instanceof n?this.typeDefault=null:this.typeDefault=this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]),this.options&&null!=this.options.default&&(this.typeDefault=this.options.default,this.resolvedType instanceof o&&"string"==typeof this.typeDefault&&(this.typeDefault=this.resolvedType.values[this.typeDefault])),this.options&&(!0!==this.options.packed&&(void 0===this.options.packed||!this.resolvedType||this.resolvedType instanceof o)||delete this.options.packed,Object.keys(this.options).length||(this.options=void 0)),this.long)this.typeDefault=a.Long.fromNumber(this.typeDefault,"u"===this.type.charAt(0)),Object.freeze&&Object.freeze(this.typeDefault);else if(this.bytes&&"string"==typeof this.typeDefault){var e;a.base64.test(this.typeDefault)?a.base64.decode(this.typeDefault,e=a.newBuffer(a.base64.length(this.typeDefault)),0):a.utf8.write(this.typeDefault,e=a.newBuffer(a.utf8.length(this.typeDefault)),0),this.typeDefault=e}return this.map?this.defaultValue=a.emptyObject:this.repeated?this.defaultValue=a.emptyArray:this.defaultValue=this.typeDefault,this.parent instanceof n&&(this.parent.ctor.prototype[this.name]=this.defaultValue),i.prototype.resolve.call(this)},l.d=function(e,t,r,i){return"function"==typeof t?t=a.decorateType(t).name:t&&"object"==typeof t&&(t=a.decorateEnum(t).name),function(n,o){a.decorateType(n.constructor).add(new l(o,e,t,r,{default:i}))}},l._configure=function(e){n=e}},function(e,t,r){"use strict";e.exports=f;var i=r(3);((f.prototype=Object.create(i.prototype)).constructor=f).className="Namespace";var n,o,s,a=r(4),u=r(0);function l(e,t){if(e&&e.length){for(var r={},i=0;i<e.length;++i)r[e[i].name]=e[i].toJSON(t);return r}}function f(e,t){i.call(this,e,t),this.nested=void 0,this._nestedArray=null}function h(e){return e._nestedArray=null,e}f.fromJSON=function(e,t){return new f(e,t.options).addJSON(t.nested)},f.arrayToJSON=l,f.isReservedId=function(e,t){if(e)for(var r=0;r<e.length;++r)if("string"!=typeof e[r]&&e[r][0]<=t&&e[r][1]>=t)return!0;return!1},f.isReservedName=function(e,t){if(e)for(var r=0;r<e.length;++r)if(e[r]===t)return!0;return!1},Object.defineProperty(f.prototype,"nestedArray",{get:function(){return this._nestedArray||(this._nestedArray=u.toArray(this.nested))}}),f.prototype.toJSON=function(e){return u.toObject(["options",this.options,"nested",l(this.nestedArray,e)])},f.prototype.addJSON=function(e){if(e)for(var t,r=Object.keys(e),i=0;i<r.length;++i)t=e[r[i]],this.add((void 0!==t.fields?n.fromJSON:void 0!==t.values?s.fromJSON:void 0!==t.methods?o.fromJSON:void 0!==t.id?a.fromJSON:f.fromJSON)(r[i],t));return this},f.prototype.get=function(e){return this.nested&&this.nested[e]||null},f.prototype.getEnum=function(e){if(this.nested&&this.nested[e]instanceof s)return this.nested[e].values;throw Error("no such enum: "+e)},f.prototype.add=function(e){if(!(e instanceof a&&void 0!==e.extend||e instanceof n||e instanceof s||e instanceof o||e instanceof f))throw TypeError("object must be a valid nested object");if(this.nested){var t=this.get(e.name);if(t){if(!(t instanceof f&&e instanceof f)||t instanceof n||t instanceof o)throw Error("duplicate name '"+e.name+"' in "+this);for(var r=t.nestedArray,i=0;i<r.length;++i)e.add(r[i]);this.remove(t),this.nested||(this.nested={}),e.setOptions(t.options,!0)}}else this.nested={};return this.nested[e.name]=e,e.onAdd(this),h(this)},f.prototype.remove=function(e){if(!(e instanceof i))throw TypeError("object must be a ReflectionObject");if(e.parent!==this)throw Error(e+" is not a member of "+this);return delete this.nested[e.name],Object.keys(this.nested).length||(this.nested=void 0),e.onRemove(this),h(this)},f.prototype.define=function(e,t){if(u.isString(e))e=e.split(".");else if(!Array.isArray(e))throw TypeError("illegal path");if(e&&e.length&&""===e[0])throw Error("path must be relative");for(var r=this;e.length>0;){var i=e.shift();if(r.nested&&r.nested[i]){if(!((r=r.nested[i])instanceof f))throw Error("path conflicts with non-namespace objects")}else r.add(r=new f(i))}return t&&r.addJSON(t),r},f.prototype.resolveAll=function(){for(var e=this.nestedArray,t=0;t<e.length;)e[t]instanceof f?e[t++].resolveAll():e[t++].resolve();return this.resolve()},f.prototype.lookup=function(e,t,r){if("boolean"==typeof t?(r=t,t=void 0):t&&!Array.isArray(t)&&(t=[t]),u.isString(e)&&e.length){if("."===e)return this.root;e=e.split(".")}else if(!e.length)return this;if(""===e[0])return this.root.lookup(e.slice(1),t);var i=this.get(e[0]);if(i){if(1===e.length){if(!t||t.indexOf(i.constructor)>-1)return i}else if(i instanceof f&&(i=i.lookup(e.slice(1),t,!0)))return i}else for(var n=0;n<this.nestedArray.length;++n)if(this._nestedArray[n]instanceof f&&(i=this._nestedArray[n].lookup(e,t,!0)))return i;return null===this.parent||r?null:this.parent.lookup(e,t)},f.prototype.lookupType=function(e){var t=this.lookup(e,[n]);if(!t)throw Error("no such type: "+e);return t},f.prototype.lookupEnum=function(e){var t=this.lookup(e,[s]);if(!t)throw Error("no such Enum '"+e+"' in "+this);return t},f.prototype.lookupTypeOrEnum=function(e){var t=this.lookup(e,[n,s]);if(!t)throw Error("no such Type or Enum '"+e+"' in "+this);return t},f.prototype.lookupService=function(e){var t=this.lookup(e,[o]);if(!t)throw Error("no such Service '"+e+"' in "+this);return t},f._configure=function(e,t,r){n=e,o=t,s=r}},function(e,t,r){"use strict";var i=t,n=r(0),o=["double","float","int32","uint32","sint32","fixed32","sfixed32","int64","uint64","sint64","fixed64","sfixed64","bool","string","bytes"];function s(e,t){var r=0,i={};for(t|=0;r<e.length;)i[o[r+t]]=e[r++];return i}i.basic=s([1,5,0,0,0,5,5,0,0,0,1,1,0,2,2]),i.defaults=s([0,0,0,0,0,0,0,0,0,0,0,0,!1,"",n.emptyArray,null]),i.long=s([0,0,0,1,1],7),i.mapKey=s([0,0,0,5,5,0,0,0,1,1,0,2],2),i.packed=s([1,5,0,0,0,5,5,0,0,0,1,1,0])},function(e,t,r){"use strict";e.exports=h;var i,n=r(1),o=n.LongBits,s=n.base64,a=n.utf8;function u(e,t,r){this.fn=e,this.len=t,this.next=void 0,this.val=r}function l(){}function f(e){this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}function h(){this.len=0,this.head=new u(l,0,0),this.tail=this.head,this.states=null}function c(e,t,r){t[r]=255&e}function p(e,t){this.len=e,this.next=void 0,this.val=t}function d(e,t,r){for(;e.hi;)t[r++]=127&e.lo|128,e.lo=(e.lo>>>7|e.hi<<25)>>>0,e.hi>>>=7;for(;e.lo>127;)t[r++]=127&e.lo|128,e.lo=e.lo>>>7;t[r++]=e.lo}function y(e,t,r){t[r]=255&e,t[r+1]=e>>>8&255,t[r+2]=e>>>16&255,t[r+3]=e>>>24}h.create=n.Buffer?function(){return(h.create=function(){return new i})()}:function(){return new h},h.alloc=function(e){return new n.Array(e)},n.Array!==Array&&(h.alloc=n.pool(h.alloc,n.Array.prototype.subarray)),h.prototype._push=function(e,t,r){return this.tail=this.tail.next=new u(e,t,r),this.len+=t,this},p.prototype=Object.create(u.prototype),p.prototype.fn=function(e,t,r){for(;e>127;)t[r++]=127&e|128,e>>>=7;t[r]=e},h.prototype.uint32=function(e){return this.len+=(this.tail=this.tail.next=new p((e>>>=0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this},h.prototype.int32=function(e){return e<0?this._push(d,10,o.fromNumber(e)):this.uint32(e)},h.prototype.sint32=function(e){return this.uint32((e<<1^e>>31)>>>0)},h.prototype.uint64=function(e){var t=o.from(e);return this._push(d,t.length(),t)},h.prototype.int64=h.prototype.uint64,h.prototype.sint64=function(e){var t=o.from(e).zzEncode();return this._push(d,t.length(),t)},h.prototype.bool=function(e){return this._push(c,1,e?1:0)},h.prototype.fixed32=function(e){return this._push(y,4,e>>>0)},h.prototype.sfixed32=h.prototype.fixed32,h.prototype.fixed64=function(e){var t=o.from(e);return this._push(y,4,t.lo)._push(y,4,t.hi)},h.prototype.sfixed64=h.prototype.fixed64,h.prototype.float=function(e){return this._push(n.float.writeFloatLE,4,e)},h.prototype.double=function(e){return this._push(n.float.writeDoubleLE,8,e)};var v=n.Array.prototype.set?function(e,t,r){t.set(e,r)}:function(e,t,r){for(var i=0;i<e.length;++i)t[r+i]=e[i]};h.prototype.bytes=function(e){var t=e.length>>>0;if(!t)return this._push(c,1,0);if(n.isString(e)){var r=h.alloc(t=s.length(e));s.decode(e,r,0),e=r}return this.uint32(t)._push(v,t,e)},h.prototype.string=function(e){var t=a.length(e);return t?this.uint32(t)._push(a.write,t,e):this._push(c,1,0)},h.prototype.fork=function(){return this.states=new f(this),this.head=this.tail=new u(l,0,0),this.len=0,this},h.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new u(l,0,0),this.len=0),this},h.prototype.ldelim=function(){var e=this.head,t=this.tail,r=this.len;return this.reset().uint32(r),r&&(this.tail.next=e.next,this.tail=t,this.len+=r),this},h.prototype.finish=function(){for(var e=this.head.next,t=this.constructor.alloc(this.len),r=0;e;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t},h._configure=function(e){i=e}},function(e,t,r){"use strict";e.exports=u;var i,n=r(1),o=n.LongBits,s=n.utf8;function a(e,t){return RangeError("index out of range: "+e.pos+" + "+(t||1)+" > "+e.len)}function u(e){this.buf=e,this.pos=0,this.len=e.length}var l,f="undefined"!=typeof Uint8Array?function(e){if(e instanceof Uint8Array||Array.isArray(e))return new u(e);throw Error("illegal buffer")}:function(e){if(Array.isArray(e))return new u(e);throw Error("illegal buffer")};function h(){var e=new o(0,0),t=0;if(!(this.len-this.pos>4)){for(;t<3;++t){if(this.pos>=this.len)throw a(this);if(e.lo=(e.lo|(127&this.buf[this.pos])<<7*t)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(127&this.buf[this.pos++])<<7*t)>>>0,e}for(;t<4;++t)if(e.lo=(e.lo|(127&this.buf[this.pos])<<7*t)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(127&this.buf[this.pos])<<28)>>>0,e.hi=(e.hi|(127&this.buf[this.pos])>>4)>>>0,this.buf[this.pos++]<128)return e;if(t=0,this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(127&this.buf[this.pos])<<7*t+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw a(this);if(e.hi=(e.hi|(127&this.buf[this.pos])<<7*t+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}function c(e,t){return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0}function p(){if(this.pos+8>this.len)throw a(this,8);return new o(c(this.buf,this.pos+=4),c(this.buf,this.pos+=4))}u.create=n.Buffer?function(e){return(u.create=function(e){return n.Buffer.isBuffer(e)?new i(e):f(e)})(e)}:f,u.prototype._slice=n.Array.prototype.subarray||n.Array.prototype.slice,u.prototype.uint32=(l=4294967295,function(){if(l=(127&this.buf[this.pos])>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(127&this.buf[this.pos])<<7)>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(127&this.buf[this.pos])<<14)>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(127&this.buf[this.pos])<<21)>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(15&this.buf[this.pos])<<28)>>>0,this.buf[this.pos++]<128)return l;if((this.pos+=5)>this.len)throw this.pos=this.len,a(this,10);return l}),u.prototype.int32=function(){return 0|this.uint32()},u.prototype.sint32=function(){var e=this.uint32();return e>>>1^-(1&e)|0},u.prototype.bool=function(){return 0!==this.uint32()},u.prototype.fixed32=function(){if(this.pos+4>this.len)throw a(this,4);return c(this.buf,this.pos+=4)},u.prototype.sfixed32=function(){if(this.pos+4>this.len)throw a(this,4);return 0|c(this.buf,this.pos+=4)},u.prototype.float=function(){if(this.pos+4>this.len)throw a(this,4);var e=n.float.readFloatLE(this.buf,this.pos);return this.pos+=4,e},u.prototype.double=function(){if(this.pos+8>this.len)throw a(this,4);var e=n.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,e},u.prototype.bytes=function(){var e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw a(this,e);return this.pos+=e,Array.isArray(this.buf)?this.buf.slice(t,r):t===r?new this.buf.constructor(0):this._slice.call(this.buf,t,r)},u.prototype.string=function(){var e=this.bytes();return s.read(e,0,e.length)},u.prototype.skip=function(e){if("number"==typeof e){if(this.pos+e>this.len)throw a(this,e);this.pos+=e}else do{if(this.pos>=this.len)throw a(this)}while(128&this.buf[this.pos++]);return this},u.prototype.skipType=function(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;4!=(e=7&this.uint32());)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+e+" at offset "+this.pos)}return this},u._configure=function(e){i=e;var t=n.Long?"toLong":"toNumber";n.merge(u.prototype,{int64:function(){return h.call(this)[t](!1)},uint64:function(){return h.call(this)[t](!0)},sint64:function(){return h.call(this).zzDecode()[t](!1)},fixed64:function(){return p.call(this)[t](!0)},sfixed64:function(){return p.call(this)[t](!1)}})}},function(e,t,r){"use strict";e.exports=s;var i=r(3);((s.prototype=Object.create(i.prototype)).constructor=s).className="OneOf";var n=r(4),o=r(0);function s(e,t,r,n){if(Array.isArray(t)||(r=t,t=void 0),i.call(this,e,r),void 0!==t&&!Array.isArray(t))throw TypeError("fieldNames must be an Array");this.oneof=t||[],this.fieldsArray=[],this.comment=n}function a(e){if(e.parent)for(var t=0;t<e.fieldsArray.length;++t)e.fieldsArray[t].parent||e.parent.add(e.fieldsArray[t])}s.fromJSON=function(e,t){return new s(e,t.oneof,t.options,t.comment)},s.prototype.toJSON=function(e){var t=!!e&&Boolean(e.keepComments);return o.toObject(["options",this.options,"oneof",this.oneof,"comment",t?this.comment:void 0])},s.prototype.add=function(e){if(!(e instanceof n))throw TypeError("field must be a Field");return e.parent&&e.parent!==this.parent&&e.parent.remove(e),this.oneof.push(e.name),this.fieldsArray.push(e),e.partOf=this,a(this),this},s.prototype.remove=function(e){if(!(e instanceof n))throw TypeError("field must be a Field");var t=this.fieldsArray.indexOf(e);if(t<0)throw Error(e+" is not a member of "+this);return this.fieldsArray.splice(t,1),(t=this.oneof.indexOf(e.name))>-1&&this.oneof.splice(t,1),e.partOf=null,this},s.prototype.onAdd=function(e){i.prototype.onAdd.call(this,e);for(var t=0;t<this.oneof.length;++t){var r=e.get(this.oneof[t]);r&&!r.partOf&&(r.partOf=this,this.fieldsArray.push(r))}a(this)},s.prototype.onRemove=function(e){for(var t,r=0;r<this.fieldsArray.length;++r)(t=this.fieldsArray[r]).parent&&t.parent.remove(t);i.prototype.onRemove.call(this,e)},s.d=function(){for(var e=new Array(arguments.length),t=0;t<arguments.length;)e[t]=arguments[t++];return function(t,r){o.decorateType(t.constructor).add(new s(r,e)),Object.defineProperty(t,r,{get:o.oneOfGetter(e),set:o.oneOfSetter(e)})}}},function(e,t,r){"use strict";e.exports=n;var i=r(1);function n(e){if(e)for(var t=Object.keys(e),r=0;r<t.length;++r)this[t[r]]=e[t[r]]}n.create=function(e){return this.$type.create(e)},n.encode=function(e,t){return this.$type.encode(e,t)},n.encodeDelimited=function(e,t){return this.$type.encodeDelimited(e,t)},n.decode=function(e){return this.$type.decode(e)},n.decodeDelimited=function(e){return this.$type.decodeDelimited(e)},n.verify=function(e){return this.$type.verify(e)},n.fromObject=function(e){return this.$type.fromObject(e)},n.toObject=function(e,t){return this.$type.toObject(e,t)},n.prototype.toJSON=function(){return this.$type.toObject(this,i.toJSONOptions)}},function(e,t,r){"use strict";e.exports=function(e,t){var r=new Array(arguments.length-1),i=0,n=2,o=!0;for(;n<arguments.length;)r[i++]=arguments[n++];return new Promise((function(n,s){r[i]=function(e){if(o)if(o=!1,e)s(e);else{for(var t=new Array(arguments.length-1),r=0;r<t.length;)t[r++]=arguments[r];n.apply(null,t)}};try{e.apply(t||null,r)}catch(e){o&&(o=!1,s(e))}}))}},function(module,exports,__webpack_require__){"use strict";function inquire(moduleName){try{var mod=eval("quire".replace(/^/,"re"))(moduleName);if(mod&&(mod.length||Object.keys(mod).length))return mod}catch(e){}return null}module.exports=inquire},function(e,t,r){"use strict";t.Service=r(38)},function(e,t,r){"use strict";e.exports={}},function(e,t,r){"use strict";e.exports=function(e){for(var t,r=o.codegen(["m","w"],e.name+"$encode")("if(!w)")("w=Writer.create()"),a=e.fieldsArray.slice().sort(o.compareFieldsById),u=0;u<a.length;++u){var l=a[u].resolve(),f=e._fieldsArray.indexOf(l),h=l.resolvedType instanceof i?"int32":l.type,c=n.basic[h];t="m"+o.safeProp(l.name),l.map?(r("if(%s!=null&&m.hasOwnProperty(%j)){",t,l.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){",t)("w.uint32(%i).fork().uint32(%i).%s(ks[i])",(l.id<<3|2)>>>0,8|n.mapKey[l.keyType],l.keyType),void 0===c?r("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()",f,t):r(".uint32(%i).%s(%s[ks[i]]).ldelim()",16|c,h,t),r("}")("}")):l.repeated?(r("if(%s!=null&&%s.length){",t,t),l.packed&&void 0!==n.packed[h]?r("w.uint32(%i).fork()",(l.id<<3|2)>>>0)("for(var i=0;i<%s.length;++i)",t)("w.%s(%s[i])",h,t)("w.ldelim()"):(r("for(var i=0;i<%s.length;++i)",t),void 0===c?s(r,l,f,t+"[i]"):r("w.uint32(%i).%s(%s[i])",(l.id<<3|c)>>>0,h,t)),r("}")):(l.optional&&r("if(%s!=null&&m.hasOwnProperty(%j))",t,l.name),void 0===c?s(r,l,f,t):r("w.uint32(%i).%s(%s)",(l.id<<3|c)>>>0,h,t))}return r("return w")};var i=r(2),n=r(6),o=r(0);function s(e,t,r,i){return t.resolvedType.group?e("types[%i].encode(%s,w.uint32(%i)).uint32(%i)",r,i,(t.id<<3|3)>>>0,(t.id<<3|4)>>>0):e("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()",r,i,(t.id<<3|2)>>>0)}},function(e,t,r){"use strict";e.exports=g;var i=r(5);((g.prototype=Object.create(i.prototype)).constructor=g).className="Type";var n=r(2),o=r(9),s=r(4),a=r(17),u=r(18),l=r(10),f=r(8),h=r(7),c=r(0),p=r(15),d=r(20),y=r(21),v=r(22),m=r(23);function g(e,t){i.call(this,e,t),this.fields={},this.oneofs=void 0,this.extensions=void 0,this.reserved=void 0,this.group=void 0,this._fieldsById=null,this._fieldsArray=null,this._oneofsArray=null,this._ctor=null}function b(e){return e._fieldsById=e._fieldsArray=e._oneofsArray=null,delete e.encode,delete e.decode,delete e.verify,e}Object.defineProperties(g.prototype,{fieldsById:{get:function(){if(this._fieldsById)return this._fieldsById;this._fieldsById={};for(var e=Object.keys(this.fields),t=0;t<e.length;++t){var r=this.fields[e[t]],i=r.id;if(this._fieldsById[i])throw Error("duplicate id "+i+" in "+this);this._fieldsById[i]=r}return this._fieldsById}},fieldsArray:{get:function(){return this._fieldsArray||(this._fieldsArray=c.toArray(this.fields))}},oneofsArray:{get:function(){return this._oneofsArray||(this._oneofsArray=c.toArray(this.oneofs))}},ctor:{get:function(){return this._ctor||(this.ctor=g.generateConstructor(this)())},set:function(e){var t=e.prototype;t instanceof l||((e.prototype=new l).constructor=e,c.merge(e.prototype,t)),e.$type=e.prototype.$type=this,c.merge(e,l,!0),this._ctor=e;for(var r=0;r<this.fieldsArray.length;++r)this._fieldsArray[r].resolve();var i={};for(r=0;r<this.oneofsArray.length;++r)i[this._oneofsArray[r].resolve().name]={get:c.oneOfGetter(this._oneofsArray[r].oneof),set:c.oneOfSetter(this._oneofsArray[r].oneof)};r&&Object.defineProperties(e.prototype,i)}}}),g.generateConstructor=function(e){for(var t,r=c.codegen(["p"],e.name),i=0;i<e.fieldsArray.length;++i)(t=e._fieldsArray[i]).map?r("this%s={}",c.safeProp(t.name)):t.repeated&&r("this%s=[]",c.safeProp(t.name));return r("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")},g.fromJSON=function(e,t){var r=new g(e,t.options);r.extensions=t.extensions,r.reserved=t.reserved;for(var l=Object.keys(t.fields),f=0;f<l.length;++f)r.add((void 0!==t.fields[l[f]].keyType?a.fromJSON:s.fromJSON)(l[f],t.fields[l[f]]));if(t.oneofs)for(l=Object.keys(t.oneofs),f=0;f<l.length;++f)r.add(o.fromJSON(l[f],t.oneofs[l[f]]));if(t.nested)for(l=Object.keys(t.nested),f=0;f<l.length;++f){var h=t.nested[l[f]];r.add((void 0!==h.id?s.fromJSON:void 0!==h.fields?g.fromJSON:void 0!==h.values?n.fromJSON:void 0!==h.methods?u.fromJSON:i.fromJSON)(l[f],h))}return t.extensions&&t.extensions.length&&(r.extensions=t.extensions),t.reserved&&t.reserved.length&&(r.reserved=t.reserved),t.group&&(r.group=!0),t.comment&&(r.comment=t.comment),r},g.prototype.toJSON=function(e){var t=i.prototype.toJSON.call(this,e),r=!!e&&Boolean(e.keepComments);return c.toObject(["options",t&&t.options||void 0,"oneofs",i.arrayToJSON(this.oneofsArray,e),"fields",i.arrayToJSON(this.fieldsArray.filter((function(e){return!e.declaringField})),e)||{},"extensions",this.extensions&&this.extensions.length?this.extensions:void 0,"reserved",this.reserved&&this.reserved.length?this.reserved:void 0,"group",this.group||void 0,"nested",t&&t.nested||void 0,"comment",r?this.comment:void 0])},g.prototype.resolveAll=function(){for(var e=this.fieldsArray,t=0;t<e.length;)e[t++].resolve();var r=this.oneofsArray;for(t=0;t<r.length;)r[t++].resolve();return i.prototype.resolveAll.call(this)},g.prototype.get=function(e){return this.fields[e]||this.oneofs&&this.oneofs[e]||this.nested&&this.nested[e]||null},g.prototype.add=function(e){if(this.get(e.name))throw Error("duplicate name '"+e.name+"' in "+this);if(e instanceof s&&void 0===e.extend){if(this._fieldsById?this._fieldsById[e.id]:this.fieldsById[e.id])throw Error("duplicate id "+e.id+" in "+this);if(this.isReservedId(e.id))throw Error("id "+e.id+" is reserved in "+this);if(this.isReservedName(e.name))throw Error("name '"+e.name+"' is reserved in "+this);return e.parent&&e.parent.remove(e),this.fields[e.name]=e,e.message=this,e.onAdd(this),b(this)}return e instanceof o?(this.oneofs||(this.oneofs={}),this.oneofs[e.name]=e,e.onAdd(this),b(this)):i.prototype.add.call(this,e)},g.prototype.remove=function(e){if(e instanceof s&&void 0===e.extend){if(!this.fields||this.fields[e.name]!==e)throw Error(e+" is not a member of "+this);return delete this.fields[e.name],e.parent=null,e.onRemove(this),b(this)}if(e instanceof o){if(!this.oneofs||this.oneofs[e.name]!==e)throw Error(e+" is not a member of "+this);return delete this.oneofs[e.name],e.parent=null,e.onRemove(this),b(this)}return i.prototype.remove.call(this,e)},g.prototype.isReservedId=function(e){return i.isReservedId(this.reserved,e)},g.prototype.isReservedName=function(e){return i.isReservedName(this.reserved,e)},g.prototype.create=function(e){return new this.ctor(e)},g.prototype.setup=function(){for(var e=this.fullName,t=[],r=0;r<this.fieldsArray.length;++r)t.push(this._fieldsArray[r].resolve().resolvedType);this.encode=p(this)({Writer:h,types:t,util:c}),this.decode=d(this)({Reader:f,types:t,util:c}),this.verify=y(this)({types:t,util:c}),this.fromObject=v.fromObject(this)({types:t,util:c}),this.toObject=v.toObject(this)({types:t,util:c});var i=m[e];if(i){var n=Object.create(this);n.fromObject=this.fromObject,this.fromObject=i.fromObject.bind(n),n.toObject=this.toObject,this.toObject=i.toObject.bind(n)}return this},g.prototype.encode=function(e,t){return this.setup().encode(e,t)},g.prototype.encodeDelimited=function(e,t){return this.encode(e,t&&t.len?t.fork():t).ldelim()},g.prototype.decode=function(e,t){return this.setup().decode(e,t)},g.prototype.decodeDelimited=function(e){return e instanceof f||(e=f.create(e)),this.decode(e,e.uint32())},g.prototype.verify=function(e){return this.setup().verify(e)},g.prototype.fromObject=function(e){return this.setup().fromObject(e)},g.prototype.toObject=function(e,t){return this.setup().toObject(e,t)},g.d=function(e){return function(t){c.decorateType(t,e)}}},function(e,t,r){"use strict";e.exports=s;var i=r(4);((s.prototype=Object.create(i.prototype)).constructor=s).className="MapField";var n=r(6),o=r(0);function s(e,t,r,n,s,a){if(i.call(this,e,t,n,void 0,void 0,s,a),!o.isString(r))throw TypeError("keyType must be a string");this.keyType=r,this.resolvedKeyType=null,this.map=!0}s.fromJSON=function(e,t){return new s(e,t.id,t.keyType,t.type,t.options,t.comment)},s.prototype.toJSON=function(e){var t=!!e&&Boolean(e.keepComments);return o.toObject(["keyType",this.keyType,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options,"comment",t?this.comment:void 0])},s.prototype.resolve=function(){if(this.resolved)return this;if(void 0===n.mapKey[this.keyType])throw Error("invalid key type: "+this.keyType);return i.prototype.resolve.call(this)},s.d=function(e,t,r){return"function"==typeof r?r=o.decorateType(r).name:r&&"object"==typeof r&&(r=o.decorateEnum(r).name),function(i,n){o.decorateType(i.constructor).add(new s(n,e,t,r))}}},function(e,t,r){"use strict";e.exports=a;var i=r(5);((a.prototype=Object.create(i.prototype)).constructor=a).className="Service";var n=r(19),o=r(0),s=r(13);function a(e,t){i.call(this,e,t),this.methods={},this._methodsArray=null}function u(e){return e._methodsArray=null,e}a.fromJSON=function(e,t){var r=new a(e,t.options);if(t.methods)for(var i=Object.keys(t.methods),o=0;o<i.length;++o)r.add(n.fromJSON(i[o],t.methods[i[o]]));return t.nested&&r.addJSON(t.nested),r.comment=t.comment,r},a.prototype.toJSON=function(e){var t=i.prototype.toJSON.call(this,e),r=!!e&&Boolean(e.keepComments);return o.toObject(["options",t&&t.options||void 0,"methods",i.arrayToJSON(this.methodsArray,e)||{},"nested",t&&t.nested||void 0,"comment",r?this.comment:void 0])},Object.defineProperty(a.prototype,"methodsArray",{get:function(){return this._methodsArray||(this._methodsArray=o.toArray(this.methods))}}),a.prototype.get=function(e){return this.methods[e]||i.prototype.get.call(this,e)},a.prototype.resolveAll=function(){for(var e=this.methodsArray,t=0;t<e.length;++t)e[t].resolve();return i.prototype.resolve.call(this)},a.prototype.add=function(e){if(this.get(e.name))throw Error("duplicate name '"+e.name+"' in "+this);return e instanceof n?(this.methods[e.name]=e,e.parent=this,u(this)):i.prototype.add.call(this,e)},a.prototype.remove=function(e){if(e instanceof n){if(this.methods[e.name]!==e)throw Error(e+" is not a member of "+this);return delete this.methods[e.name],e.parent=null,u(this)}return i.prototype.remove.call(this,e)},a.prototype.create=function(e,t,r){for(var i,n=new s.Service(e,t,r),a=0;a<this.methodsArray.length;++a){var u=o.lcFirst((i=this._methodsArray[a]).resolve().name).replace(/[^$\w_]/g,"");n[u]=o.codegen(["r","c"],o.isReserved(u)?u+"_":u)("return this.rpcCall(m,q,s,r,c)")({m:i,q:i.resolvedRequestType.ctor,s:i.resolvedResponseType.ctor})}return n}},function(e,t,r){"use strict";e.exports=o;var i=r(3);((o.prototype=Object.create(i.prototype)).constructor=o).className="Method";var n=r(0);function o(e,t,r,o,s,a,u,l){if(n.isObject(s)?(u=s,s=a=void 0):n.isObject(a)&&(u=a,a=void 0),void 0!==t&&!n.isString(t))throw TypeError("type must be a string");if(!n.isString(r))throw TypeError("requestType must be a string");if(!n.isString(o))throw TypeError("responseType must be a string");i.call(this,e,u),this.type=t||"rpc",this.requestType=r,this.requestStream=!!s||void 0,this.responseType=o,this.responseStream=!!a||void 0,this.resolvedRequestType=null,this.resolvedResponseType=null,this.comment=l}o.fromJSON=function(e,t){return new o(e,t.type,t.requestType,t.responseType,t.requestStream,t.responseStream,t.options,t.comment)},o.prototype.toJSON=function(e){var t=!!e&&Boolean(e.keepComments);return n.toObject(["type","rpc"!==this.type&&this.type||void 0,"requestType",this.requestType,"requestStream",this.requestStream,"responseType",this.responseType,"responseStream",this.responseStream,"options",this.options,"comment",t?this.comment:void 0])},o.prototype.resolve=function(){return this.resolved?this:(this.resolvedRequestType=this.parent.lookupType(this.requestType),this.resolvedResponseType=this.parent.lookupType(this.responseType),i.prototype.resolve.call(this))}},function(e,t,r){"use strict";e.exports=function(e){var t=o.codegen(["r","l"],e.name+"$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor"+(e.fieldsArray.filter((function(e){return e.map})).length?",k":""))("while(r.pos<c){")("var t=r.uint32()");e.group&&t("if((t&7)===4)")("break");t("switch(t>>>3){");for(var r=0;r<e.fieldsArray.length;++r){var a=e._fieldsArray[r].resolve(),u=a.resolvedType instanceof i?"int32":a.type,l="m"+o.safeProp(a.name);t("case %i:",a.id),a.map?(t("r.skip().pos++")("if(%s===util.emptyObject)",l)("%s={}",l)("k=r.%s()",a.keyType)("r.pos++"),void 0!==n.long[a.keyType]?void 0===n.basic[u]?t('%s[typeof k==="object"?util.longToHash(k):k]=types[%i].decode(r,r.uint32())',l,r):t('%s[typeof k==="object"?util.longToHash(k):k]=r.%s()',l,u):void 0===n.basic[u]?t("%s[k]=types[%i].decode(r,r.uint32())",l,r):t("%s[k]=r.%s()",l,u)):a.repeated?(t("if(!(%s&&%s.length))",l,l)("%s=[]",l),void 0!==n.packed[u]&&t("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())",l,u)("}else"),void 0===n.basic[u]?t(a.resolvedType.group?"%s.push(types[%i].decode(r))":"%s.push(types[%i].decode(r,r.uint32()))",l,r):t("%s.push(r.%s())",l,u)):void 0===n.basic[u]?t(a.resolvedType.group?"%s=types[%i].decode(r)":"%s=types[%i].decode(r,r.uint32())",l,r):t("%s=r.%s()",l,u),t("break")}for(t("default:")("r.skipType(t&7)")("break")("}")("}"),r=0;r<e._fieldsArray.length;++r){var f=e._fieldsArray[r];f.required&&t("if(!m.hasOwnProperty(%j))",f.name)("throw util.ProtocolError(%j,{instance:m})",s(f))}return t("return m")};var i=r(2),n=r(6),o=r(0);function s(e){return"missing required '"+e.name+"'"}},function(e,t,r){"use strict";e.exports=function(e){var t=n.codegen(["m"],e.name+"$verify")('if(typeof m!=="object"||m===null)')("return%j","object expected"),r=e.oneofsArray,i={};r.length&&t("var p={}");for(var u=0;u<e.fieldsArray.length;++u){var l=e._fieldsArray[u].resolve(),f="m"+n.safeProp(l.name);if(l.optional&&t("if(%s!=null&&m.hasOwnProperty(%j)){",f,l.name),l.map)t("if(!util.isObject(%s))",f)("return%j",o(l,"object"))("var k=Object.keys(%s)",f)("for(var i=0;i<k.length;++i){"),a(t,l,"k[i]"),s(t,l,u,f+"[k[i]]")("}");else if(l.repeated)t("if(!Array.isArray(%s))",f)("return%j",o(l,"array"))("for(var i=0;i<%s.length;++i){",f),s(t,l,u,f+"[i]")("}");else{if(l.partOf){var h=n.safeProp(l.partOf.name);1===i[l.partOf.name]&&t("if(p%s===1)",h)("return%j",l.partOf.name+": multiple values"),i[l.partOf.name]=1,t("p%s=1",h)}s(t,l,u,f)}l.optional&&t("}")}return t("return null")};var i=r(2),n=r(0);function o(e,t){return e.name+": "+t+(e.repeated&&"array"!==t?"[]":e.map&&"object"!==t?"{k:"+e.keyType+"}":"")+" expected"}function s(e,t,r,n){if(t.resolvedType)if(t.resolvedType instanceof i){e("switch(%s){",n)("default:")("return%j",o(t,"enum value"));for(var s=Object.keys(t.resolvedType.values),a=0;a<s.length;++a)e("case %i:",t.resolvedType.values[s[a]]);e("break")("}")}else e("{")("var e=types[%i].verify(%s);",r,n)("if(e)")("return%j+e",t.name+".")("}");else switch(t.type){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":e("if(!util.isInteger(%s))",n)("return%j",o(t,"integer"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":e("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))",n,n,n,n)("return%j",o(t,"integer|Long"));break;case"float":case"double":e('if(typeof %s!=="number")',n)("return%j",o(t,"number"));break;case"bool":e('if(typeof %s!=="boolean")',n)("return%j",o(t,"boolean"));break;case"string":e("if(!util.isString(%s))",n)("return%j",o(t,"string"));break;case"bytes":e('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))',n,n,n)("return%j",o(t,"buffer"))}return e}function a(e,t,r){switch(t.keyType){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":e("if(!util.key32Re.test(%s))",r)("return%j",o(t,"integer key"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":e("if(!util.key64Re.test(%s))",r)("return%j",o(t,"integer|Long key"));break;case"bool":e("if(!util.key2Re.test(%s))",r)("return%j",o(t,"boolean key"))}return e}},function(e,t,r){"use strict";var i=t,n=r(2),o=r(0);function s(e,t,r,i){if(t.resolvedType)if(t.resolvedType instanceof n){e("switch(d%s){",i);for(var o=t.resolvedType.values,s=Object.keys(o),a=0;a<s.length;++a)t.repeated&&o[s[a]]===t.typeDefault&&e("default:"),e("case%j:",s[a])("case %i:",o[s[a]])("m%s=%j",i,o[s[a]])("break");e("}")}else e('if(typeof d%s!=="object")',i)("throw TypeError(%j)",t.fullName+": object expected")("m%s=types[%i].fromObject(d%s)",i,r,i);else{var u=!1;switch(t.type){case"double":case"float":e("m%s=Number(d%s)",i,i);break;case"uint32":case"fixed32":e("m%s=d%s>>>0",i,i);break;case"int32":case"sint32":case"sfixed32":e("m%s=d%s|0",i,i);break;case"uint64":u=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":e("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j",i,i,u)('else if(typeof d%s==="string")',i)("m%s=parseInt(d%s,10)",i,i)('else if(typeof d%s==="number")',i)("m%s=d%s",i,i)('else if(typeof d%s==="object")',i)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)",i,i,i,u?"true":"");break;case"bytes":e('if(typeof d%s==="string")',i)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)",i,i,i)("else if(d%s.length)",i)("m%s=d%s",i,i);break;case"string":e("m%s=String(d%s)",i,i);break;case"bool":e("m%s=Boolean(d%s)",i,i)}}return e}function a(e,t,r,i){if(t.resolvedType)t.resolvedType instanceof n?e("d%s=o.enums===String?types[%i].values[m%s]:m%s",i,r,i,i):e("d%s=types[%i].toObject(m%s,o)",i,r,i);else{var o=!1;switch(t.type){case"double":case"float":e("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s",i,i,i,i);break;case"uint64":o=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":e('if(typeof m%s==="number")',i)("d%s=o.longs===String?String(m%s):m%s",i,i,i)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s",i,i,i,i,o?"true":"",i);break;case"bytes":e("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s",i,i,i,i,i);break;default:e("d%s=m%s",i,i)}}return e}i.fromObject=function(e){var t=e.fieldsArray,r=o.codegen(["d"],e.name+"$fromObject")("if(d instanceof this.ctor)")("return d");if(!t.length)return r("return new this.ctor");r("var m=new this.ctor");for(var i=0;i<t.length;++i){var a=t[i].resolve(),u=o.safeProp(a.name);a.map?(r("if(d%s){",u)('if(typeof d%s!=="object")',u)("throw TypeError(%j)",a.fullName+": object expected")("m%s={}",u)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){",u),s(r,a,i,u+"[ks[i]]")("}")("}")):a.repeated?(r("if(d%s){",u)("if(!Array.isArray(d%s))",u)("throw TypeError(%j)",a.fullName+": array expected")("m%s=[]",u)("for(var i=0;i<d%s.length;++i){",u),s(r,a,i,u+"[i]")("}")("}")):(a.resolvedType instanceof n||r("if(d%s!=null){",u),s(r,a,i,u),a.resolvedType instanceof n||r("}"))}return r("return m")},i.toObject=function(e){var t=e.fieldsArray.slice().sort(o.compareFieldsById);if(!t.length)return o.codegen()("return {}");for(var r=o.codegen(["m","o"],e.name+"$toObject")("if(!o)")("o={}")("var d={}"),i=[],s=[],u=[],l=0;l<t.length;++l)t[l].partOf||(t[l].resolve().repeated?i:t[l].map?s:u).push(t[l]);if(i.length){for(r("if(o.arrays||o.defaults){"),l=0;l<i.length;++l)r("d%s=[]",o.safeProp(i[l].name));r("}")}if(s.length){for(r("if(o.objects||o.defaults){"),l=0;l<s.length;++l)r("d%s={}",o.safeProp(s[l].name));r("}")}if(u.length){for(r("if(o.defaults){"),l=0;l<u.length;++l){var f=u[l],h=o.safeProp(f.name);if(f.resolvedType instanceof n)r("d%s=o.enums===String?%j:%j",h,f.resolvedType.valuesById[f.typeDefault],f.typeDefault);else if(f.long)r("if(util.Long){")("var n=new util.Long(%i,%i,%j)",f.typeDefault.low,f.typeDefault.high,f.typeDefault.unsigned)("d%s=o.longs===String?n.toString():o.longs===Number?n.toNumber():n",h)("}else")("d%s=o.longs===String?%j:%i",h,f.typeDefault.toString(),f.typeDefault.toNumber());else if(f.bytes){var c="["+Array.prototype.slice.call(f.typeDefault).join(",")+"]";r("if(o.bytes===String)d%s=%j",h,String.fromCharCode.apply(String,f.typeDefault))("else{")("d%s=%s",h,c)("if(o.bytes!==Array)d%s=util.newBuffer(d%s)",h,h)("}")}else r("d%s=%j",h,f.typeDefault)}r("}")}var p=!1;for(l=0;l<t.length;++l){f=t[l];var d=e._fieldsArray.indexOf(f);h=o.safeProp(f.name);f.map?(p||(p=!0,r("var ks2")),r("if(m%s&&(ks2=Object.keys(m%s)).length){",h,h)("d%s={}",h)("for(var j=0;j<ks2.length;++j){"),a(r,f,d,h+"[ks2[j]]")("}")):f.repeated?(r("if(m%s&&m%s.length){",h,h)("d%s=[]",h)("for(var j=0;j<m%s.length;++j){",h),a(r,f,d,h+"[j]")("}")):(r("if(m%s!=null&&m.hasOwnProperty(%j)){",h,f.name),a(r,f,d,h),f.partOf&&r("if(o.oneofs)")("d%s=%j",o.safeProp(f.partOf.name),f.name)),r("}")}return r("return d")}},function(e,t,r){"use strict";var i=t,n=r(10);i[".google.protobuf.Any"]={fromObject:function(e){if(e&&e["@type"]){var t=this.lookup(e["@type"]);if(t){var r="."===e["@type"].charAt(0)?e["@type"].substr(1):e["@type"];return this.create({type_url:"/"+r,value:t.encode(t.fromObject(e)).finish()})}}return this.fromObject(e)},toObject:function(e,t){if(t&&t.json&&e.type_url&&e.value){var r=e.type_url.substring(e.type_url.lastIndexOf("/")+1),i=this.lookup(r);i&&(e=i.decode(e.value))}if(!(e instanceof this.ctor)&&e instanceof n){var o=e.$type.toObject(e,t);return o["@type"]=e.$type.fullName,o}return this.toObject(e,t)}}},function(e,t,r){"use strict";e.exports=h;var i=r(5);((h.prototype=Object.create(i.prototype)).constructor=h).className="Root";var n,o,s,a=r(4),u=r(2),l=r(9),f=r(0);function h(e){i.call(this,"",e),this.deferred=[],this.files=[]}function c(){}h.fromJSON=function(e,t){return t||(t=new h),e.options&&t.setOptions(e.options),t.addJSON(e.nested)},h.prototype.resolvePath=f.path.resolve,h.prototype.load=function e(t,r,i){"function"==typeof r&&(i=r,r=void 0);var n=this;if(!i)return f.asPromise(e,n,t,r);var a=i===c;function u(e,t){if(i){var r=i;if(i=null,a)throw e;r(e,t)}}function l(e,t){try{if(f.isString(t)&&"{"===t.charAt(0)&&(t=JSON.parse(t)),f.isString(t)){o.filename=e;var i,s=o(t,n,r),l=0;if(s.imports)for(;l<s.imports.length;++l)(i=n.resolvePath(e,s.imports[l]))&&h(i);if(s.weakImports)for(l=0;l<s.weakImports.length;++l)(i=n.resolvePath(e,s.weakImports[l]))&&h(i,!0)}else n.setOptions(t.options).addJSON(t.nested)}catch(e){u(e)}a||p||u(null,n)}function h(e,t){var r=e.lastIndexOf("google/protobuf/");if(r>-1){var o=e.substring(r);o in s&&(e=o)}if(!(n.files.indexOf(e)>-1))if(n.files.push(e),e in s)a?l(e,s[e]):(++p,setTimeout((function(){--p,l(e,s[e])})));else if(a){var h;try{h=f.fs.readFileSync(e).toString("utf8")}catch(e){return void(t||u(e))}l(e,h)}else++p,f.fetch(e,(function(r,o){--p,i&&(r?t?p||u(null,n):u(r):l(e,o))}))}var p=0;f.isString(t)&&(t=[t]);for(var d,y=0;y<t.length;++y)(d=n.resolvePath("",t[y]))&&h(d);if(a)return n;p||u(null,n)},h.prototype.loadSync=function(e,t){if(!f.isNode)throw Error("not supported");return this.load(e,t,c)},h.prototype.resolveAll=function(){if(this.deferred.length)throw Error("unresolvable extensions: "+this.deferred.map((function(e){return"'extend "+e.extend+"' in "+e.parent.fullName})).join(", "));return i.prototype.resolveAll.call(this)};var p=/^[A-Z]/;function d(e,t){var r=t.parent.lookup(t.extend);if(r){var i=new a(t.fullName,t.id,t.type,t.rule,void 0,t.options);return i.declaringField=t,t.extensionField=i,r.add(i),!0}return!1}h.prototype._handleAdd=function(e){if(e instanceof a)void 0===e.extend||e.extensionField||d(0,e)||this.deferred.push(e);else if(e instanceof u)p.test(e.name)&&(e.parent[e.name]=e.values);else if(!(e instanceof l)){if(e instanceof n)for(var t=0;t<this.deferred.length;)d(0,this.deferred[t])?this.deferred.splice(t,1):++t;for(var r=0;r<e.nestedArray.length;++r)this._handleAdd(e._nestedArray[r]);p.test(e.name)&&(e.parent[e.name]=e)}},h.prototype._handleRemove=function(e){if(e instanceof a){if(void 0!==e.extend)if(e.extensionField)e.extensionField.parent.remove(e.extensionField),e.extensionField=null;else{var t=this.deferred.indexOf(e);t>-1&&this.deferred.splice(t,1)}}else if(e instanceof u)p.test(e.name)&&delete e.parent[e.name];else if(e instanceof i){for(var r=0;r<e.nestedArray.length;++r)this._handleRemove(e._nestedArray[r]);p.test(e.name)&&delete e.parent[e.name]}},h._configure=function(e,t,r){n=e,o=t,s=r}},function(e,t,r){"use strict";e.exports=r(27)},function(e,t,r){"use strict";r.r(t),r.d(t,"MovieEntity",(function(){return o}));var i=r(25),n=r(42),o=i.Root.fromJSON(n).lookupType("com.opensource.svga.MovieEntity")},function(e,t,r){"use strict";var i=e.exports=r(28);i.build="light",i.load=function(e,t,r){return"function"==typeof t?(r=t,t=new i.Root):t||(t=new i.Root),t.load(e,r)},i.loadSync=function(e,t){return t||(t=new i.Root),t.loadSync(e)},i.encoder=r(15),i.decoder=r(20),i.verifier=r(21),i.converter=r(22),i.ReflectionObject=r(3),i.Namespace=r(5),i.Root=r(24),i.Enum=r(2),i.Type=r(16),i.Field=r(4),i.OneOf=r(9),i.MapField=r(17),i.Service=r(18),i.Method=r(19),i.Message=r(10),i.wrappers=r(23),i.types=r(6),i.util=r(0),i.ReflectionObject._configure(i.Root),i.Namespace._configure(i.Type,i.Service,i.Enum),i.Root._configure(i.Type),i.Field._configure(i.Type)},function(e,t,r){"use strict";var i=t;function n(){i.Reader._configure(i.BufferReader),i.util._configure()}i.build="minimal",i.Writer=r(7),i.BufferWriter=r(36),i.Reader=r(8),i.BufferReader=r(37),i.util=r(1),i.rpc=r(13),i.roots=r(14),i.configure=n,i.Writer._configure(i.BufferWriter),n()},function(e,t){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r},function(e,t,r){"use strict";var i=t;i.length=function(e){var t=e.length;if(!t)return 0;for(var r=0;--t%4>1&&"="===e.charAt(t);)++r;return Math.ceil(3*e.length)/4-r};for(var n=new Array(64),o=new Array(123),s=0;s<64;)o[n[s]=s<26?s+65:s<52?s+71:s<62?s-4:s-59|43]=s++;i.encode=function(e,t,r){for(var i,o=null,s=[],a=0,u=0;t<r;){var l=e[t++];switch(u){case 0:s[a++]=n[l>>2],i=(3&l)<<4,u=1;break;case 1:s[a++]=n[i|l>>4],i=(15&l)<<2,u=2;break;case 2:s[a++]=n[i|l>>6],s[a++]=n[63&l],u=0}a>8191&&((o||(o=[])).push(String.fromCharCode.apply(String,s)),a=0)}return u&&(s[a++]=n[i],s[a++]=61,1===u&&(s[a++]=61)),o?(a&&o.push(String.fromCharCode.apply(String,s.slice(0,a))),o.join("")):String.fromCharCode.apply(String,s.slice(0,a))};var a="invalid encoding";i.decode=function(e,t,r){for(var i,n=r,s=0,u=0;u<e.length;){var l=e.charCodeAt(u++);if(61===l&&s>1)break;if(void 0===(l=o[l]))throw Error(a);switch(s){case 0:i=l,s=1;break;case 1:t[r++]=i<<2|(48&l)>>4,i=l,s=2;break;case 2:t[r++]=(15&i)<<4|(60&l)>>2,i=l,s=3;break;case 3:t[r++]=(3&i)<<6|l,s=0}}if(1===s)throw Error(a);return r-n},i.test=function(e){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)}},function(e,t,r){"use strict";function i(){this._listeners={}}e.exports=i,i.prototype.on=function(e,t,r){return(this._listeners[e]||(this._listeners[e]=[])).push({fn:t,ctx:r||this}),this},i.prototype.off=function(e,t){if(void 0===e)this._listeners={};else if(void 0===t)this._listeners[e]=[];else for(var r=this._listeners[e],i=0;i<r.length;)r[i].fn===t?r.splice(i,1):++i;return this},i.prototype.emit=function(e){var t=this._listeners[e];if(t){for(var r=[],i=1;i<arguments.length;)r.push(arguments[i++]);for(i=0;i<t.length;)t[i].fn.apply(t[i++].ctx,r)}return this}},function(e,t,r){"use strict";function i(e){return"undefined"!=typeof Float32Array?function(){var t=new Float32Array([-0]),r=new Uint8Array(t.buffer),i=128===r[3];function n(e,i,n){t[0]=e,i[n]=r[0],i[n+1]=r[1],i[n+2]=r[2],i[n+3]=r[3]}function o(e,i,n){t[0]=e,i[n]=r[3],i[n+1]=r[2],i[n+2]=r[1],i[n+3]=r[0]}function s(e,i){return r[0]=e[i],r[1]=e[i+1],r[2]=e[i+2],r[3]=e[i+3],t[0]}function a(e,i){return r[3]=e[i],r[2]=e[i+1],r[1]=e[i+2],r[0]=e[i+3],t[0]}e.writeFloatLE=i?n:o,e.writeFloatBE=i?o:n,e.readFloatLE=i?s:a,e.readFloatBE=i?a:s}():function(){function t(e,t,r,i){var n=t<0?1:0;if(n&&(t=-t),0===t)e(1/t>0?0:2147483648,r,i);else if(isNaN(t))e(2143289344,r,i);else if(t>34028234663852886e22)e((n<<31|2139095040)>>>0,r,i);else if(t<11754943508222875e-54)e((n<<31|Math.round(t/1401298464324817e-60))>>>0,r,i);else{var o=Math.floor(Math.log(t)/Math.LN2);e((n<<31|o+127<<23|8388607&Math.round(t*Math.pow(2,-o)*8388608))>>>0,r,i)}}function r(e,t,r){var i=e(t,r),n=2*(i>>31)+1,o=i>>>23&255,s=8388607&i;return 255===o?s?NaN:n*(1/0):0===o?1401298464324817e-60*n*s:n*Math.pow(2,o-150)*(s+8388608)}e.writeFloatLE=t.bind(null,n),e.writeFloatBE=t.bind(null,o),e.readFloatLE=r.bind(null,s),e.readFloatBE=r.bind(null,a)}(),"undefined"!=typeof Float64Array?function(){var t=new Float64Array([-0]),r=new Uint8Array(t.buffer),i=128===r[7];function n(e,i,n){t[0]=e,i[n]=r[0],i[n+1]=r[1],i[n+2]=r[2],i[n+3]=r[3],i[n+4]=r[4],i[n+5]=r[5],i[n+6]=r[6],i[n+7]=r[7]}function o(e,i,n){t[0]=e,i[n]=r[7],i[n+1]=r[6],i[n+2]=r[5],i[n+3]=r[4],i[n+4]=r[3],i[n+5]=r[2],i[n+6]=r[1],i[n+7]=r[0]}function s(e,i){return r[0]=e[i],r[1]=e[i+1],r[2]=e[i+2],r[3]=e[i+3],r[4]=e[i+4],r[5]=e[i+5],r[6]=e[i+6],r[7]=e[i+7],t[0]}function a(e,i){return r[7]=e[i],r[6]=e[i+1],r[5]=e[i+2],r[4]=e[i+3],r[3]=e[i+4],r[2]=e[i+5],r[1]=e[i+6],r[0]=e[i+7],t[0]}e.writeDoubleLE=i?n:o,e.writeDoubleBE=i?o:n,e.readDoubleLE=i?s:a,e.readDoubleBE=i?a:s}():function(){function t(e,t,r,i,n,o){var s=i<0?1:0;if(s&&(i=-i),0===i)e(0,n,o+t),e(1/i>0?0:2147483648,n,o+r);else if(isNaN(i))e(0,n,o+t),e(2146959360,n,o+r);else if(i>17976931348623157e292)e(0,n,o+t),e((s<<31|2146435072)>>>0,n,o+r);else{var a;if(i<22250738585072014e-324)e((a=i/5e-324)>>>0,n,o+t),e((s<<31|a/4294967296)>>>0,n,o+r);else{var u=Math.floor(Math.log(i)/Math.LN2);1024===u&&(u=1023),e(4503599627370496*(a=i*Math.pow(2,-u))>>>0,n,o+t),e((s<<31|u+1023<<20|1048576*a&1048575)>>>0,n,o+r)}}}function r(e,t,r,i,n){var o=e(i,n+t),s=e(i,n+r),a=2*(s>>31)+1,u=s>>>20&2047,l=4294967296*(1048575&s)+o;return 2047===u?l?NaN:a*(1/0):0===u?5e-324*a*l:a*Math.pow(2,u-1075)*(l+4503599627370496)}e.writeDoubleLE=t.bind(null,n,0,4),e.writeDoubleBE=t.bind(null,o,4,0),e.readDoubleLE=r.bind(null,s,0,4),e.readDoubleBE=r.bind(null,a,4,0)}(),e}function n(e,t,r){t[r]=255&e,t[r+1]=e>>>8&255,t[r+2]=e>>>16&255,t[r+3]=e>>>24}function o(e,t,r){t[r]=e>>>24,t[r+1]=e>>>16&255,t[r+2]=e>>>8&255,t[r+3]=255&e}function s(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0}function a(e,t){return(e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3])>>>0}e.exports=i(i)},function(e,t,r){"use strict";var i=t;i.length=function(e){for(var t=0,r=0,i=0;i<e.length;++i)(r=e.charCodeAt(i))<128?t+=1:r<2048?t+=2:55296==(64512&r)&&56320==(64512&e.charCodeAt(i+1))?(++i,t+=4):t+=3;return t},i.read=function(e,t,r){if(r-t<1)return"";for(var i,n=null,o=[],s=0;t<r;)(i=e[t++])<128?o[s++]=i:i>191&&i<224?o[s++]=(31&i)<<6|63&e[t++]:i>239&&i<365?(i=((7&i)<<18|(63&e[t++])<<12|(63&e[t++])<<6|63&e[t++])-65536,o[s++]=55296+(i>>10),o[s++]=56320+(1023&i)):o[s++]=(15&i)<<12|(63&e[t++])<<6|63&e[t++],s>8191&&((n||(n=[])).push(String.fromCharCode.apply(String,o)),s=0);return n?(s&&n.push(String.fromCharCode.apply(String,o.slice(0,s))),n.join("")):String.fromCharCode.apply(String,o.slice(0,s))},i.write=function(e,t,r){for(var i,n,o=r,s=0;s<e.length;++s)(i=e.charCodeAt(s))<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=63&i|128):55296==(64512&i)&&56320==(64512&(n=e.charCodeAt(s+1)))?(i=65536+((1023&i)<<10)+(1023&n),++s,t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=63&i|128):(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=63&i|128);return r-o}},function(e,t,r){"use strict";e.exports=function(e,t,r){var i=r||8192,n=i>>>1,o=null,s=i;return function(r){if(r<1||r>n)return e(r);s+r>i&&(o=e(i),s=0);var a=t.call(o,s,s+=r);return 7&s&&(s=1+(7|s)),a}}},function(e,t,r){"use strict";e.exports=n;var i=r(1);function n(e,t){this.lo=e>>>0,this.hi=t>>>0}var o=n.zero=new n(0,0);o.toNumber=function(){return 0},o.zzEncode=o.zzDecode=function(){return this},o.length=function(){return 1};var s=n.zeroHash="\0\0\0\0\0\0\0\0";n.fromNumber=function(e){if(0===e)return o;var t=e<0;t&&(e=-e);var r=e>>>0,i=(e-r)/4294967296>>>0;return t&&(i=~i>>>0,r=~r>>>0,++r>4294967295&&(r=0,++i>4294967295&&(i=0))),new n(r,i)},n.from=function(e){if("number"==typeof e)return n.fromNumber(e);if(i.isString(e)){if(!i.Long)return n.fromNumber(parseInt(e,10));e=i.Long.fromString(e)}return e.low||e.high?new n(e.low>>>0,e.high>>>0):o},n.prototype.toNumber=function(e){if(!e&&this.hi>>>31){var t=1+~this.lo>>>0,r=~this.hi>>>0;return t||(r=r+1>>>0),-(t+4294967296*r)}return this.lo+4294967296*this.hi},n.prototype.toLong=function(e){return i.Long?new i.Long(0|this.lo,0|this.hi,Boolean(e)):{low:0|this.lo,high:0|this.hi,unsigned:Boolean(e)}};var a=String.prototype.charCodeAt;n.fromHash=function(e){return e===s?o:new n((a.call(e,0)|a.call(e,1)<<8|a.call(e,2)<<16|a.call(e,3)<<24)>>>0,(a.call(e,4)|a.call(e,5)<<8|a.call(e,6)<<16|a.call(e,7)<<24)>>>0)},n.prototype.toHash=function(){return String.fromCharCode(255&this.lo,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,255&this.hi,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},n.prototype.zzEncode=function(){var e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this},n.prototype.zzDecode=function(){var e=-(1&this.lo);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this},n.prototype.length=function(){var e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return 0===r?0===t?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}},function(e,t,r){"use strict";e.exports=s;var i=r(7);(s.prototype=Object.create(i.prototype)).constructor=s;var n=r(1),o=n.Buffer;function s(){i.call(this)}s.alloc=function(e){return(s.alloc=n._Buffer_allocUnsafe)(e)};var a=o&&o.prototype instanceof Uint8Array&&"set"===o.prototype.set.name?function(e,t,r){t.set(e,r)}:function(e,t,r){if(e.copy)e.copy(t,r,0,e.length);else for(var i=0;i<e.length;)t[r++]=e[i++]};function u(e,t,r){e.length<40?n.utf8.write(e,t,r):t.utf8Write(e,r)}s.prototype.bytes=function(e){n.isString(e)&&(e=n._Buffer_from(e,"base64"));var t=e.length>>>0;return this.uint32(t),t&&this._push(a,t,e),this},s.prototype.string=function(e){var t=o.byteLength(e);return this.uint32(t),t&&this._push(u,t,e),this}},function(e,t,r){"use strict";e.exports=o;var i=r(8);(o.prototype=Object.create(i.prototype)).constructor=o;var n=r(1);function o(e){i.call(this,e)}n.Buffer&&(o.prototype._slice=n.Buffer.prototype.slice),o.prototype.string=function(){var e=this.uint32();return this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+e,this.len))}},function(e,t,r){"use strict";e.exports=n;var i=r(1);function n(e,t,r){if("function"!=typeof e)throw TypeError("rpcImpl must be a function");i.EventEmitter.call(this),this.rpcImpl=e,this.requestDelimited=Boolean(t),this.responseDelimited=Boolean(r)}(n.prototype=Object.create(i.EventEmitter.prototype)).constructor=n,n.prototype.rpcCall=function e(t,r,n,o,s){if(!o)throw TypeError("request must be specified");var a=this;if(!s)return i.asPromise(e,a,t,r,n,o);if(a.rpcImpl)try{return a.rpcImpl(t,r[a.requestDelimited?"encodeDelimited":"encode"](o).finish(),(function(e,r){if(e)return a.emit("error",e,t),s(e);if(null!==r){if(!(r instanceof n))try{r=n[a.responseDelimited?"decodeDelimited":"decode"](r)}catch(e){return a.emit("error",e,t),s(e)}return a.emit("data",r,t),s(null,r)}a.end(!0)}))}catch(e){return a.emit("error",e,t),void setTimeout((function(){s(e)}),0)}else setTimeout((function(){s(Error("already ended"))}),0)},n.prototype.end=function(e){return this.rpcImpl&&(e||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}},function(e,t,r){"use strict";function i(e,t){"string"==typeof e&&(t=e,e=void 0);var r=[];function n(e){if("string"!=typeof e){var t=o();if(i.verbose&&console.log("codegen: "+t),t="return "+t,e){for(var s=Object.keys(e),a=new Array(s.length+1),u=new Array(s.length),l=0;l<s.length;)a[l]=s[l],u[l]=e[s[l++]];return a[l]=t,Function.apply(null,a).apply(null,u)}return Function(t)()}for(var f=new Array(arguments.length-1),h=0;h<f.length;)f[h]=arguments[++h];if(h=0,e=e.replace(/%([%dfijs])/g,(function(e,t){var r=f[h++];switch(t){case"d":case"f":return String(Number(r));case"i":return String(Math.floor(r));case"j":return JSON.stringify(r);case"s":return String(r)}return"%"})),h!==f.length)throw Error("parameter count mismatch");return r.push(e),n}function o(i){return"function "+(i||t||"")+"("+(e&&e.join(",")||"")+"){\n  "+r.join("\n  ")+"\n}"}return n.toString=o,n}e.exports=i,i.verbose=!1},function(e,t,r){"use strict";e.exports=o;var i=r(11),n=r(12)("fs");function o(e,t,r){return"function"==typeof t?(r=t,t={}):t||(t={}),r?!t.xhr&&n&&n.readFile?n.readFile(e,(function(i,n){return i&&"undefined"!=typeof XMLHttpRequest?o.xhr(e,t,r):i?r(i):r(null,t.binary?n:n.toString("utf8"))})):o.xhr(e,t,r):i(o,this,e,t)}o.xhr=function(e,t,r){var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4===i.readyState){if(0!==i.status&&200!==i.status)return r(Error("status "+i.status));if(t.binary){var e=i.response;if(!e){e=[];for(var n=0;n<i.responseText.length;++n)e.push(255&i.responseText.charCodeAt(n))}return r(null,"undefined"!=typeof Uint8Array?new Uint8Array(e):e)}return r(null,i.responseText)}},t.binary&&("overrideMimeType"in i&&i.overrideMimeType("text/plain; charset=x-user-defined"),i.responseType="arraybuffer"),i.open("GET",e),i.send()}},function(e,t,r){"use strict";var i=t,n=i.isAbsolute=function(e){return/^(?:\/|\w+:)/.test(e)},o=i.normalize=function(e){var t=(e=e.replace(/\\/g,"/").replace(/\/{2,}/g,"/")).split("/"),r=n(e),i="";r&&(i=t.shift()+"/");for(var o=0;o<t.length;)".."===t[o]?o>0&&".."!==t[o-1]?t.splice(--o,2):r?t.splice(o,1):++o:"."===t[o]?t.splice(o,1):++o;return i+t.join("/")};i.resolve=function(e,t,r){return r||(t=o(t)),n(t)?t:(r||(e=o(e)),(e=e.replace(/(?:\/|^)[^/]+$/,"")).length?o(e+"/"+t):t)}},function(e){e.exports=JSON.parse('{"nested":{"com":{"nested":{"opensource":{"nested":{"svga":{"options":{"objc_class_prefix":"SVGAProto","java_package":"com.opensource.svgaplayer.proto"},"nested":{"MovieParams":{"fields":{"viewBoxWidth":{"type":"float","id":1},"viewBoxHeight":{"type":"float","id":2},"fps":{"type":"int32","id":3},"frames":{"type":"int32","id":4}}},"SpriteEntity":{"fields":{"imageKey":{"type":"string","id":1},"frames":{"rule":"repeated","type":"FrameEntity","id":2},"matteKey":{"type":"string","id":3}}},"AudioEntity":{"fields":{"audioKey":{"type":"string","id":1},"startFrame":{"type":"int32","id":2},"endFrame":{"type":"int32","id":3},"startTime":{"type":"int32","id":4},"totalTime":{"type":"int32","id":5}}},"Layout":{"fields":{"x":{"type":"float","id":1},"y":{"type":"float","id":2},"width":{"type":"float","id":3},"height":{"type":"float","id":4}}},"Transform":{"fields":{"a":{"type":"float","id":1},"b":{"type":"float","id":2},"c":{"type":"float","id":3},"d":{"type":"float","id":4},"tx":{"type":"float","id":5},"ty":{"type":"float","id":6}}},"ShapeEntity":{"oneofs":{"args":{"oneof":["shape","rect","ellipse"]}},"fields":{"type":{"type":"ShapeType","id":1},"shape":{"type":"ShapeArgs","id":2},"rect":{"type":"RectArgs","id":3},"ellipse":{"type":"EllipseArgs","id":4},"styles":{"type":"ShapeStyle","id":10},"transform":{"type":"Transform","id":11}},"nested":{"ShapeType":{"values":{"SHAPE":0,"RECT":1,"ELLIPSE":2,"KEEP":3}},"ShapeArgs":{"fields":{"d":{"type":"string","id":1}}},"RectArgs":{"fields":{"x":{"type":"float","id":1},"y":{"type":"float","id":2},"width":{"type":"float","id":3},"height":{"type":"float","id":4},"cornerRadius":{"type":"float","id":5}}},"EllipseArgs":{"fields":{"x":{"type":"float","id":1},"y":{"type":"float","id":2},"radiusX":{"type":"float","id":3},"radiusY":{"type":"float","id":4}}},"ShapeStyle":{"fields":{"fill":{"type":"RGBAColor","id":1},"stroke":{"type":"RGBAColor","id":2},"strokeWidth":{"type":"float","id":3},"lineCap":{"type":"LineCap","id":4},"lineJoin":{"type":"LineJoin","id":5},"miterLimit":{"type":"float","id":6},"lineDashI":{"type":"float","id":7},"lineDashII":{"type":"float","id":8},"lineDashIII":{"type":"float","id":9}},"nested":{"RGBAColor":{"fields":{"r":{"type":"float","id":1},"g":{"type":"float","id":2},"b":{"type":"float","id":3},"a":{"type":"float","id":4}}},"LineCap":{"values":{"LineCap_BUTT":0,"LineCap_ROUND":1,"LineCap_SQUARE":2}},"LineJoin":{"values":{"LineJoin_MITER":0,"LineJoin_ROUND":1,"LineJoin_BEVEL":2}}}}}},"FrameEntity":{"fields":{"alpha":{"type":"float","id":1},"layout":{"type":"Layout","id":2},"transform":{"type":"Transform","id":3},"clipPath":{"type":"string","id":4},"shapes":{"rule":"repeated","type":"ShapeEntity","id":5}}},"MovieEntity":{"fields":{"version":{"type":"string","id":1},"params":{"type":"MovieParams","id":2},"images":{"keyType":"string","type":"bytes","id":3},"sprites":{"rule":"repeated","type":"SpriteEntity","id":4},"audios":{"rule":"repeated","type":"AudioEntity","id":5}}}}}}}}}}}')},function(e,t){var r={};
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function(){"use strict";function e(e){throw e}var t=void 0,r=!0,i=this;function n(e,r){var n,o=e.split("."),s=i;!(o[0]in s)&&s.execScript&&s.execScript("var "+o[0]);for(;o.length&&(n=o.shift());)o.length||r===t?s=s[n]?s[n]:s[n]={}:s[n]=r}var o="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;function s(t,r){this.index="number"==typeof r?r:0,this.i=0,this.buffer=t instanceof(o?Uint8Array:Array)?t:new(o?Uint8Array:Array)(32768),2*this.buffer.length<=this.index&&e(Error("invalid index")),this.buffer.length<=this.index&&this.f()}s.prototype.f=function(){var e,t=this.buffer,r=t.length,i=new(o?Uint8Array:Array)(r<<1);if(o)i.set(t);else for(e=0;e<r;++e)i[e]=t[e];return this.buffer=i},s.prototype.d=function(e,t,r){var i,n=this.buffer,o=this.index,s=this.i,a=n[o];if(r&&1<t&&(e=8<t?(c[255&e]<<24|c[e>>>8&255]<<16|c[e>>>16&255]<<8|c[e>>>24&255])>>32-t:c[e]>>8-t),8>t+s)a=a<<t|e,s+=t;else for(i=0;i<t;++i)a=a<<1|e>>t-i-1&1,8==++s&&(s=0,n[o++]=c[a],a=0,o===n.length&&(n=this.f()));n[o]=a,this.buffer=n,this.i=s,this.index=o},s.prototype.finish=function(){var e,t=this.buffer,r=this.index;return 0<this.i&&(t[r]<<=8-this.i,t[r]=c[t[r]],r++),o?e=t.subarray(0,r):(t.length=r,e=t),e};var a,u=new(o?Uint8Array:Array)(256);for(a=0;256>a;++a){for(var l=h=a,f=7,h=h>>>1;h;h>>>=1)l<<=1,l|=1&h,--f;u[a]=(l<<f&255)>>>0}var c=u;function p(e){this.buffer=new(o?Uint16Array:Array)(2*e),this.length=0}function d(e){var t,r,i,n,s,a,u,l,f,h,c=e.length,p=0,d=Number.POSITIVE_INFINITY;for(l=0;l<c;++l)e[l]>p&&(p=e[l]),e[l]<d&&(d=e[l]);for(t=1<<p,r=new(o?Uint32Array:Array)(t),i=1,n=0,s=2;i<=p;){for(l=0;l<c;++l)if(e[l]===i){for(a=0,u=n,f=0;f<i;++f)a=a<<1|1&u,u>>=1;for(h=i<<16|l,f=a;f<t;f+=s)r[f]=h;++n}++i,n<<=1,s<<=1}return[r,p,d]}function y(e,t){this.h=m,this.w=0,this.input=o&&e instanceof Array?new Uint8Array(e):e,this.b=0,t&&(t.lazy&&(this.w=t.lazy),"number"==typeof t.compressionType&&(this.h=t.compressionType),t.outputBuffer&&(this.a=o&&t.outputBuffer instanceof Array?new Uint8Array(t.outputBuffer):t.outputBuffer),"number"==typeof t.outputIndex&&(this.b=t.outputIndex)),this.a||(this.a=new(o?Uint8Array:Array)(32768))}p.prototype.getParent=function(e){return 2*((e-2)/4|0)},p.prototype.push=function(e,t){var r,i,n,o=this.buffer;for(r=this.length,o[this.length++]=t,o[this.length++]=e;0<r&&(i=this.getParent(r),o[r]>o[i]);)n=o[r],o[r]=o[i],o[i]=n,n=o[r+1],o[r+1]=o[i+1],o[i+1]=n,r=i;return this.length},p.prototype.pop=function(){var e,t,r,i,n,o=this.buffer;for(t=o[0],e=o[1],this.length-=2,o[0]=o[this.length],o[1]=o[this.length+1],n=0;!((i=2*n+2)>=this.length)&&(i+2<this.length&&o[i+2]>o[i]&&(i+=2),o[i]>o[n]);)r=o[n],o[n]=o[i],o[i]=r,r=o[n+1],o[n+1]=o[i+1],o[i+1]=r,n=i;return{index:e,value:t,length:this.length}};var v,m=2,g={NONE:0,r:1,k:m,N:3},b=[];for(v=0;288>v;v++)switch(r){case 143>=v:b.push([v+48,8]);break;case 255>=v:b.push([v-144+400,9]);break;case 279>=v:b.push([v-256+0,7]);break;case 287>=v:b.push([v-280+192,8]);break;default:e("invalid literal: "+v)}function w(e,t){this.length=e,this.G=t}y.prototype.j=function(){var i,n,a,u,l=this.input;switch(this.h){case 0:for(a=0,u=l.length;a<u;){var f,h,c,p=n=o?l.subarray(a,a+65535):l.slice(a,a+65535),d=(a+=n.length)===u,y=t,v=t,g=this.a,w=this.b;if(o){for(g=new Uint8Array(this.a.buffer);g.length<=w+p.length+5;)g=new Uint8Array(g.length<<1);g.set(this.a)}if(f=d?1:0,g[w++]=0|f,c=65536+~(h=p.length)&65535,g[w++]=255&h,g[w++]=h>>>8&255,g[w++]=255&c,g[w++]=c>>>8&255,o)g.set(p,w),w+=p.length,g=g.subarray(0,w);else{for(y=0,v=p.length;y<v;++y)g[w++]=p[y];g.length=w}this.b=w,this.a=g}break;case 1:var _=new s(o?new Uint8Array(this.a.buffer):this.a,this.b);_.d(1,1,r),_.d(1,2,r);var k,O,x,E=A(this,l);for(k=0,O=E.length;k<O;k++)if(x=E[k],s.prototype.d.apply(_,b[x]),256<x)_.d(E[++k],E[++k],r),_.d(E[++k],5),_.d(E[++k],E[++k],r);else if(256===x)break;this.a=_.finish(),this.b=this.a.length;break;case m:var T,N,C,P,F,B,R,I,D,L,U,J,M,z,q,$=new s(o?new Uint8Array(this.a.buffer):this.a,this.b),H=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],G=Array(19);for(T=m,$.d(1,1,r),$.d(T,2,r),N=A(this,l),R=j(B=S(this.L,15)),D=j(I=S(this.K,7)),C=286;257<C&&0===B[C-1];C--);for(P=30;1<P&&0===I[P-1];P--);var V,K,W,Z,X,Y,Q=C,ee=P,te=new(o?Uint32Array:Array)(Q+ee),re=new(o?Uint32Array:Array)(316),ie=new(o?Uint8Array:Array)(19);for(V=K=0;V<Q;V++)te[K++]=B[V];for(V=0;V<ee;V++)te[K++]=I[V];if(!o)for(V=0,Z=ie.length;V<Z;++V)ie[V]=0;for(V=X=0,Z=te.length;V<Z;V+=K){for(K=1;V+K<Z&&te[V+K]===te[V];++K);if(W=K,0===te[V])if(3>W)for(;0<W--;)re[X++]=0,ie[0]++;else for(;0<W;)(Y=138>W?W:138)>W-3&&Y<W&&(Y=W-3),10>=Y?(re[X++]=17,re[X++]=Y-3,ie[17]++):(re[X++]=18,re[X++]=Y-11,ie[18]++),W-=Y;else if(re[X++]=te[V],ie[te[V]]++,3>--W)for(;0<W--;)re[X++]=te[V],ie[te[V]]++;else for(;0<W;)(Y=6>W?W:6)>W-3&&Y<W&&(Y=W-3),re[X++]=16,re[X++]=Y-3,ie[16]++,W-=Y}for(i=o?re.subarray(0,X):re.slice(0,X),L=S(ie,7),z=0;19>z;z++)G[z]=L[H[z]];for(F=19;4<F&&0===G[F-1];F--);for(U=j(L),$.d(C-257,5,r),$.d(P-1,5,r),$.d(F-4,4,r),z=0;z<F;z++)$.d(G[z],3,r);for(z=0,q=i.length;z<q;z++)if(J=i[z],$.d(U[J],L[J],r),16<=J){switch(z++,J){case 16:M=2;break;case 17:M=3;break;case 18:M=7;break;default:e("invalid code: "+J)}$.d(i[z],M,r)}var ne,oe,se,ae,ue,le,fe,he,ce=[R,B],pe=[D,I];for(ue=ce[0],le=ce[1],fe=pe[0],he=pe[1],ne=0,oe=N.length;ne<oe;++ne)if(se=N[ne],$.d(ue[se],le[se],r),256<se)$.d(N[++ne],N[++ne],r),ae=N[++ne],$.d(fe[ae],he[ae],r),$.d(N[++ne],N[++ne],r);else if(256===se)break;this.a=$.finish(),this.b=this.a.length;break;default:e("invalid compression type")}return this.a};var _=function(){function t(t){switch(r){case 3===t:return[257,t-3,0];case 4===t:return[258,t-4,0];case 5===t:return[259,t-5,0];case 6===t:return[260,t-6,0];case 7===t:return[261,t-7,0];case 8===t:return[262,t-8,0];case 9===t:return[263,t-9,0];case 10===t:return[264,t-10,0];case 12>=t:return[265,t-11,1];case 14>=t:return[266,t-13,1];case 16>=t:return[267,t-15,1];case 18>=t:return[268,t-17,1];case 22>=t:return[269,t-19,2];case 26>=t:return[270,t-23,2];case 30>=t:return[271,t-27,2];case 34>=t:return[272,t-31,2];case 42>=t:return[273,t-35,3];case 50>=t:return[274,t-43,3];case 58>=t:return[275,t-51,3];case 66>=t:return[276,t-59,3];case 82>=t:return[277,t-67,4];case 98>=t:return[278,t-83,4];case 114>=t:return[279,t-99,4];case 130>=t:return[280,t-115,4];case 162>=t:return[281,t-131,5];case 194>=t:return[282,t-163,5];case 226>=t:return[283,t-195,5];case 257>=t:return[284,t-227,5];case 258===t:return[285,t-258,0];default:e("invalid length: "+t)}}var i,n,o=[];for(i=3;258>=i;i++)n=t(i),o[i]=n[2]<<24|n[1]<<16|n[0];return o}(),k=o?new Uint32Array(_):_;function A(i,n){function s(t,i){var n,o,s,a,u=t.G,l=[],f=0;switch(n=k[t.length],l[f++]=65535&n,l[f++]=n>>16&255,l[f++]=n>>24,r){case 1===u:o=[0,u-1,0];break;case 2===u:o=[1,u-2,0];break;case 3===u:o=[2,u-3,0];break;case 4===u:o=[3,u-4,0];break;case 6>=u:o=[4,u-5,1];break;case 8>=u:o=[5,u-7,1];break;case 12>=u:o=[6,u-9,2];break;case 16>=u:o=[7,u-13,2];break;case 24>=u:o=[8,u-17,3];break;case 32>=u:o=[9,u-25,3];break;case 48>=u:o=[10,u-33,4];break;case 64>=u:o=[11,u-49,4];break;case 96>=u:o=[12,u-65,5];break;case 128>=u:o=[13,u-97,5];break;case 192>=u:o=[14,u-129,6];break;case 256>=u:o=[15,u-193,6];break;case 384>=u:o=[16,u-257,7];break;case 512>=u:o=[17,u-385,7];break;case 768>=u:o=[18,u-513,8];break;case 1024>=u:o=[19,u-769,8];break;case 1536>=u:o=[20,u-1025,9];break;case 2048>=u:o=[21,u-1537,9];break;case 3072>=u:o=[22,u-2049,10];break;case 4096>=u:o=[23,u-3073,10];break;case 6144>=u:o=[24,u-4097,11];break;case 8192>=u:o=[25,u-6145,11];break;case 12288>=u:o=[26,u-8193,12];break;case 16384>=u:o=[27,u-12289,12];break;case 24576>=u:o=[28,u-16385,13];break;case 32768>=u:o=[29,u-24577,13];break;default:e("invalid distance")}for(n=o,l[f++]=n[0],l[f++]=n[1],l[f++]=n[2],s=0,a=l.length;s<a;++s)m[g++]=l[s];w[l[0]]++,_[l[3]]++,b=t.length+i-1,d=null}var a,u,l,f,h,c,p,d,y,v={},m=o?new Uint16Array(2*n.length):[],g=0,b=0,w=new(o?Uint32Array:Array)(286),_=new(o?Uint32Array:Array)(30),A=i.w;if(!o){for(l=0;285>=l;)w[l++]=0;for(l=0;29>=l;)_[l++]=0}for(w[256]=1,a=0,u=n.length;a<u;++a){for(l=h=0,f=3;l<f&&a+l!==u;++l)h=h<<8|n[a+l];if(v[h]===t&&(v[h]=[]),c=v[h],!(0<b--)){for(;0<c.length&&32768<a-c[0];)c.shift();if(a+3>=u){for(d&&s(d,-1),l=0,f=u-a;l<f;++l)y=n[a+l],m[g++]=y,++w[y];break}0<c.length?(p=O(n,a,c),d?d.length<p.length?(y=n[a-1],m[g++]=y,++w[y],s(p,0)):s(d,-1):p.length<A?d=p:s(p,0)):d?s(d,-1):(y=n[a],m[g++]=y,++w[y])}c.push(a)}return m[g++]=256,w[256]++,i.L=w,i.K=_,o?m.subarray(0,g):m}function O(e,t,r){var i,n,o,s,a,u,l=0,f=e.length;s=0,u=r.length;e:for(;s<u;s++){if(i=r[u-s-1],o=3,3<l){for(a=l;3<a;a--)if(e[i+a-1]!==e[t+a-1])continue e;o=l}for(;258>o&&t+o<f&&e[i+o]===e[t+o];)++o;if(o>l&&(n=i,l=o),258===o)break}return new w(l,t-n)}function S(e,t){var r,i,n,s,a,u=e.length,l=new p(572),f=new(o?Uint8Array:Array)(u);if(!o)for(s=0;s<u;s++)f[s]=0;for(s=0;s<u;++s)0<e[s]&&l.push(s,e[s]);if(r=Array(l.length/2),i=new(o?Uint32Array:Array)(l.length/2),1===r.length)return f[l.pop().index]=1,f;for(s=0,a=l.length/2;s<a;++s)r[s]=l.pop(),i[s]=r[s].value;for(n=function(e,t,r){function i(e){var r=d[e][y[e]];r===t?(i(e+1),i(e+1)):--c[r],++y[e]}var n,s,a,u,l,f=new(o?Uint16Array:Array)(r),h=new(o?Uint8Array:Array)(r),c=new(o?Uint8Array:Array)(t),p=Array(r),d=Array(r),y=Array(r),v=(1<<r)-t,m=1<<r-1;for(f[r-1]=t,s=0;s<r;++s)v<m?h[s]=0:(h[s]=1,v-=m),v<<=1,f[r-2-s]=(f[r-1-s]/2|0)+t;for(f[0]=h[0],p[0]=Array(f[0]),d[0]=Array(f[0]),s=1;s<r;++s)f[s]>2*f[s-1]+h[s]&&(f[s]=2*f[s-1]+h[s]),p[s]=Array(f[s]),d[s]=Array(f[s]);for(n=0;n<t;++n)c[n]=r;for(a=0;a<f[r-1];++a)p[r-1][a]=e[a],d[r-1][a]=a;for(n=0;n<r;++n)y[n]=0;for(1===h[r-1]&&(--c[0],++y[r-1]),s=r-2;0<=s;--s){for(u=n=0,l=y[s+1],a=0;a<f[s];a++)(u=p[s+1][l]+p[s+1][l+1])>e[n]?(p[s][a]=u,d[s][a]=t,l+=2):(p[s][a]=e[n],d[s][a]=n,++n);y[s]=0,1===h[s]&&i(s)}return c}(i,i.length,t),s=0,a=r.length;s<a;++s)f[r[s].index]=n[s];return f}function j(e){var t,r,i,n,s=new(o?Uint16Array:Array)(e.length),a=[],u=[],l=0;for(t=0,r=e.length;t<r;t++)a[e[t]]=1+(0|a[e[t]]);for(t=1,r=16;t<=r;t++)u[t]=l,l+=0|a[t],l<<=1;for(t=0,r=e.length;t<r;t++)for(l=u[e[t]],u[e[t]]+=1,i=s[t]=0,n=e[t];i<n;i++)s[t]=s[t]<<1|1&l,l>>>=1;return s}function x(t,r){switch(this.l=[],this.m=32768,this.e=this.g=this.c=this.q=0,this.input=o?new Uint8Array(t):t,this.s=!1,this.n=T,this.B=!1,!r&&(r={})||(r.index&&(this.c=r.index),r.bufferSize&&(this.m=r.bufferSize),r.bufferType&&(this.n=r.bufferType),r.resize&&(this.B=r.resize)),this.n){case E:this.b=32768,this.a=new(o?Uint8Array:Array)(32768+this.m+258);break;case T:this.b=0,this.a=new(o?Uint8Array:Array)(this.m),this.f=this.J,this.t=this.H,this.o=this.I;break;default:e(Error("invalid inflate mode"))}}var E=0,T=1,N={D:E,C:T};x.prototype.p=function(){for(;!this.s;){var i=W(this,3);switch(1&i&&(this.s=r),i>>>=1){case 0:var n=this.input,s=this.c,a=this.a,u=this.b,l=n.length,f=t,h=a.length,c=t;switch(this.e=this.g=0,s+1>=l&&e(Error("invalid uncompressed block header: LEN")),f=n[s++]|n[s++]<<8,s+1>=l&&e(Error("invalid uncompressed block header: NLEN")),f===~(n[s++]|n[s++]<<8)&&e(Error("invalid uncompressed block header: length verify")),s+f>n.length&&e(Error("input buffer is broken")),this.n){case E:for(;u+f>a.length;){if(f-=c=h-u,o)a.set(n.subarray(s,s+c),u),u+=c,s+=c;else for(;c--;)a[u++]=n[s++];this.b=u,a=this.f(),u=this.b}break;case T:for(;u+f>a.length;)a=this.f({v:2});break;default:e(Error("invalid inflate mode"))}if(o)a.set(n.subarray(s,s+f),u),u+=f,s+=f;else for(;f--;)a[u++]=n[s++];this.c=s,this.b=u,this.a=a;break;case 1:this.o(G,K);break;case 2:var p,y,v,m,g=W(this,5)+257,b=W(this,5)+1,w=W(this,4)+4,_=new(o?Uint8Array:Array)(B.length),k=t,A=t,O=t,S=t,j=t;for(j=0;j<w;++j)_[B[j]]=W(this,3);if(!o)for(j=w,w=_.length;j<w;++j)_[B[j]]=0;for(p=d(_),k=new(o?Uint8Array:Array)(g+b),j=0,m=g+b;j<m;)switch(A=Z(this,p)){case 16:for(S=3+W(this,2);S--;)k[j++]=O;break;case 17:for(S=3+W(this,3);S--;)k[j++]=0;O=0;break;case 18:for(S=11+W(this,7);S--;)k[j++]=0;O=0;break;default:O=k[j++]=A}y=d(o?k.subarray(0,g):k.slice(0,g)),v=d(o?k.subarray(g):k.slice(g)),this.o(y,v);break;default:e(Error("unknown BTYPE: "+i))}}return this.t()};var C,P,F=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],B=o?new Uint16Array(F):F,R=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],I=o?new Uint16Array(R):R,D=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],L=o?new Uint8Array(D):D,U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],J=o?new Uint16Array(U):U,M=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],z=o?new Uint8Array(M):M,q=new(o?Uint8Array:Array)(288);for(C=0,P=q.length;C<P;++C)q[C]=143>=C?8:255>=C?9:279>=C?7:8;var $,H,G=d(q),V=new(o?Uint8Array:Array)(30);for($=0,H=V.length;$<H;++$)V[$]=5;var K=d(V);function W(t,r){for(var i,n=t.g,o=t.e,s=t.input,a=t.c,u=s.length;o<r;)a>=u&&e(Error("input buffer is broken")),n|=s[a++]<<o,o+=8;return i=n&(1<<r)-1,t.g=n>>>r,t.e=o-r,t.c=a,i}function Z(t,r){for(var i,n,o=t.g,s=t.e,a=t.input,u=t.c,l=a.length,f=r[0],h=r[1];s<h&&!(u>=l);)o|=a[u++]<<s,s+=8;return(n=(i=f[o&(1<<h)-1])>>>16)>s&&e(Error("invalid code length: "+n)),t.g=o>>n,t.e=s-n,t.c=u,65535&i}function X(e){if("string"==typeof e){var t,r,i=e.split("");for(t=0,r=i.length;t<r;t++)i[t]=(255&i[t].charCodeAt(0))>>>0;e=i}for(var n,o=1,s=0,a=e.length,u=0;0<a;){a-=n=1024<a?1024:a;do{s+=o+=e[u++]}while(--n);o%=65521,s%=65521}return(s<<16|o)>>>0}function Y(t,r){var i,n;switch(this.input=t,this.c=0,!r&&(r={})||(r.index&&(this.c=r.index),r.verify&&(this.M=r.verify)),i=t[this.c++],n=t[this.c++],15&i){case Q:this.method=Q;break;default:e(Error("unsupported compression method"))}0!=((i<<8)+n)%31&&e(Error("invalid fcheck flag:"+((i<<8)+n)%31)),32&n&&e(Error("fdict flag is not supported")),this.A=new x(t,{index:this.c,bufferSize:r.bufferSize,bufferType:r.bufferType,resize:r.resize})}x.prototype.o=function(e,t){var r=this.a,i=this.b;this.u=e;for(var n,o,s,a,u=r.length-258;256!==(n=Z(this,e));)if(256>n)i>=u&&(this.b=i,r=this.f(),i=this.b),r[i++]=n;else for(a=I[o=n-257],0<L[o]&&(a+=W(this,L[o])),n=Z(this,t),s=J[n],0<z[n]&&(s+=W(this,z[n])),i>=u&&(this.b=i,r=this.f(),i=this.b);a--;)r[i]=r[i++-s];for(;8<=this.e;)this.e-=8,this.c--;this.b=i},x.prototype.I=function(e,t){var r=this.a,i=this.b;this.u=e;for(var n,o,s,a,u=r.length;256!==(n=Z(this,e));)if(256>n)i>=u&&(u=(r=this.f()).length),r[i++]=n;else for(a=I[o=n-257],0<L[o]&&(a+=W(this,L[o])),n=Z(this,t),s=J[n],0<z[n]&&(s+=W(this,z[n])),i+a>u&&(u=(r=this.f()).length);a--;)r[i]=r[i++-s];for(;8<=this.e;)this.e-=8,this.c--;this.b=i},x.prototype.f=function(){var e,t,r=new(o?Uint8Array:Array)(this.b-32768),i=this.b-32768,n=this.a;if(o)r.set(n.subarray(32768,r.length));else for(e=0,t=r.length;e<t;++e)r[e]=n[e+32768];if(this.l.push(r),this.q+=r.length,o)n.set(n.subarray(i,i+32768));else for(e=0;32768>e;++e)n[e]=n[i+e];return this.b=32768,n},x.prototype.J=function(e){var t,r,i,n=this.input.length/this.c+1|0,s=this.input,a=this.a;return e&&("number"==typeof e.v&&(n=e.v),"number"==typeof e.F&&(n+=e.F)),2>n?r=(i=(s.length-this.c)/this.u[2]/2*258|0)<a.length?a.length+i:a.length<<1:r=a.length*n,o?(t=new Uint8Array(r)).set(a):t=a,this.a=t},x.prototype.t=function(){var e,t,r,i,n,s=0,a=this.a,u=this.l,l=new(o?Uint8Array:Array)(this.q+(this.b-32768));if(0===u.length)return o?this.a.subarray(32768,this.b):this.a.slice(32768,this.b);for(t=0,r=u.length;t<r;++t)for(i=0,n=(e=u[t]).length;i<n;++i)l[s++]=e[i];for(t=32768,r=this.b;t<r;++t)l[s++]=a[t];return this.l=[],this.buffer=l},x.prototype.H=function(){var e,t=this.b;return o?this.B?(e=new Uint8Array(t)).set(this.a.subarray(0,t)):e=this.a.subarray(0,t):(this.a.length>t&&(this.a.length=t),e=this.a),this.buffer=e},Y.prototype.p=function(){var t,r=this.input;return t=this.A.p(),this.c=this.A.c,this.M&&((r[this.c++]<<24|r[this.c++]<<16|r[this.c++]<<8|r[this.c++])>>>0!==X(t)&&e(Error("invalid adler-32 checksum"))),t};var Q=8;function ee(e,t){this.input=e,this.a=new(o?Uint8Array:Array)(32768),this.h=te.k;var r,i={};for(r in!t&&(t={})||"number"!=typeof t.compressionType||(this.h=t.compressionType),t)i[r]=t[r];i.outputBuffer=this.a,this.z=new y(this.input,i)}var te=g;function re(e,t){var r,i,o,s;if(Object.keys)r=Object.keys(t);else for(i in r=[],o=0,t)r[o++]=i;for(o=0,s=r.length;o<s;++o)n(e+"."+(i=r[o]),t[i])}ee.prototype.j=function(){var t,r,i,n,s,a,u,l=0;switch(u=this.a,t=Q){case Q:r=Math.LOG2E*Math.log(32768)-8;break;default:e(Error("invalid compression method"))}switch(i=r<<4|t,u[l++]=i,t){case Q:switch(this.h){case te.NONE:s=0;break;case te.r:s=1;break;case te.k:s=2;break;default:e(Error("unsupported compression type"))}break;default:e(Error("invalid compression method"))}return n=s<<6|0,u[l++]=n|31-(256*i+n)%31,a=X(this.input),this.z.b=l,l=(u=this.z.j()).length,o&&((u=new Uint8Array(u.buffer)).length<=l+4&&(this.a=new Uint8Array(u.length+4),this.a.set(u),u=this.a),u=u.subarray(0,l+4)),u[l++]=a>>24&255,u[l++]=a>>16&255,u[l++]=a>>8&255,u[l++]=255&a,u},n("Zlib.Inflate",Y),n("Zlib.Inflate.prototype.decompress",Y.prototype.p),re("Zlib.Inflate.BufferType",{ADAPTIVE:N.C,BLOCK:N.D}),n("Zlib.Deflate",ee),n("Zlib.Deflate.compress",(function(e,t){return new ee(e,t).j()})),n("Zlib.Deflate.prototype.compress",ee.prototype.j),re("Zlib.Deflate.CompressionType",{NONE:te.NONE,FIXED:te.r,DYNAMIC:te.k})}).call(r),e.exports=r.Zlib},function(e,t,r){"use strict";r.r(t);var i,n,o,s=function(e,t,r,i){return new(r||(r=Promise))((function(n,o){function s(e){try{u(i.next(e))}catch(e){o(e)}}function a(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,a)}u((i=i.apply(e,t||[])).next())}))},a=function(e,t){var r,i,n,o,s={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,i&&(n=2&o[0]?i.return:o[0]?i.throw||((n=i.return)&&n.call(i),0):i.next)&&!(n=n.call(i,o[1])).done)return n;switch(i=0,n&&(o=[2&o[0],n.value]),o[0]){case 0:case 1:n=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,i=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(n=s.trys,(n=n.length>0&&n[n.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!n||o[1]>n[0]&&o[1]<n[3])){s.label=o[1];break}if(6===o[0]&&s.label<n[1]){s.label=n[1],n=o;break}if(n&&s.label<n[2]){s.label=n[2],s.ops.push(o);break}n[2]&&s.ops.pop(),s.trys.pop();continue}o=t.call(e,s)}catch(e){o=[6,e],i=0}finally{r=n=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},u=function(){function e(){}return e.parse=function(e){var t=this;return new Promise((function(i,n){return s(t,void 0,void 0,(function(){var t,o,s,u,l,f;return a(this,(function(a){t=new Uint8Array(e),o=r(26).MovieEntity,s=r(43).Inflate;try{u=new s(t),l=u.decompress(),f=o.decode(l),i(f)}catch(e){n(e)}return[2]}))}))}))},e}(),l="__SVGA_isLoaded__",f=function(){function e(){}return e.padStart=function(e,t,r){return t>>=0,r=null==r||""===r?" ":String(r),e.length>t?String(e):((t-=e.length)>r.length&&(r+=r.repeat(t/r.length)),r.slice(0,t)+String(e))},e}(),h=function(){function e(){}return e.uint8ToString=function(e){for(var t=[],r=0,i=e.length;r<i;r+=32768)t.push(String.fromCharCode.apply(null,e.subarray(r,r+32768)));return t.join("")},e.createHexColor=function(e,t,r){return e>255&&(e=255),t>255&&(t=255),r>255&&(r=255),e<0&&(e=0),t<0&&(t=0),r<0&&(r=0),"#"+f.padStart(e.toString(16),2,"0")+f.padStart(t.toString(16),2,"0")+f.padStart(r.toString(16),2,"0")},e.createRgbColor=function(e,t,r){return e>255&&(e=255),t>255&&(t=255),r>255&&(r=255),e<0&&(e=0),t<0&&(t=0),r<0&&(r=0),"rgb("+e+", "+t+", "+r+")"},e.isIe=function(){return/(Trident|MSIE)/i.test(navigator.userAgent)},e.isSupportPath2d=function(){var e=/safari/i.test(navigator.userAgent)&&!/chrome/i.test(navigator.userAgent),t=/edge/i.test(navigator.userAgent);return"undefined"!=typeof Path2D&&!e&&!t},e}(),c=function(){function e(e){this._movieEntity=null,this._imageCache={},this._movieEntity=e.movieEntity}return e.prototype.getSpriteImage=function(e){if(!this._movieEntity)return null;var t=this._imageCache[e];if(t)return t;var r=(this._movieEntity.images||{})[e];if(r){var i=h.uint8ToString(r),n=new Image;return Object.defineProperty(n,l,{enumerable:!0,configurable:!0,value:!1,writable:!0}),n.onload=function(){n[l]=!0},n.src="data:image/png;base64,"+btoa(i),this._imageCache[e]=n,n}return null},e.prototype.destroy=function(){this._movieEntity=null,this._imageCache=null},e}(),p=function(){function e(){this._frame=0,this._isInPlay=!1,this._lastDrawFrame=0,this._isReversing=!1,this._loopStartFrame=-1,this._loopEndFrame=-1}return Object.defineProperty(e.prototype,"frame",{get:function(){return this._frame},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isInPlay",{get:function(){return this._isInPlay},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"lastDrawFrame",{get:function(){return this._lastDrawFrame},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isReversing",{get:function(){return this._isReversing},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"loopStartFrame",{get:function(){return this._loopStartFrame},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"loopEndFrame",{get:function(){return this._loopEndFrame},enumerable:!0,configurable:!0}),e.prototype.setFrame=function(e){this._frame=e},e.prototype.setPlayStatus=function(e){this._isInPlay=e},e.prototype.setLastDrawFrame=function(e){this._lastDrawFrame=e},e.prototype.setReversingStatus=function(e){this._isReversing=e},e.prototype.setLoopStartFrame=function(e){this._loopStartFrame=e},e.prototype.setLoopEndFrame=function(e){this._loopEndFrame=e},e.prototype.stepIntoPrevFrame=function(){var e=this._lastDrawFrame-1;e<this._loopEndFrame&&(e=this._loopStartFrame),this._frame=e},e.prototype.stepIntoNextFrame=function(){var e=this._lastDrawFrame+1;e>this._loopEndFrame&&(e=this._loopStartFrame),this._frame=e},e}(),d=function(){function e(){this.callbacks=[]}return e.prototype.on=function(e){this.callbacks.indexOf(e)<0&&this.callbacks.push(e)},e.prototype.off=function(e){var t=this.callbacks.indexOf(e);t>-1&&this.callbacks.splice(t,1)},e.prototype.emit=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.callbacks.forEach((function(t){return t.apply(void 0,e)}))},e.prototype.destroy=function(){this.callbacks=[]},e}();!function(e){e[e.Shape=0]="Shape",e[e.Rect=1]="Rect",e[e.Ellipse=2]="Ellipse",e[e.Keep=3]="Keep"}(i||(i={})),function(e){e[e.Butt=0]="Butt",e[e.Round=1]="Round",e[e.Square=2]="Square"}(n||(n={})),function(e){e[e.Miter=0]="Miter",e[e.Round=1]="Round",e[e.Bevel=2]="Bevel"}(o||(o={}));var y=h.isIe();function v(e,t){var r=t.styles;if(r){var i=r.stroke,s=r.lineCap,a=r.lineJoin,u=r.strokeWidth,l=r.miterlimit;switch(s){case n.Butt:e.lineCap="butt";break;case n.Round:e.lineCap="round";break;case n.Square:e.lineCap="square"}switch(a){case o.Bevel:e.lineJoin="bevel";break;case o.Miter:e.lineJoin="miter";break;case o.Round:e.lineJoin="round"}if(e.lineWidth=u,e.miterLimit=l,i){var f=Math.round(255*(i.r||0)),c=Math.round(255*(i.g||0)),p=Math.round(255*(i.b||0));e.strokeStyle=y?h.createRgbColor(f,c,p):h.createHexColor(f,c,p),e.globalAlpha=e.globalAlpha*(i.a||0)}}}function m(e,t){var r=t.styles;if(r){var i=r.fill;if(i){var n=Math.round(255*(i.r||0)),o=Math.round(255*(i.g||0)),s=Math.round(255*(i.b||0));e.fillStyle=y?h.createRgbColor(n,o,s):h.createHexColor(n,o,s),e.globalAlpha=e.globalAlpha*(i.a||0)}}}var g=/[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g,b=/-?[0-9]*\.?\d+/g;var w=window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return setTimeout((function(){return"function"==typeof e&&e()}))},_=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||function(e){return clearTimeout(e)},k=function(){function e(e){void 0===e&&(e=60),this._fps=0,this._msPerFrame=0,this._isStart=!1,this._onTick=null,this._rafId=null,this._lastFrameTs=0,this._fps=e,this._msPerFrame=1e3/e}return e.prototype._tick=function(){var e=this;if(this._isStart){if("function"==typeof this._onTick){var t=Date.now();t-this._lastFrameTs>=this._msPerFrame&&(this._onTick(),this._lastFrameTs=t)}this._rafId=w((function(){return e._tick()}))}},e.prototype.onTick=function(e){this._onTick=e},e.prototype.startTick=function(){this._isStart||(this._isStart=!0,this._tick())},e.prototype.stopTick=function(){this._isStart=!1,_(this._rafId)},e.prototype.destroy=function(){this.stopTick(),this._onTick=null},e}(),A=function(){function e(){}return e.isNumber=function(e){return"number"==typeof e},e.isBoolean=function(e){return"boolean"==typeof e},e.isFunction=function(e){return"function"==typeof e},e}(),O=h.isSupportPath2d(),S=function(){function e(e){this._canvas=null,this._context=null,this._movieEntity=null,this._imageController=null,this._playController=null,this._ticker=null,this._eventBus=null,this._isDestroyed=!1,this._lastShapeEntities={},this._svgCommandCache={},this._canvas=e.canvas,this._context=e.canvas.getContext("2d"),this._movieEntity=e.movieEntity,this._imageController=e.imageController,this._playController=e.playController,this._eventBus=e.eventBus,this._initTicker(e.fps)}return e.prototype._clearCanvas=function(){this._context.clearRect(0,0,this._canvas.width,this._canvas.height)},e.prototype._initTicker=function(e){var t=this,r=new k(e);r.onTick((function(){!t._isDestroyed&&t._playController.isInPlay&&t.tickFrame()})),this._ticker=r},e.prototype.startTick=function(){this._ticker.startTick()},e.prototype.stopTick=function(){this._ticker.stopTick()},e.prototype.tickFrame=function(){this._clearCanvas();for(var e=this._playController.frame,t=0,r=this._movieEntity.sprites;t<r.length;t++){var i=r[t];if(i){var n=this._imageController.getSpriteImage(i.imageKey);j(this._context,n,i,e,this._lastShapeEntities,this._svgCommandCache)}}this._playController.setLastDrawFrame(e),this._eventBus.emit(),this._playController.isReversing?this._playController.stepIntoPrevFrame():this._playController.stepIntoNextFrame()},e.prototype.destroy=function(){this._isDestroyed=!0,this._ticker.destroy(),this._ticker=null,this._eventBus=null,this._canvas=null,this._context=null,this._movieEntity=null,this._imageController=null,this._playController=null,this._lastShapeEntities={},this._svgCommandCache={}},e}();function j(e,t,r,i,n,o){var s=r.frames,a=r.imageKey,u=s[i];if(u){var f=u.alpha,h=u.transform,c=u.shapes,p=u.layout;if(p){if(e.save(),e.globalAlpha=f,h&&e.transform(h.a,h.b||0,h.c||0,h.d,h.tx,h.ty),Array.isArray(c))for(var d=0,y=c.length;d<y;d++){var v=c[d];v&&x(e,v,a,d,n,o,i)}var m=p.width,g=p.height,b=p.x||0,w=p.y||0;t&&t[l]&&(A.isNumber(m)&&A.isNumber(g)?e.drawImage(t,b,w,m,g):e.drawImage(t,b,w)),e.restore()}}}function x(e,t,r,n,o,s,a){o[r]||(o[r]=[]),e.save();var u=t.type,l=t,f=u===i.Keep,h=o[r][n];f&&h&&(l=o[r][n],u=h.type);var c=l.transform;switch(c&&e.transform(c.a,c.b,c.c,c.d,c.tx,c.ty),u){case i.Ellipse:if("function"==typeof e.ellipse){v(e,l),m(e,l);var p=l.ellipse;e.ellipse(p.x,p.y,p.radiusX,p.y,0,0,0)}break;case i.Rect:var d=l.rect;v(e,l),e.strokeRect(d.x,d.y,d.width,d.height),m(e,l),e.fillRect(d.x,d.y,d.width,d.height);break;case i.Shape:var y=l.shape,w=l.styles;if(!y)break;var _=y.d;if("string"==typeof _&&_)if(O){var k=new Path2D(_);v(e,l),e.stroke(k),m(e,l),e.fill(k,"evenodd")}else{var A=r+"."+n+"."+a,S=s[A];S||(S=function(e){for(var t=[],r=g.exec(e);null!==r;)t.push(r),r=g.exec(e);return t.map((function(t){return{marker:e[t.index],index:t.index}})).reduceRight((function(t,r){var i=e.substring(r.index,t.length?t[t.length-1].index:e.length);return t.concat([{marker:r.marker,index:r.index,chunk:i.length>0?i.substr(1,i.length-1):i}])}),[]).reverse().map((function(e){var t=e.chunk.match(b);return{marker:e.marker,values:t?t.map(parseFloat):[]}}))}(_),s[A]=S),function(e,t,r,i,n){e.save(),e.beginPath();for(var o=[0,0],s=[0,0],a=[0,0],u=0,l=r;u<l.length;u++){var f=l[u];switch(f.marker){case"z":case"Z":o=[0,0],e.closePath();break;case"m":o=[o[0]+f.values[0],o[1]+f.values[1]],e.moveTo(o[0],o[1]);break;case"M":o=[f.values[0],f.values[1]],e.moveTo(o[0],o[1]);break;case"l":o=[o[0]+f.values[0],o[1]+f.values[1]],e.lineTo(o[0],o[1]);break;case"L":o=[f.values[0],f.values[1]],e.lineTo(o[0],o[1]);break;case"h":o=[o[0]+f.values[0],o[1]],e.lineTo(o[0],o[1]);break;case"H":o=[f.values[0],o[1]],e.lineTo(o[0],o[1]);break;case"v":o=[o[0],o[1]+f.values[0]],e.lineTo(o[0],o[1]);break;case"V":o=[o[0],f.values[0]],e.lineTo(o[0],o[1]);break;case"c":s=[o[0]+f.values[0],o[1]+f.values[1]],a=[o[0]+f.values[2],o[1]+f.values[3]],o=[o[0]+f.values[4],o[1]+f.values[5]],e.bezierCurveTo(s[0],s[1],a[0],a[1],o[0],o[1]);break;case"C":s=[f.values[0],f.values[1]],a=[f.values[2],f.values[3]],o=[f.values[4],f.values[5]],e.bezierCurveTo(s[0],s[1],a[0],a[1],o[0],o[1])}}i&&(m(e,t),e.fill());n&&(v(e,t),e.stroke());e.restore()}(e,l,S,!!w&&!!w.fill,!!w&&!!w.stroke)}}o[r][n]=l,e.restore()}var E=function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var i=Array(e),n=0;for(t=0;t<r;t++)for(var o=arguments[t],s=0,a=o.length;s<a;s++,n++)i[n]=o[s];return i},T=function(){function e(){}return e.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];try{console.log.apply(console,E(["[SVGAPlus]"],e))}catch(e){}},e.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];try{console.warn.apply(console,E(["[SVGAPlus]"],e))}catch(e){}},e.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];try{console.error.apply(console,E(["[SVGAPlus]"],e))}catch(e){}},e}(),N=function(e,t,r,i){return new(r||(r=Promise))((function(n,o){function s(e){try{u(i.next(e))}catch(e){o(e)}}function a(e){try{u(i.throw(e))}catch(e){o(e)}}function u(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,a)}u((i=i.apply(e,t||[])).next())}))},C=function(e,t){var r,i,n,o,s={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,i&&(n=2&o[0]?i.return:o[0]?i.throw||((n=i.return)&&n.call(i),0):i.next)&&!(n=n.call(i,o[1])).done)return n;switch(i=0,n&&(o=[2&o[0],n.value]),o[0]){case 0:case 1:n=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,i=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(n=s.trys,(n=n.length>0&&n[n.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!n||o[1]>n[0]&&o[1]<n[3])){s.label=o[1];break}if(6===o[0]&&s.label<n[1]){s.label=n[1],n=o;break}if(n&&s.label<n[2]){s.label=n[2],s.ops.push(o);break}n[2]&&s.ops.pop(),s.trys.pop();continue}o=t.call(e,s)}catch(e){o=[6,e],i=0}finally{r=n=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},P=function(){function e(e){this._onPlayEvents=new d,this._rawBuffer=null,this._imageController=null,this._playController=new p,this._renderConstructor=S,this._renderer=null,this._canvas=null,this._isDestroyed=!1,this._movieEntity=null,this._fpsOverride=0;var t=e.element,r=e.buffer,i=e.fpsOverride,n=e.renderer;if(!t)throw new TypeError("option.element should be provide.");if(!r)throw new TypeError("option.buffer should be provide.");this._rawBuffer=r,this._canvas=t,this._fpsOverride=i,n&&(this._renderConstructor=n)}return e.loadSvgaFile=function(e){return new Promise((function(t,r){var i=new XMLHttpRequest;i.open("GET",e,!0),i.responseType="arraybuffer",i.onload=function(){t(i.response)},i.onerror=r,i.send(null)}))},Object.defineProperty(e.prototype,"renderer",{get:function(){return this._renderer},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isInPlay",{get:function(){return this._playController.isInPlay},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"_isMovieEntityReady",{get:function(){return!!this._movieEntity},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"fpsOverride",{get:function(){return this._fpsOverride},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"fps",{get:function(){var e,t,r;return A.isNumber(this._fpsOverride)&&this._fpsOverride>0?this._fpsOverride:null!=(r=null===(t=null===(e=this._movieEntity)||void 0===e?void 0:e.params)||void 0===t?void 0:t.fps)?r:24},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"frame",{get:function(){return this._playController.frame},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"frameCount",{get:function(){var e,t,r;return null!=(r=null===(t=null===(e=this._movieEntity)||void 0===e?void 0:e.params)||void 0===t?void 0:t.frames)?r:0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"maxFrame",{get:function(){return this.frameCount<1?0:this.frameCount-1},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"viewportWidth",{get:function(){var e,t,r;return null!=(r=null===(t=null===(e=this._movieEntity)||void 0===e?void 0:e.params)||void 0===t?void 0:t.viewBoxWidth)?r:0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"viewportHeight",{get:function(){var e,t,r;return null!=(r=null===(t=null===(e=this._movieEntity)||void 0===e?void 0:e.params)||void 0===t?void 0:t.viewBoxHeight)?r:0},enumerable:!0,configurable:!0}),e.prototype._initCanvasSize=function(){var e=this._movieEntity.params.viewBoxWidth,t=this._movieEntity.params.viewBoxHeight;this._canvas.width=e,this._canvas.height=t},e.prototype._startTick=function(){var e;null===(e=this._renderer)||void 0===e||e.startTick()},e.prototype._stopTick=function(){var e;null===(e=this._renderer)||void 0===e||e.stopTick()},e.prototype._setDefaultLoopFrames=function(){this._playController.setLoopStartFrame(0),this._playController.setLoopEndFrame(this.maxFrame)},e.prototype._initRenderer=function(){var e=new this._renderConstructor({canvas:this._canvas,movieEntity:this._movieEntity,imageController:this._imageController,playController:this._playController,eventBus:this._onPlayEvents,fps:this.fps});e.tickFrame(),this._renderer=e},e.prototype._init=function(){if(!this._isMovieEntityReady)throw new Error("MovieEntity should be initialized before canvas initialization.");this._imageController=new c({movieEntity:this._movieEntity}),this._setDefaultLoopFrames(),this._initCanvasSize(),this._initRenderer()},e.prototype.init=function(){return N(this,void 0,void 0,(function(){var e,t;return C(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),e=this,[4,u.parse(this._rawBuffer)];case 1:return e._movieEntity=r.sent(),this._init(),[3,3];case 2:return t=r.sent(),T.error("Parse svga failed:",t),[3,3];case 3:return[2]}}))}))},e.prototype.play=function(e,t){e=A.isNumber(e)?e:this._playController.loopStartFrame,t=A.isNumber(t)?t:this._playController.loopEndFrame,this.isInPlay||(e>t?(this._playController.setReversingStatus(!0),e>this.maxFrame&&(e=this.maxFrame),t<0&&(t=0)):(this._playController.setReversingStatus(!1),e<0&&(e=0),t>this.maxFrame&&(t=this.maxFrame)),this._playController.setLoopStartFrame(e),this._playController.setLoopEndFrame(t),this._playController.setFrame(e),this._playController.setPlayStatus(!0),this._startTick())},e.prototype.pause=function(){this.isInPlay&&(this._stopTick(),this._playController.setPlayStatus(!1))},e.prototype.stop=function(e){this._stopTick(),this._playController.setPlayStatus(!1),this._setDefaultLoopFrames(),A.isNumber(e)&&this.seek(e)},e.prototype.seek=function(e){var t=this;e<0&&(e=0),e>this.maxFrame&&(e=this.maxFrame),this._playController.setFrame(e),!this._isDestroyed&&!this.isInPlay&&w((function(){t._renderer.tickFrame({forceTick:!0})}))},e.prototype.playOnce=function(e,t){var r=this;return void 0===e&&(e=0),void 0===t&&(t=this.maxFrame),new Promise((function(i,n){return N(r,void 0,void 0,(function(){var r,n=this;return C(this,(function(o){return(r=e>t)?(e>this.maxFrame&&(e=this.maxFrame),t<0&&(t=0)):(e<0&&(e=0),t>this.maxFrame&&(t=this.maxFrame)),this._playController.setReversingStatus(r),this._playController.setLoopStartFrame(e),this._playController.setLoopEndFrame(t),this._playController.setFrame(e),this._onPlayEvents.off(this._playOnceOnPlayHandler),this._playOnceOnPlayHandler=function(){var e=n._playController.isReversing;(e&&n.frame<=t||!e&&n.frame>=t)&&(n.stop(),n._onPlayEvents.off(n._playOnceOnPlayHandler),i())},this.onPlay(this._playOnceOnPlayHandler),this.play(),[2]}))}))}))},e.prototype.onPlay=function(e){this._onPlayEvents.on(e)},e.prototype.offOnPlay=function(e){this._onPlayEvents.off(e)},e.prototype.destroy=function(){var e,t;return N(this,void 0,void 0,(function(){return C(this,(function(r){return this._isDestroyed=!0,this.stop(),null===(e=this._renderer)||void 0===e||e.destroy(),this._renderer=null,null===(t=this._imageController)||void 0===t||t.destroy(),this._imageController=null,this._onPlayEvents.destroy(),this._movieEntity=null,[2]}))}))},e}();r.d(t,"SVGAPlus",(function(){return P})),r.d(t,"SVGAParser",(function(){return u}))}])}));
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("regenerator-runtime/runtime");

var _core = require("@svgaplus/core");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import buffer from './demo.svga'
function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var buffer, sprite;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _core.SVGAPlus.loadSvgaFile('./demo.svga');

          case 2:
            buffer = _context.sent;
            // Or you can just prepare a copy of arary buffer.
            //   const buffer = new ArrayBuffer(...)
            // Create SVGAPlus.
            sprite = new _core.SVGAPlus({
              element: document.querySelector('#drawingCanvas'),
              buffer: buffer
            }); // Initialize SVGAPlus instance.

            _context.next = 6;
            return sprite.init();

          case 6:
            // Feel free to add a listener.
            sprite.onPlay(function () {
              console.log('current frame:', sprite.frame);
            }); // Play whole animation in loop.

            sprite.play(); // Play frame 1 - 5 in loop.

            sprite.play(0, 4); // Play frame 1 - 15 once.

            _context.next = 11;
            return sprite.playOnce(0, 14);

          case 11:
            _context.next = 13;
            return sprite.playOnce(9, 0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _main.apply(this, arguments);
}

main();
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","@svgaplus/core":"../node_modules/@svgaplus/core/dist/index.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55608" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/parcel-svga.e31bb0bc.js.map