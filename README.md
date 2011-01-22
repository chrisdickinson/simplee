SimplEE
=======

A super simple implementation of the EventEmitter pattern for client-side javascript.

Why
-------

If you've used the EventEmitter available through node, you realize that the EventEmitter pattern is
exceptionally powerful in JavaScript. Unfortunately, client side JavaScript does not have a direct
corallary to this functionality. SimplEE aims to fill the void, simply. Other frameworks have corollaries,
but if you don't want to (or can't) use them, SimplEE lets you use EventEmitters simply with almost zero
overhead.

The API
--------

The API is largely the same as Node's. Here's a quick use case:

    var ajaxResult = function(endpoint, data) {
        var ee = new SimplEE.EventEmitter();
        $.ajax({
            'url':endpoint,
            'type':'POST',
            'data':data,
            'success':ee.emit.bind(ee, 'data'),
            'error':ee.emit.bind(ee, 'error')
        });

        return ee;
    };

    ajaxResult('/something/', {}).
        on('data', function() {
            // do something
        }).
        on('error', function() {
            // attempt to recover
        });

SimplEE also defines a global emitter, useful in cases like these:

    var Renderer = function() {

    };

    Renderer.prototype.renderSomething = SimplEE.emits('rendered', function(obj) {
        return [obj, "<div></div>"];
    });

    SimplEE.global.on('rendered', function(obj, html) {
        // do something
    });

Any instance of the Renderer object will emit 'rendered' globally with the results of the method when
`renderSomething` is invoked on it.

As you can see in the example above, arrays are destructured when returned from `emits` functions. No
other type is destructured. This is a convenience function, so you can pull in your expected results in the
arguments of your listener function.

It's also easy to extend existing objects with emitter functionality:

    var SomeObject = function() {
        SimplEE.EventEmitter.call(this);
    };
    SomeObject.prototype = new SimplEE.EventEmitter();

    SomeObject.emitThis = function(what) {
        this.emit(what);
    };

SomeObject can now attach listeners and emit data. Awesome!

License
-------

New BSD.
