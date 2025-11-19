var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (a) {
    var b = 0;
    return function () {
        return b < a.length ? {done: !1, value: a[b++]} : {done: !0}
    }
};
$jscomp.arrayIterator = function (a) {
    return {next: $jscomp.arrayIteratorImpl(a)}
};
$jscomp.makeIterator = function (a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.arrayFromIterator = function (a) {
    for (var b, c = []; !(b = a.next()).done;) c.push(b.value);
    return c
};
$jscomp.arrayFromIterable = function (a) {
    return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a))
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function (a) {
    var b = function () {
    };
    b.prototype = a;
    return new b
};
$jscomp.underscoreProtoCanBeSet = function () {
    var a = {a: !0}, b = {};
    try {
        return b.__proto__ = a, b.a
    } catch (c) {
    }
    return !1
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function (a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
    return a
} : null;
$jscomp.inherits = function (a, b) {
    a.prototype = $jscomp.objectCreate(b.prototype);
    a.prototype.constructor = a;
    if ($jscomp.setPrototypeOf) {
        var c = $jscomp.setPrototypeOf;
        c(a, b)
    } else for (c in b) if ("prototype" != c) if (Object.defineProperties) {
        var e = Object.getOwnPropertyDescriptor(b, c);
        e && Object.defineProperty(a, c, e)
    } else a[c] = b[c];
    a.superClass_ = b.prototype
};
$jscomp.getGlobal = function (a) {
    a = ["object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global, a];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c
    }
    throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value)
};
$jscomp.polyfill = function (a, b, c, e) {
    if (b) {
        c = $jscomp.global;
        a = a.split(".");
        for (e = 0; e < a.length - 1; e++) {
            var d = a[e];
            d in c || (c[d] = {});
            c = c[d]
        }
        a = a[a.length - 1];
        e = c[a];
        b = b(e);
        b != e && null != b && $jscomp.defineProperty(c, a, {configurable: !0, writable: !0, value: b})
    }
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function (a) {
    function b() {
        this.batch_ = null
    }

    function c(a) {
        return a instanceof d ? a : new d(function (b, c) {
            b(a)
        })
    }

    if (a && !$jscomp.FORCE_POLYFILL_PROMISE) return a;
    b.prototype.asyncExecute = function (a) {
        if (null == this.batch_) {
            this.batch_ = [];
            var b = this;
            this.asyncExecuteFunction(function () {
                b.executeBatch_()
            })
        }
        this.batch_.push(a)
    };
    var e = $jscomp.global.setTimeout;
    b.prototype.asyncExecuteFunction = function (a) {
        e(a, 0)
    };
    b.prototype.executeBatch_ = function () {
        for (; this.batch_ && this.batch_.length;) {
            var a =
                this.batch_;
            this.batch_ = [];
            for (var b = 0; b < a.length; ++b) {
                var c = a[b];
                a[b] = null;
                try {
                    c()
                } catch (m) {
                    this.asyncThrow_(m)
                }
            }
        }
        this.batch_ = null
    };
    b.prototype.asyncThrow_ = function (a) {
        this.asyncExecuteFunction(function () {
            throw a;
        })
    };
    var d = function (a) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var b = this.createResolveAndReject_();
        try {
            a(b.resolve, b.reject)
        } catch (l) {
            b.reject(l)
        }
    };
    d.prototype.createResolveAndReject_ = function () {
        function a(a) {
            return function (d) {
                c || (c = !0, a.call(b, d))
            }
        }

        var b = this, c = !1;
        return {resolve: a(this.resolveTo_), reject: a(this.reject_)}
    };
    d.prototype.resolveTo_ = function (a) {
        if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself")); else if (a instanceof d) this.settleSameAsPromise_(a); else {
            a:switch (typeof a) {
                case "object":
                    var b = null != a;
                    break a;
                case "function":
                    b = !0;
                    break a;
                default:
                    b = !1
            }
            b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
        }
    };
    d.prototype.resolveToNonPromiseObj_ = function (a) {
        var b = void 0;
        try {
            b = a.then
        } catch (l) {
            this.reject_(l);
            return
        }
        "function" == typeof b ?
            this.settleSameAsThenable_(b, a) : this.fulfill_(a)
    };
    d.prototype.reject_ = function (a) {
        this.settle_(2, a)
    };
    d.prototype.fulfill_ = function (a) {
        this.settle_(1, a)
    };
    d.prototype.settle_ = function (a, b) {
        if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
        this.state_ = a;
        this.result_ = b;
        this.executeOnSettledCallbacks_()
    };
    d.prototype.executeOnSettledCallbacks_ = function () {
        if (null != this.onSettledCallbacks_) {
            for (var a = 0; a < this.onSettledCallbacks_.length; ++a) f.asyncExecute(this.onSettledCallbacks_[a]);
            this.onSettledCallbacks_ = null
        }
    };
    var f = new b;
    d.prototype.settleSameAsPromise_ = function (a) {
        var b = this.createResolveAndReject_();
        a.callWhenSettled_(b.resolve, b.reject)
    };
    d.prototype.settleSameAsThenable_ = function (a, b) {
        var c = this.createResolveAndReject_();
        try {
            a.call(b, c.resolve, c.reject)
        } catch (m) {
            c.reject(m)
        }
    };
    d.prototype.then = function (a, b) {
        function c(a, b) {
            return "function" == typeof a ? function (b) {
                try {
                    f(a(b))
                } catch (q) {
                    e(q)
                }
            } : b
        }

        var f, e, g = new d(function (a, b) {
            f = a;
            e = b
        });
        this.callWhenSettled_(c(a, f), c(b, e));
        return g
    };
    d.prototype.catch = function (a) {
        return this.then(void 0, a)
    };
    d.prototype.callWhenSettled_ = function (a, b) {
        function c() {
            switch (d.state_) {
                case 1:
                    a(d.result_);
                    break;
                case 2:
                    b(d.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + d.state_);
            }
        }

        var d = this;
        null == this.onSettledCallbacks_ ? f.asyncExecute(c) : this.onSettledCallbacks_.push(c)
    };
    d.resolve = c;
    d.reject = function (a) {
        return new d(function (b, c) {
            c(a)
        })
    };
    d.race = function (a) {
        return new d(function (b, d) {
            for (var f = $jscomp.makeIterator(a), e = f.next(); !e.done; e = f.next()) c(e.value).callWhenSettled_(b,
                d)
        })
    };
    d.all = function (a) {
        var b = $jscomp.makeIterator(a), f = b.next();
        return f.done ? c([]) : new d(function (a, d) {
            function e(b) {
                return function (c) {
                    g[b] = c;
                    h--;
                    0 == h && a(g)
                }
            }

            var g = [], h = 0;
            do g.push(void 0), h++, c(f.value).callWhenSettled_(e(g.length - 1), d), f = b.next(); while (!f.done)
        })
    };
    return d
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () {
    $jscomp.initSymbol = function () {
    };
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.SymbolClass = function (a, b) {
    this.$jscomp$symbol$id_ = a;
    $jscomp.defineProperty(this, "description", {configurable: !0, writable: !0, value: b})
};
$jscomp.SymbolClass.prototype.toString = function () {
    return this.$jscomp$symbol$id_
};
$jscomp.Symbol = function () {
    function a(c) {
        if (this instanceof a) throw new TypeError("Symbol is not a constructor");
        return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX + (c || "") + "_" + b++, c)
    }

    var b = 0;
    return a
}();
$jscomp.initSymbolIterator = function () {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
        }
    });
    $jscomp.initSymbolIterator = function () {
    }
};
$jscomp.initSymbolAsyncIterator = function () {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.asyncIterator;
    a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function () {
    }
};
$jscomp.iteratorPrototype = function (a) {
    $jscomp.initSymbolIterator();
    a = {next: a};
    a[$jscomp.global.Symbol.iterator] = function () {
        return this
    };
    return a
};
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function (a) {
    if (!(a instanceof Object)) throw new TypeError("Iterator result " + a + " is not an object");
};
$jscomp.generator.Context = function () {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null
};
$jscomp.generator.Context.prototype.start_ = function () {
    if (this.isRunning_) throw new TypeError("Generator is already running");
    this.isRunning_ = !0
};
$jscomp.generator.Context.prototype.stop_ = function () {
    this.isRunning_ = !1
};
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function () {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_
};
$jscomp.generator.Context.prototype.next_ = function (a) {
    this.yieldResult = a
};
$jscomp.generator.Context.prototype.throw_ = function (a) {
    this.abruptCompletion_ = {exception: a, isException: !0};
    this.jumpToErrorHandler_()
};
$jscomp.generator.Context.prototype.return = function (a) {
    this.abruptCompletion_ = {return: a};
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function (a) {
    this.abruptCompletion_ = {jumpTo: a};
    this.nextAddress = this.finallyAddress_
};
$jscomp.generator.Context.prototype.yield = function (a, b) {
    this.nextAddress = b;
    return {value: a}
};
$jscomp.generator.Context.prototype.yieldAll = function (a, b) {
    a = $jscomp.makeIterator(a);
    var c = a.next();
    $jscomp.generator.ensureIteratorResultIsObject_(c);
    if (c.done) this.yieldResult = c.value, this.nextAddress = b; else return this.yieldAllIterator_ = a, this.yield(c.value, b)
};
$jscomp.generator.Context.prototype.jumpTo = function (a) {
    this.nextAddress = a
};
$jscomp.generator.Context.prototype.jumpToEnd = function () {
    this.nextAddress = 0
};
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function (a, b) {
    this.catchAddress_ = a;
    void 0 != b && (this.finallyAddress_ = b)
};
$jscomp.generator.Context.prototype.setFinallyBlock = function (a) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = a || 0
};
$jscomp.generator.Context.prototype.leaveTryBlock = function (a, b) {
    this.nextAddress = a;
    this.catchAddress_ = b || 0
};
$jscomp.generator.Context.prototype.enterCatchBlock = function (a) {
    this.catchAddress_ = a || 0;
    a = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return a
};
$jscomp.generator.Context.prototype.enterFinallyBlock = function (a, b, c) {
    c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
    this.catchAddress_ = a || 0;
    this.finallyAddress_ = b || 0
};
$jscomp.generator.Context.prototype.leaveFinallyBlock = function (a, b) {
    b = this.finallyContexts_.splice(b || 0)[0];
    if (b = this.abruptCompletion_ = this.abruptCompletion_ || b) {
        if (b.isException) return this.jumpToErrorHandler_();
        void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? (this.nextAddress = b.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
    } else this.nextAddress = a
};
$jscomp.generator.Context.prototype.forIn = function (a) {
    return new $jscomp.generator.Context.PropertyIterator(a)
};
$jscomp.generator.Context.PropertyIterator = function (a) {
    this.object_ = a;
    this.properties_ = [];
    for (var b in a) this.properties_.push(b);
    this.properties_.reverse()
};
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function () {
    for (; 0 < this.properties_.length;) {
        var a = this.properties_.pop();
        if (a in this.object_) return a
    }
    return null
};
$jscomp.generator.Engine_ = function (a) {
    this.context_ = new $jscomp.generator.Context;
    this.program_ = a
};
$jscomp.generator.Engine_.prototype.next_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
    this.context_.next_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.return_ = function (a) {
    this.context_.start_();
    var b = this.context_.yieldAllIterator_;
    if (b) return this.yieldAllStep_("return" in b ? b["return"] : function (a) {
        return {value: a, done: !0}
    }, a, this.context_.return);
    this.context_.return(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.throw_ = function (a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
    this.context_.throw_(a);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function (a, b, c) {
    try {
        var e = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(e);
        if (!e.done) return this.context_.stop_(), e;
        var d = e.value
    } catch (f) {
        return this.context_.yieldAllIterator_ = null, this.context_.throw_(f), this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    c.call(this.context_, d);
    return this.nextStep_()
};
$jscomp.generator.Engine_.prototype.nextStep_ = function () {
    for (; this.context_.nextAddress;) try {
        var a = this.program_(this.context_);
        if (a) return this.context_.stop_(), {value: a.value, done: !1}
    } catch (b) {
        this.context_.yieldResult = void 0, this.context_.throw_(b)
    }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        a = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (a.isException) throw a.exception;
        return {value: a.return, done: !0}
    }
    return {value: void 0, done: !0}
};
$jscomp.generator.Generator_ = function (a) {
    this.next = function (b) {
        return a.next_(b)
    };
    this.throw = function (b) {
        return a.throw_(b)
    };
    this.return = function (b) {
        return a.return_(b)
    };
    $jscomp.initSymbolIterator();
    this[Symbol.iterator] = function () {
        return this
    }
};
$jscomp.generator.createGenerator = function (a, b) {
    b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
    $jscomp.setPrototypeOf && $jscomp.setPrototypeOf(b, a.prototype);
    return b
};
$jscomp.asyncExecutePromiseGenerator = function (a) {
    function b(b) {
        return a.next(b)
    }

    function c(b) {
        return a.throw(b)
    }

    return new Promise(function (e, d) {
        function f(a) {
            a.done ? e(a.value) : Promise.resolve(a.value).then(b, c).then(f, d)
        }

        f(a.next())
    })
};
$jscomp.asyncExecutePromiseGeneratorFunction = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(a())
};
$jscomp.asyncExecutePromiseGeneratorProgram = function (a) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
};
$jscomp.polyfill("Math.log2", function (a) {
    return a ? a : function (a) {
        return Math.log(a) / Math.LN2
    }
}, "es6", "es3");
$jscomp.findInternal = function (a, b, c) {
    a instanceof String && (a = String(a));
    for (var e = a.length, d = 0; d < e; d++) {
        var f = a[d];
        if (b.call(c, f, d, a)) return {i: d, v: f}
    }
    return {i: -1, v: void 0}
};
$jscomp.polyfill("Array.prototype.find", function (a) {
    return a ? a : function (a, c) {
        return $jscomp.findInternal(this, a, c).v
    }
}, "es6", "es3");
$jscomp.iteratorFromArray = function (a, b) {
    $jscomp.initSymbolIterator();
    a instanceof String && (a += "");
    var c = 0, e = {
        next: function () {
            if (c < a.length) {
                var d = c++;
                return {value: b(d, a[d]), done: !1}
            }
            e.next = function () {
                return {done: !0, value: void 0}
            };
            return e.next()
        }
    };
    e[Symbol.iterator] = function () {
        return e
    };
    return e
};
$jscomp.polyfill("Array.prototype.keys", function (a) {
    return a ? a : function () {
        return $jscomp.iteratorFromArray(this, function (a) {
            return a
        })
    }
}, "es6", "es3");

function addClass(a, b) {
    -1 == a.className.split(" ").indexOf(b) && (0 < a.className.length && " " === a.className.charAt(a.className.length - 1) ? a.className += b : a.className += " " + b)
}

function removeClass(a, b) {
    a.className = a.className.replace(b, "")
}

function getAuxIDFromHash() {
    var a = window.location.hash.split("=");
    return "#aux" == a[0] ? a[1] : !1
}

function rgb(a) {
    return (a = a.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d{1,3})\))?/)) ? {
        red: a[1],
        green: a[2],
        blue: a[3],
        alpha: a[4]
    } : {}
}

function rgb_fromHex(a) {
    return (a = a.match(/#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/)) ? {
        red: parseInt(a[1], 16),
        green: parseInt(a[2], 16),
        blue: parseInt(a[3], 16)
    } : {}
}

function color_string(a) {
    return "rgb(" + a.red + "," + a.green + "," + a.blue + ")"
}

function mix_color(a, b, c) {
    return {
        red: a.red * c + b.red * (1 - c),
        green: a.green * c + b.green * (1 - c),
        blue: a.blue * c + b.blue * (1 - c)
    }
};var DomElement = function (a, b) {
    this.parent = a;
    this.element = b
};
DomElement.prototype._hide = function () {
    void 0 != this.element && (addClass(this.element, "widget_hidden"), removeClass(this.element, "widget_display"))
};
DomElement.prototype._display = function () {
    void 0 != this.element && (removeClass(this.element, "widget_hidden"), addClass(this.element, "widget_display"))
};
DomElement.prototype.text = function () {
    return "DomElement"
};
DomElement.prototype.onUpdate = function () {
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (a) {
        a.jumpToEnd()
    })
};
DomElement.prototype.onShow = function () {
};
DomElement.prototype.onClose = function () {
};
DomElement.prototype.remove = function () {
    this.parent && this.element && this.parent.removeChild(this.element)
};
var WidgetManager = function () {
    this.widgets = [];
    this.menu = document.createElement("div");
    this.menu_list = document.createElement("ul");
    addClass(this.menu, "container");
    addClass(this.menu_list, "menu");
    this.menu.appendChild(this.menu_list);
    document.body.appendChild(this.menu);
    this.interval = void 0
};
WidgetManager.prototype.add_to_menu = function (a) {
    var b = document.createElement("li");
    addClass(b, "menu");
    var c = document.createElement("a");
    c.innerHTML = a.text();
    c.href = "#";
    c.onclick = function () {
        this.leave();
        for (var b = this.menu_list.getElementsByClassName("active"), d = 0; d < b.length; d++) removeClass(b[d], "active");
        addClass(c, "active");
        this.show(a)
    }.bind(this);
    b.appendChild(c);
    this.menu_list.appendChild(b)
};
WidgetManager.prototype.show = function (a) {
    var b = this.widgets[this.widgets.length - 1];
    this.widgets.push(a);
    a && (a._display(), a.onShow());
    0 != this.widgets.length && (b && (b._hide(), b.onClose()), clearInterval(this.interval), this.interval = setInterval(function () {
        a.onUpdate()
    }, 1E3))
};
WidgetManager.prototype.leave = function () {
    var a = this.widgets.pop();
    a && (a._hide(), a.onClose());
    0 != this.widgets.length && (a = this.widgets[this.widgets.length - 1]) && (a._display(), a.onShow())
};
var AuxWidget = function (a) {
    var b = document.createElement("div");
    b.id = "aux_container";
    addClass(b, "container");
    var c = document.createElement("div");
    c.id = "aux";
    b.appendChild(c);
    a.appendChild(b);
    DomElement.call(this, a, b);
    this.controller = c;
    this.aux_controls = []
};
$jscomp.inherits(AuxWidget, DomElement);
AuxWidget.prototype.text = function () {
    return "AUX"
};
AuxWidget.prototype._add_aux_bar = function (a) {
    var b = void 0;
    0 == this.aux_controls.hasOwnProperty(a.uuid) ? (b = new Buttonbar(this.controller), b.uuid = a.uuid, this.aux_controls[a.uuid] = b) : b = this.aux_controls[a.uuid];
    b.aux_name = a.name;
    b.text = a.name;
    b.checked = !0;
    b.forEach(function (a) {
        a.checked = !1
    });
    for (var c in a.sources) {
        var e = a.sources[c], d = b.getButton(c);
        d || (d = b.addButton());
        d.label = e;
        d.checked = !0;
        d.source_name = e;
        d.element.onclick = function () {
            a.source = this.source_name;
            request("PATCH", "/aux/" + a.uuid, JSON.stringify(a),
                "application/json")
        }.bind(d);
        d.update();
        d.label = e;
        a.source == e ? (d.col1 = "#888888", d.col2 = "#dddddd") : (d.col1 = "#555555", d.col2 = "#aaaaaa");
        d.update()
    }
    c = b.findAny(function (a) {
        return 0 == a.checked
    });
    for (var f in c) b.removeButton(c[f]);
    b.update()
};
AuxWidget.prototype.onUpdate = function () {
    var a = this, b, c, e, d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
        if (1 == g.nextAddress) return g.yield(request("GET", "/aux"), 2);
        b = g.yieldResult;
        c = database.aux;
        database.aux = JSON.parse(b);
        e = !1;
        for (d in database.aux) c && c[d] && c[d].name === database.aux[d].name || (e = !0);
        if (e) for (f in a.aux_controls) a.aux_controls[f].remove(), delete a.aux_controls[f];
        for (f in a.aux_controls) a.aux_controls[f].checked = !1;
        for (d = 0; d < database.aux.length; d++) a._add_aux_bar(database.aux[d]);
        for (f in a.aux_controls) !1 === a.aux_controls[f].checked && (a.aux_controls[f].remove(), delete a.aux_controls[f]);
        g.jumpToEnd()
    })
};
AuxWidget.prototype.onShow = function () {
    this.onUpdate()
};
AuxWidget.prototype.onClose = function () {
};
var AuxDelegationWidget = function (a) {
    var b = document.createElement("div");
    b.id = "aux_delegation_container";
    addClass(b, "container");
    var c = document.createElement("div");
    c.id = "aux_delegation";
    b.appendChild(c);
    a.appendChild(b);
    DomElement.call(this, a, b);
    this.controller = c;
    this.delegation = new Buttonbar(c);
    this.delegation.text = "Delegation";
    this.aux_control = new Buttonbar(c);
    this.active = null;
    this.filter = void 0
};
$jscomp.inherits(AuxDelegationWidget, DomElement);
AuxDelegationWidget.prototype.text = function () {
    return "AUX Delegation"
};
AuxDelegationWidget.prototype.update_delegation_bar = function (a) {
    this.delegation.forEach(function (a) {
        a.checked = !1
    });
    for (var b = 0; b < a.length; b++) {
        var c = a[b], e = this.delegation.getButton(b);
        null === e && (e = this.delegation.addButton());
        e.checked = !0;
        e.label = c.name;
        e.control = this;
        e.element.onclick = function () {
            this.control.active !== this && (this.active(), this.update(), null !== this.control.active && (this.control.active.normal(), this.control.active.update()), this.control.active = this, this.control.aux_control.clear(),
                this.control.update_active_aux_control())
        }.bind(e);
        e.update()
    }
    a = this.delegation.findAny(function (a) {
        return !1 === a.checked
    });
    for (var d in a) this.active === a[d] && (this.active = null, this.aux_control.clear(), this.aux_control.update(), this.aux_control.text = "", this.update_active_aux_control(), console.log("Removed aux source select because of inactive item")), this.delegation.removeButton(a[d])
};
AuxDelegationWidget.prototype.update_active_aux_control = function () {
    if (null !== this.active) {
        this.aux_control.forEach(function (a) {
            a.checked = !1
        });
        for (var a = this.active.label, b = null, c = 0; c < database.aux.length; c++) if (database.aux[c].name === a) {
            b = database.aux[c];
            break
        }
        if (null !== b) {
            for (var e in b.sources) {
                c = b.sources[e];
                var d = this.aux_control.getButton(e);
                null === d && (d = this.aux_control.addButton());
                d.label = c;
                d.data = b;
                d.element.onclick = function () {
                    this.data.source = this.label;
                    request("PATCH", "/aux/" + this.data.uuid,
                        JSON.stringify(this.data), "application/json")
                }.bind(d);
                d.update();
                d.checked = !0
            }
            this.aux_control.text = a;
            a = this.aux_control.findAny(function (a) {
                return !1 === a.checked
            });
            for (var f in a) this.aux_control.removeButton(a[f]);
            this.aux_control.forEach(function (a) {
                a.label === b.source ? a.active() : a.normal();
                a.update()
            });
            this.aux_control.update()
        }
    }
};
AuxDelegationWidget.prototype.onUpdate = function () {
    var a = this, b;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
        switch (c.nextAddress) {
            case 1:
                return a.filter = getAuxIDFromHash(), !1 !== a.filter ? c.yield(request("GET", "/aux/" + a.filter), 5) : c.yield(request("GET", "/aux"), 4);
            case 4:
                b = c.yieldResult;
                database.aux = JSON.parse(b);
                c.jumpTo(3);
                break;
            case 5:
                b = c.yieldResult, database.aux = [], database.aux.push(JSON.parse(b));
            case 3:
                a.update_delegation_bar(database.aux), !1 !== a.filter && 1 < a.delegation.buttons.length &&
                (a.delegation.removeButton(a.delegation.buttons[0]), a.active = null, a.aux_control.clear(), a.aux_control.text = ""), a.update_active_aux_control(), a.delegation.update(), a.aux_control.update(), c.jumpToEnd()
        }
    })
};
AuxDelegationWidget.prototype.onShow = function () {
    this.onUpdate()
};
AuxDelegationWidget.prototype.onClose = function () {
};
var Button = function (a, b, c, e, d) {
    b = void 0 === b ? "" : b;
    c = void 0 === c ? "#555555" : c;
    e = void 0 === e ? "#aaaaaa" : e;
    d = void 0 === d ? "#000000" : d;
    var f = create_svg_button(c, e, b, d);
    DomElement.call(this, a, f);
    this.col1 = c;
    this.col2 = e;
    this.lbl = b;
    this.textcol = d;
    this.element.style.width = "40px";
    this.element.style.height = "40px";
    this.element.style.display = "inline-block";
    this.element.style.marginLeft = "5px";
    this.element.style.marginRight = "5px"
};
$jscomp.inherits(Button, DomElement);
Button.prototype.active = function (a) {
    if (void 0 === a) this.color1 = database.settings.button.active.col1, this.color2 = database.settings.button.active.col2; else {
        var b = rgb_fromHex(database.settings.button.active.col1),
            c = rgb_fromHex(database.settings.button.active.col2);
        b = mix_color(a, b, .33);
        a = mix_color(a, c, .33);
        this.color1 = color_string(b);
        this.color2 = color_string(a)
    }
    this.textcolor = database.settings.button.active.textcol
};
Button.prototype.active_border = function () {
    this.element.style.border = "1px solid red"
};
Button.prototype.normal_border = function () {
    this.element.style.border = ""
};
Button.prototype.normal = function (a) {
    if (void 0 === a) this.color1 = database.settings.button.default.col1, this.color2 = database.settings.button.default.col2; else {
        var b = rgb_fromHex(database.settings.button.default.col1),
            c = rgb_fromHex(database.settings.button.default.col2);
        b = mix_color(a, b, .33);
        a = mix_color(a, c, .33);
        this.color1 = color_string(b);
        this.color2 = color_string(a)
    }
    this.textcolor = database.settings.button.default.textcol
};
Button.prototype.update = function () {
    update_svg_button(this.element, this.col1, this.col2, this.lbl, this.textcol)
};
$jscomp.global.Object.defineProperties(Button.prototype, {
    width: {
        configurable: !0, enumerable: !0, set: function (a) {
            this.element.style.width = a - 5 + "px"
        }
    }, height: {
        configurable: !0, enumerable: !0, set: function (a) {
            this.element.style.height = a - 5 + "px"
        }
    }, color1: {
        configurable: !0, enumerable: !0, set: function (a) {
            this.col1 = a
        }
    }, color2: {
        configurable: !0, enumerable: !0, set: function (a) {
            this.col2 = a
        }
    }, label: {
        configurable: !0, enumerable: !0, set: function (a) {
            this.lbl = a
        }, get: function () {
            return this.lbl
        }
    }, textcolor: {
        configurable: !0, enumerable: !0,
        set: function (a) {
            this.textcol = a
        }
    }
});
var Buttonbar = function (a, b) {
    var c = document.createElement("div");
    void 0 === b ? a.appendChild(c) : a.insertBefore(c, b);
    DomElement.call(this, a, c);
    this._label_width = 140;
    this._button_height = this._button_width = 50;
    this.element.style.marginTop = "0px";
    this.element.style.marginBottom = "0px";
    this.element.style.minHeight = this._button_height + 10 + "px";
    this.element.style.backgroundColor = "#222222";
    addClass(this.element, "flexbox");
    this.w = 32;
    this.buttons = [];
    this.shiftlevel = 0;
    this.label = document.createElement("div");
    this.label.style.width =
        this._label_width + "px";
    this.label.style.alignSelf = "center";
    this.label.style.overflowWrap = "break-word";
    this.element.appendChild(this.label);
    this.shiftButton = new Button(void 0, "", database.settings.button.shift.col1, database.settings.button.shift.col2, database.settings.button.shift.textcol);
    this.emptyButton = new Button(void 0, "", database.settings.button.disabled.col1, database.settings.button.disabled.col2, database.settings.button.disabled.textcol);
    this.shiftButton.width = this._button_width;
    this.shiftButton.height =
        this._button_height;
    this.emptyButton.width = this._button_width;
    this.emptyButton.height = this._button_height;
    this.shiftlevel = 0;
    this.shiftButton.element.onclick = this.shiftButtonClickHandler.bind(this)
};
$jscomp.inherits(Buttonbar, DomElement);
Buttonbar.prototype.resizeHandler = function () {
    this.aw = Math.floor((this.element.offsetWidth - this._label_width) / this._button_width);
    this.aw > this.w && (this.aw = this.w)
};
Buttonbar.prototype.shiftButtonClickHandler = function () {
    this.shiftlevel += 1;
    this.shiftlevel * (this.actual_width - (this.actual_width < this.buttons.length ? 1 : 0)) > this.buttons.length && (this.shiftlevel = 0);
    this.update()
};
Buttonbar.prototype.getButton = function (a) {
    return this.buttons.length <= a || 0 > a ? null : this.buttons[a]
};
Buttonbar.prototype.addButton = function () {
    var a = new Button;
    a.element.onmouseenter = function (b) {
        a.timeout = setTimeout(function () {
            var b = document.getElementById("tooltip");
            addClass(b, "shown");
            removeClass(b, "hidden");
            b.innerText = a.label;
            var e = a.element.getBoundingClientRect(), d = b.getBoundingClientRect();
            b.style.left = e.left + "px";
            b.style.top = e.top - d.height - 20 + "px";
            a.timeout = null
        }, 500)
    }.bind(this);
    a.element.onmouseleave = function () {
        if (null == a.timeout) {
            var b = document.getElementById("tooltip");
            addClass(b, "hidden");
            removeClass(b, "shown")
        } else clearTimeout(a.timeout)
    }.bind(this);
    this.buttons.push(a);
    a.width = this._button_width;
    a.height = this._button_height;
    return a
};
Buttonbar.prototype.removeButton = function (a) {
    a = this.buttons.indexOf(a);
    -1 != a && this.buttons.splice(a, 1)
};
Buttonbar.prototype.find = function (a) {
    for (var b in this.buttons) if (a(this.buttons[b])) return this.buttons[b];
    return null
};
Buttonbar.prototype.findAny = function (a) {
    var b = [], c;
    for (c in this.buttons) a(this.buttons[c]) && b.push(this.buttons[c]);
    return b
};
Buttonbar.prototype.forEach = function (a) {
    for (var b in this.buttons) void 0 != this.buttons[b] && a(this.buttons[b])
};
Buttonbar.prototype.clear = function () {
    this.buttons = []
};
Buttonbar.prototype.update = function () {
    this.element.innerHTML = "";
    this.element.appendChild(this.label);
    this.resizeHandler();
    for (var a = this.actual_width < this.buttons.length ? 1 : 0, b = this.shiftlevel * (this.actual_width - a), c = 0; c < this.actual_width - a; c++) c + b < this.buttons.length ? this.element.appendChild(this.buttons[b + c].element) : this.element.appendChild(this.emptyButton.element.cloneNode(!0));
    1 == a && (this.shiftButton.label = this.shiftlevel + 1 + "st nd rd th th th th th th th".split(" ")[this.shiftlevel], this.shiftButton.update(),
        this.element.appendChild(this.shiftButton.element))
};
$jscomp.global.Object.defineProperties(Buttonbar.prototype, {
    width: {
        configurable: !0,
        enumerable: !0,
        set: function (a) {
            0 > a || 32 < a ? console.log("Buttonbar width out of range") : this.w = a
        },
        get: function () {
            return this.w
        }
    }, actual_width: {
        configurable: !0, enumerable: !0, get: function () {
            return this.aw
        }
    }, text: {
        configurable: !0, enumerable: !0, set: function (a) {
            this.label.innerHTML = a
        }
    }
});
var DelegationBar = function (a) {
    Buttonbar.call(this, a);
    this.delegates = []
};
$jscomp.inherits(DelegationBar, Buttonbar);
var InputWidget = function (a) {
    var b = document.createElement("div");
    b.id = "inputs_container";
    addClass(b, "container");
    var c = document.createElement("div");
    c.id = "inputs";
    b.appendChild(c);
    a.appendChild(b);
    DomElement.call(this, a, b);
    this.controller = c
};
$jscomp.inherits(InputWidget, DomElement);
InputWidget.prototype.text = function () {
    return "Inputs"
};
InputWidget.prototype._add_input_view = function (a) {
    if (0 == database.input_controls.hasOwnProperty(a.name)) {
        var b = document.createElement("DIV");
        b.input = a.name;
        b.innerHTML = a.name;
        this.controller.appendChild(b);
        database.input_controls[a.name] = b
    } else b = database.input_controls[a.name];
    b.checked = !0;
    var c = "Icons/common/Tally-off-icon24x24.png Icons/common/Tally-red-icon24x24.png Icons/common/Tally-green-icon24x24.png Icons/common/Tally-yellow-icon24x24.png Icons/common/Tally-blue-icon24x24.png Icons/common/Tally-magenta-icon24x24.png Icons/common/Tally-cyan-icon24x24.png Icons/common/Tally-off-icon24x24.png".split(" ");
    a = Math.log2(a.tally & -a.tally) + 1;
    -Infinity == a && (a = 0);
    a >= c.length && (a = c.length - 1);
    b.style.backgroundImage = "url(" + c[a] + ")";
    addClass(b, "tally")
};
InputWidget.prototype.onUpdate = function () {
    var a = this, b, c, e, d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
        if (1 == g.nextAddress) return g.yield(request("GET", "/inputs"), 2);
        b = g.yieldResult;
        c = database.inputs;
        database.inputs = JSON.parse(b);
        e = !1;
        for (d in database.inputs) c && c[d] && c[d].name === database.inputs[d].name || (e = !0);
        if (e) for (f in database.input_controls) database.input_controls[f].remove(), delete database.input_controls[f];
        for (f in database.input_controls) database.input_controls[f].checked =
            !1;
        for (d = 0; d < database.inputs.length; d++) a._add_input_view(database.inputs[d]);
        for (f in database.input_controls) !1 === database.input_controls[f].checked && (database.input_controls[f].remove(), delete database.input_controls[f]);
        g.jumpToEnd()
    })
};
InputWidget.prototype.onShow = function () {
    this.onUpdate()
};
InputWidget.prototype.onClose = function () {
};
var MacroWidget = function (a) {
    var b = document.createElement("div");
    b.id = "macro_container";
    addClass(b, "container");
    var c = document.createElement("div");
    c.id = "macros";
    b.appendChild(c);
    a.appendChild(b);
    DomElement.call(this, a, b);
    this.controller = c;
    this.button_bar = new Buttonbar(this.controller);
    this.button_bar.text = "Macros";
    this.active = null
};
$jscomp.inherits(MacroWidget, DomElement);
MacroWidget.prototype.text = function () {
    return "Macros"
};
MacroWidget.prototype._add_macro_button = function (a) {
    var b = this.button_bar.find(function (b) {
        return b.label == a.path + a.name
    });
    null == b && (b = this.button_bar.addButton(), b.label = a.path + a.name, b.macro_name = a.name, b.macro_path = a.path, b.macro_uuid = a.uuid, b.color = a.color, b.element.onclick = function () {
        this.active && (this.active.normal(rgb(this.active.color)), this.active.normal_border(), this.active.update());
        this.active = b;
        this.active.active(rgb(this.active.color));
        this.active.active_border();
        this.active.update();
        request("PATCH", "/macros/" + b.macro_uuid, JSON.stringify({state: "play"}), "application/json")
    }.bind(this));
    b.checked = !0;
    b.color = a.color;
    b == this.active ? b.active(rgb(b.color)) : b.normal(rgb(b.color));
    b.update();
    return b
};
MacroWidget.prototype.onUpdate = function () {
    var a = this, b, c, e, d;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (f) {
        if (1 == f.nextAddress) return f.yield(request("GET", "/macros"), 2);
        b = f.yieldResult;
        database.macros = JSON.parse(b);
        a.button_bar.forEach(function (a) {
            a.checked = !1
        });
        for (c = 0; c < database.macros.length; c++) a._add_macro_button(database.macros[c]);
        e = a.button_bar.findAny(function (a) {
            return 0 == a.checked
        });
        for (d in e) a.button_bar.removeButton(e[d]);
        a.button_bar.update();
        f.jumpToEnd()
    })
};
MacroWidget.prototype.onShow = function () {
    this.onUpdate()
};
MacroWidget.prototype.onClose = function () {
};
var MultiviewerWidget = function (a) {
    var b = document.createElement("div");
    b.id = "multiviewers_container";
    addClass(b, "container");
    var c = document.createElement("div");
    c.id = "multiviewers";
    b.appendChild(c);
    a.appendChild(b);
    DomElement.call(this, a, b);
    this.controller = c;
    this.multiviewer_controls = [];
    this.active_buttons = [null, null]
};
$jscomp.inherits(MultiviewerWidget, DomElement);
MultiviewerWidget.prototype._add_multiviewer_view = function (a) {
    var b = void 0;
    0 == this.multiviewer_controls.hasOwnProperty(a.name) ? (b = new Buttonbar(this.controller), b.mv_name = a.name, b.text = "<a style='color:white;' target='_blank' href='/multiviewers/" + a.name + "/sdp'>" + a.name + "</a>", this.multiviewer_controls[a.name] = b) : b = this.multiviewer_controls[a.name];
    var c = a.presets, e = 0, d;
    for (d in c) {
        var f = c[d];
        if (null != f) {
            var g = b.getButton(e.toString());
            e++;
            null == g && (g = b.addButton());
            g.label = f.name;
            g.preset_id = f.id;
            g.mv = a.name;
            g.mv_uuid = a.uuid;
            var h = this;
            g.element.onclick = function () {
                a.preset = this.preset_id;
                request("PATCH", "/multiviewers/" + this.mv_uuid, JSON.stringify(a), "application/json");
                var b = h.active_buttons[a.index];
                b && b.normal();
                h.active_buttons[a.index] = this;
                this.active()
            }.bind(g);
            g.update()
        }
    }
    b.update()
};
MultiviewerWidget.prototype.text = function () {
    return "Multiviewer"
};
MultiviewerWidget.prototype.onUpdate = function () {
    var a = this, b, c, e;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (d) {
        if (1 == d.nextAddress) return d.yield(request("GET", "/multiviewers"), 2);
        b = d.yieldResult;
        database.multiviewers = JSON.parse(b);
        c = a;
        Object.keys(a.multiviewer_controls).forEach(function (a) {
            c.multiviewer_controls[a].checked = !1
        });
        for (e = 0; e < database.multiviewers.length; e++) a._add_multiviewer_view(database.multiviewers[e]), a.multiviewer_controls.hasOwnProperty(database.multiviewers[e].name) &&
        (a.multiviewer_controls[database.multiviewers[e].name].checked = !0);
        Object.keys(a.multiviewer_controls).forEach(function (a) {
            0 == c.multiviewer_controls[a].checked && (c.multiviewer_controls[a].remove(), delete c.multiviewer_controls[a])
        });
        d.jumpToEnd()
    })
};
MultiviewerWidget.prototype.onShow = function () {
    this.onUpdate()
};
MultiviewerWidget.prototype.onClose = function () {
};
var database = {
    aux: null,
    inputs: null,
    macros: null,
    multiviewers: null,
    scenes: null,
    aux_controls: [],
    input_controls: [],
    macro_controls: [],
    settings: {
        button: {
            default: {col1: "#555555", col2: "#aaaaaa", textcol: "#000000"},
            active: {col1: "#888888", col2: "#dddddd", textcol: "#000000"},
            disabled: {col1: "#333333", col2: "#666666", textcol: "#000000"},
            shift: {col1: "#666600", col2: "#cccc00", textcol: "#000000"}
        }
    }
}, updateId = null;

function main_element() {
    return document.getElementById("content")
}

function status_element() {
    return document.getElementById("status")
}

function method() {
    return document.getElementById("method").value
}

function uri() {
    return document.getElementById("uri").value
}

function test() {
    var a, b;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (c) {
        if (1 == c.nextAddress) return c.yield(request(method(), uri()), 2);
        a = c.yieldResult;
        b = document.getElementById("content");
        b.innerHTML = JSON.stringify(a);
        c.jumpToEnd()
    })
}

function add_macro_button(a, b) {
    var c = void 0;
    0 == database.macro_controls.hasOwnProperty(b.name) ? (c = document.createElement("BUTTON"), c.macro_name = b.name, c.innerHTML = b.name, a.appendChild(c), database.macro_controls[b.name] = c, c.onclick = function () {
        request("PATCH", "/macros/" + c.macro_name, JSON.stringify({state: "play"}), "application/json")
    }) : c = database.macro_controls[b.name];
    return c
}

function add_aux_bar(a, b) {
    var c = void 0;
    0 == database.aux_controls.hasOwnProperty(b.name) ? (c = new Buttonbar(a), c.aux_name = b.name, c.text = b.name, database.aux_controls[b.name] = c) : c = database.aux_controls[b.name];
    var e = c.buttons;
    a = function (a) {
        for (var b in e) {
            var c = e[b];
            if (c.source_name == a) return c
        }
        return null
    };
    for (var d in e) {
        var f = e[d];
        f.checked = !1
    }
    for (d in b.sources) {
        var g = b.sources[d];
        (f = a(g)) ? f.checked = !0 : (f = create_svg_button("#888888", "#aaaaaa", g, "white"), f.checked = !0, f.source_name = g, f.onclick = function () {
            b.source =
                this.source_name;
            request("PATCH", "/aux/" + b.name, JSON.stringify(b), "application/json")
        }, c.addButton(f))
    }
    c.update()
}

function add_layer_bar(a, b) {
    var c = document.createElement("DIV"), e = document.createElement("DIV");
    c.layer = b;
    e.innerHTML = b;
    c.appendChild(e);
    a.append(c);
    return c
}

function add_source_button(a, b, c, e, d) {
    var f = document.createElement("BUTTON");
    f.source_name = b;
    f.bar = c;
    f.innerHTML = b;
    f.onclick = function () {
        d[c] = b;
        request("PATCH", "/scenes/" + e.name + "/" + d.name, JSON.stringify(d), "application/json")
    };
    a.appendChild(f)
}

function add_scene_button(a, b) {
    var c = document.createElement("BUTTON");
    c.scene_name = b;
    c.innerHTML = b;
    c.onclick = function () {
        var a = document.getElementById("layers");
        a.innerHTML = "";
        var b = void 0, c;
        for (c in database.scenes) {
            var g = database.scenes[c];
            if (g.name == this.scene_name) {
                b = g;
                break
            }
        }
        if (void 0 === b) throw "scene not found";
        for (c = 0; c < b.layers.length; c++) {
            g = add_layer_bar(a, b.layers[c].name);
            var h = document.createElement("DIV"), l = document.createElement("DIV");
            g.appendChild(h);
            g.appendChild(l);
            for (var m in b.layers[c].sources) g =
                b.layers[c].sources[m], b.layers[c].hasOwnProperty("sourceA") && add_source_button(h, g, "sourceA", b, b.layers[c]), b.layers[c].hasOwnProperty("sourceB") && add_source_button(l, g, "sourceB", b, b.layers[c])
        }
    };
    a.appendChild(c);
    return c
}

function add_input_view(a, b) {
    if (0 == database.input_controls.hasOwnProperty(b.name)) {
        var c = document.createElement("DIV");
        c.input = b.name;
        c.innerHTML = b.name;
        a.appendChild(c);
        database.input_controls[b.name] = c
    } else c = database.input_controls[b.name];
    a = "Icons/common/Tally-off-icon24x24.png Icons/common/Tally-red-icon24x24.png Icons/common/Tally-yellow-icon24x24.png Icons/common/Tally-green-icon24x24.png Icons/common/Tally-blue-icon24x24.png Icons/common/Tally-magenta-icon24x24.png Icons/common/Tally-cyan-icon24x24.png Icons/common/Tally-off-icon24x24.png".split(" ");
    b =
        Math.log2(b.tally & -b.tally) + 1;
    -Infinity == b && (b = 0);
    b >= a.length && (b = a.length - 1);
    c.style.backgroundImage = "url(" + a[b] + ")";
    c.style.backgroundRepeat = "no-repeat";
    c.style.backgroundPositionX = "40px";
    c.style.backgroundSize = "contain"
}

function update(a) {
    var b, c, e, d, f, g, h, l, m;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (k) {
        switch (k.nextAddress) {
            case 1:
                return a && (b = create_svg_button("rgb(127,0,0)", "rgb(255,0,0)", "Text"), c = create_svg_button("rgb(0,255,0)", "rgb(0,127,0)", "Text"), document.getElementById("content").appendChild(b), document.getElementById("status").appendChild(c)), e = document.getElementById("macros"), k.yield(request("GET", "/macros"), 2);
            case 2:
                d = k.yieldResult;
                database.macros = JSON.parse(d);
                for (f = 0; f < database.macros.length; f++) add_macro_button(e,
                    database.macros[f]);
                if (!a) {
                    k.jumpTo(3);
                    break
                }
                g = document.getElementById("scenes");
                h = document.getElementById("layers");
                g.innerHTML = "";
                h.innerHTML = "";
                return k.yield(request("GET", "/scenes"), 4);
            case 4:
                for (d = k.yieldResult, database.scenes = JSON.parse(d), f = 0; f < database.scenes.length; f++) add_scene_button(g, database.scenes[f].name);
            case 3:
                return l = document.getElementById("inputs"), k.yield(request("GET", "/inputs"), 5);
            case 5:
                d = k.yieldResult;
                database.inputs = JSON.parse(d);
                for (f = 0; f < database.inputs.length; f++) add_input_view(l,
                    database.inputs[f]);
                m = document.getElementById("aux");
                return k.yield(request("GET", "/aux"), 6);
            case 6:
                d = k.yieldResult;
                database.aux = JSON.parse(d);
                for (f = 0; f < database.aux.length; f++) add_aux_bar(m, database.aux[f]);
                k.jumpToEnd()
        }
    })
}

window.init = init;
var aux_widget = void 0, aux_delegation_widget = void 0, input_widget = void 0, macro_widget = void 0,
    multiviewer_widget = void 0, scene_widget = void 0, widget_manager = void 0;

function init() {
    var a = getAuxIDFromHash();
    widget_manager = new WidgetManager;
    aux_widget = new AuxWidget(document.body);
    aux_widget._hide();
    aux_delegation_widget = new AuxDelegationWidget(document.body);
    aux_delegation_widget._hide();
    input_widget = new InputWidget(document.body);
    input_widget._hide();
    macro_widget = new MacroWidget(document.body);
    macro_widget._hide();
    multiviewer_widget = new MultiviewerWidget(document.body);
    multiviewer_widget._hide();
    scene_widget = new SceneWidget(document.body);
    scene_widget._hide();
    0 == a ? (widget_manager.add_to_menu(aux_widget), widget_manager.add_to_menu(aux_delegation_widget), widget_manager.add_to_menu(input_widget), widget_manager.add_to_menu(macro_widget), widget_manager.add_to_menu(multiviewer_widget), widget_manager.add_to_menu(scene_widget)) : widget_manager.show(aux_delegation_widget)
}

function request(a, b, c, e) {
    return new Promise(function (d, f) {
        var g = new XMLHttpRequest;
        g.open(a, b, !0);
        g.setRequestHeader("content-type", e);
        g.onload = function () {
            200 == this.status ? d(g.response) : f({status: this.status, statusText: g.statusText})
        };
        g.onerror = function () {
            f({status: this.status, statusText: g.statusText})
        };
        g.send(c)
    })
}

function update_svg_button(a, b, c, e, d) {
    for (var f = a.getElementsByTagName("linearGradient"), g = 0; g < f.length; g++) {
        var h = f[g].getElementsByTagName("stop");
        h[0].setAttribute("stop-color", b);
        h[1].setAttribute("stop-color", c)
    }
    b = "30%";
    f = "";
    10 < e.length && (e = e.substring(0, 7) + "...");
    5 >= e.length ? (b = "50%", c = e) : (f = Math.floor(e.length / 2), c = e.substring(0, f), f = e.substring(f));
    e = 7.5 / e.length;
    e = Math.min(Math.max(.5, e), .75);
    e = 100 * e + "%";
    g = a.getElementsByTagName("text")[0];
    g.innerHTML = c;
    g.setAttribute("y", b);
    g.setAttribute("fill",
        d);
    g.setAttribute("font-size", e);
    g = a.getElementsByTagName("text")[1];
    g.innerHTML = f;
    g.setAttribute("y", "70%");
    g.setAttribute("fill", d);
    g.setAttribute("font-size", e)
}

function create_svg_button(a, b, c, e) {
    var d = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        f = document.createElementNS("http://www.w3.org/2000/svg", "defs"),
        g = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"),
        h = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient"),
        l = document.createElementNS("http://www.w3.org/2000/svg", "rect"),
        m = document.createElementNS("http://www.w3.org/2000/svg", "ellipse"),
        k = document.createElementNS("http://www.w3.org/2000/svg",
            "text"), p = document.createElementNS("http://www.w3.org/2000/svg", "text"),
        n = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    n.setAttribute("offset", "0%");
    n.setAttribute("stop-color", a);
    a = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    a.setAttribute("offset", "100%");
    a.setAttribute("stop-color", b);
    g.appendChild(n);
    g.appendChild(a);
    h.appendChild(n.cloneNode(!0));
    h.appendChild(a.cloneNode(!0));
    b = Math.random().toString(36).substring(2, 15);
    g.id = b;
    g.setAttribute("x1", "1");
    g.setAttribute("y1",
        "1");
    g.setAttribute("x2", "0");
    g.setAttribute("y2", "0");
    n = Math.random().toString(36).substring(2, 15);
    h.id = n;
    h.setAttribute("x1", "0");
    h.setAttribute("y1", "0");
    h.setAttribute("x2", "1");
    h.setAttribute("y2", "1");
    f.appendChild(g);
    f.appendChild(h);
    l.setAttribute("fill", "url(#" + b + ")");
    l.setAttribute("width", "100%");
    l.setAttribute("height", "100%");
    m.setAttribute("fill", "url(#" + n + ")");
    m.setAttribute("rx", "45%");
    m.setAttribute("ry", "45%");
    m.setAttribute("cx", "50%");
    m.setAttribute("cy", "50%");
    g = "30%";
    b = "";
    10 <
    c.length && (c = c.substring(0, 7) + "...");
    5 >= c.length ? (g = "50%", h = c) : (b = Math.floor(c.length / 2), h = c.substring(0, b), b = c.substring(b));
    c = 7.5 / c.length;
    c = Math.min(Math.max(.5, c), .75);
    c = 100 * c + "%";
    k.setAttribute("x", "50%");
    k.setAttribute("y", g);
    k.setAttribute("fill", e);
    k.setAttribute("text-anchor", "middle");
    k.setAttribute("alignment-baseline", "central");
    k.setAttribute("font-size", c);
    k.innerHTML = h;
    p.setAttribute("x", "50%");
    p.setAttribute("y", "70%");
    p.setAttribute("fill", e);
    p.setAttribute("text-anchor", "middle");
    p.setAttribute("alignment-baseline", "central");
    p.setAttribute("font-size", c);
    p.innerHTML = b;
    d.setAttribute("width", "100%");
    d.setAttribute("height", "100%");
    d.setAttribute("version", "1.1");
    d.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    d.appendChild(f);
    d.appendChild(l);
    d.appendChild(m);
    d.appendChild(k);
    d.appendChild(p);
    return d
};var SceneWidget = function (a) {
    var b = document.createElement("div");
    b.id = "scenes_container";
    addClass(b, "container");
    var c = new Buttonbar(b);
    c.element.style.paddingTop = "15px";
    c.element.style.paddingBottom = "15px";
    c.text = "Delegation";
    var e = document.createElement("div");
    e.id = "layers";
    b.appendChild(e);
    a.appendChild(b);
    DomElement.call(this, a, b);
    this.controller = c;
    this.layer_controller = e;
    this.macro_controller = this.snapshot_controller = null;
    this.scene_controls = [];
    this.active_macro = this.active_snapshot = this.active =
        null
};
$jscomp.inherits(SceneWidget, DomElement);
SceneWidget.prototype.text = function () {
    return "Scenes"
};
SceneWidget.prototype._add_scene_button = function (a, b) {
    a.label = b.name;
    a.scene_name = b.name;
    a.uuid = b.uuid;
    a.element.onclick = function () {
        this.active != a && (this.layer_controller.innerHTML = "", this.active && (this.active.layer_controls = [], this.active.normal(), this.active.update()), this.snapshot_controller && (this.snapshot_controller.innerHTML = ""), delete this.snapshot_controller, this.snapshot_controller = null, this.macro_controller && (this.macro_controller.innerHTML = ""), delete this.macro_controller, this.macro_controller =
            null, this.active = a, this.active.active(), this.active.update(), this.update_active_layer_controls())
    }.bind(this);
    a.update();
    return a
};
SceneWidget.prototype.update_snapshot_controls = function (a) {
    null == this.snapshot_controller && (this.snapshot_controller = new Buttonbar(this.layer_controller), this.snapshot_controller.element.style.borderTop = "1px solid white", this.snapshot_controller.text = "Snapshots", this.snapshot_controller.update());
    this.snapshot_controller.forEach(function (a) {
        a.checked = !1
    });
    var b = {}, c;
    for (c in a.snapshots) {
        var e = a.snapshots[c];
        b.$jscomp$loop$prop$button$2 = this.snapshot_controller.getButton(c);
        b.$jscomp$loop$prop$button$2 ||
        (b.$jscomp$loop$prop$button$2 = this.snapshot_controller.addButton());
        b.$jscomp$loop$prop$button$2.checked = !0;
        b.$jscomp$loop$prop$button$2.label = e.name;
        b.$jscomp$loop$prop$button$2.scene_uuid = this.active.uuid;
        b.$jscomp$loop$prop$button$2.uuid = e.uuid;
        b.$jscomp$loop$prop$button$2.normal();
        b.$jscomp$loop$prop$button$2.element.onclick = function (a) {
            return function () {
                request("PATCH", "/scenes/" + a.$jscomp$loop$prop$button$2.scene_uuid + "/snapshots/" + a.$jscomp$loop$prop$button$2.uuid, JSON.stringify({state: "recall"}),
                    "application/json");
                this.active_snapshot = a.$jscomp$loop$prop$button$2.uuid
            }
        }(b).bind(this);
        b.$jscomp$loop$prop$button$2.update();
        b = {$jscomp$loop$prop$button$2: b.$jscomp$loop$prop$button$2}
    }
    a = this.snapshot_controller.findAny(function (a) {
        return 0 == a.checked
    });
    for (var d in a) this.snapshot_controller.removeButton(a[d]);
    if (d = this.snapshot_controller.find(function (a) {
        return a.uuid === this.active_snapshot
    }.bind(this))) d.active(), d.update();
    this.snapshot_controller.update()
};
SceneWidget.prototype.update_macro_controls = function (a) {
    null == this.macro_controller && (this.macro_controller = new Buttonbar(this.layer_controller), this.macro_controller.text = "Macros", this.macro_controller.update());
    this.macro_controller.forEach(function (a) {
        a.checked = !1
    });
    var b = {}, c;
    for (c in a.macros) {
        var e = a.macros[c];
        b.$jscomp$loop$prop$button$4 = this.macro_controller.getButton(c);
        b.$jscomp$loop$prop$button$4 || (b.$jscomp$loop$prop$button$4 = this.macro_controller.addButton());
        b.$jscomp$loop$prop$button$4.checked =
            !0;
        b.$jscomp$loop$prop$button$4.label = e.name;
        b.$jscomp$loop$prop$button$4.scene_uuid = this.active.uuid;
        b.$jscomp$loop$prop$button$4.uuid = e.uuid;
        b.$jscomp$loop$prop$button$4.normal();
        b.$jscomp$loop$prop$button$4.element.onclick = function (a) {
            return function () {
                request("PATCH", "/scenes/" + a.$jscomp$loop$prop$button$4.scene_uuid + "/macros/" + a.$jscomp$loop$prop$button$4.uuid, JSON.stringify({state: "play"}), "application/json");
                this.active_macro = a.$jscomp$loop$prop$button$4.uuid
            }
        }(b).bind(this);
        b.$jscomp$loop$prop$button$4.update();
        b = {$jscomp$loop$prop$button$4: b.$jscomp$loop$prop$button$4}
    }
    a = this.macro_controller.findAny(function (a) {
        return 0 == a.checked
    });
    for (var d in a) this.macro_controller.removeButton(a[d]);
    if (d = this.macro_controller.find(function (a) {
        return a.uuid === this.active_macro
    }.bind(this))) d.active(), d.update();
    this.macro_controller.update()
};
SceneWidget.prototype.update_active_layer_controls = function () {
    var a = ["sourceA", "sourceB"], b = this.active;
    if (b) {
        var c = null, e;
        for (e in database.scenes) {
            var d = database.scenes[e];
            if (d.name == b.scene_name) {
                c = d;
                break
            }
        }
        if (c) {
            this.update_snapshot_controls(c);
            this.update_macro_controls(c);
            for (var f in b.layer_controls) d = b.layer_controls[f], d.forEach(function (a) {
                a.checked = !1;
                a.forEach(function (a) {
                    a.checked = !1
                })
            });
            for (var g in c.layers) {
                var h = c.layers[g];
                f = b.layer_controls[h.path + h.name];
                f || (f = [], h.hasOwnProperty("sourceA") &&
                h.hasOwnProperty("sourceB") ? (d = new Buttonbar(this.layer_controller, this.snapshot_controller.element), d.text = h.path + h.name + " - A", f.push(d), d = new Buttonbar(this.layer_controller, this.snapshot_controller.element), d.text = h.path + h.name + " - B") : (d = new Buttonbar(this.layer_controller, this.snapshot_controller.element), d.text = h.path + h.name), f.push(d), b.layer_controls[h.path + h.name] = f);
                f.forEach(function (a) {
                    a.checked = !0
                });
                if (f && 1 <= f.length) {
                    for (var l = 0; l < f.length; l++) for (e in d = f[l], h.sources) {
                        var m = h.sources[e],
                            k = d.getButton(e);
                        k || (k = d.addButton());
                        k.label = m;
                        k.scene_name = b.label;
                        k.uuid = b.uuid;
                        k.layer = h;
                        k.source = a[l];
                        k.ctrl = d;
                        k.element.onclick = function () {
                            this.layer[this.source] = this.label;
                            request("PATCH", "/scenes/" + this.uuid + "/" + this.layer.uuid, JSON.stringify(this.layer), "application/json")
                        }.bind(k);
                        k.checked = !0;
                        k.label === h[a[l]] ? (k.active(), d.active = k) : k.normal();
                        k.update()
                    }
                    for (l = 0; l < f.length; l++) {
                        d = f[l];
                        h = d.findAny(function (a) {
                            return 0 == a.checked
                        });
                        for (var p in h) d.removeButton(h[p]);
                        d.update()
                    }
                }
            }
        }
        for (var n in b.layer_controls) d =
            b.layer_controls[n], d = d.filter(function (a) {
            return 1 == a.checked
        }), 0 == d.length && (b.layer_controls[n].forEach(function (a) {
            a.remove()
        }), delete b.layer_controls[n])
    }
};
SceneWidget.prototype.onUpdate = function () {
    var a = this, b, c, e, d, f;
    return $jscomp.asyncExecutePromiseGeneratorProgram(function (g) {
        if (1 == g.nextAddress) return g.yield(request("GET", "/scenes"), 2);
        b = g.yieldResult;
        database.scenes = JSON.parse(b);
        a.controller.forEach(function (a) {
            a.checked = !1
        });
        for (c = 0; c < database.scenes.length; c++) e = a.controller.getButton(c), null == e && (e = a.controller.addButton(), e.layer_controls = []), e = a._add_scene_button(e, database.scenes[c]), e.checked = !0;
        a.update_active_layer_controls();
        d = a.controller.findAny(function (a) {
            return 0 ==
                a.checked
        });
        for (f in d) a.active == d[f] && (a.active && (a.active.layer_controls = []), a.active = null, a.layer_controller.innerHTML = ""), a.controller.removeButton(d[f]);
        a.controller.update();
        g.jumpToEnd()
    })
};
SceneWidget.prototype.onShow = function () {
    this.onUpdate()
};
SceneWidget.prototype.onClose = function () {
};
