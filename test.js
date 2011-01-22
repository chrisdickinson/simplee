var simplee = require('./simplee'),
    assert = require('assert'),
    util = require('util'),
    puts = util.puts,
    print = util.print;

var test = function(name, callback) {
  try {
    callback();
  } catch(err) {
    puts('FAILED: '+name);
    if(Object.getOwnPropertyDescriptor(err, 'stack')) puts(err.stack);
    else puts(err);
    return;
  }
  print('.');
};

test('Test destructuring emit', function() {
  var bits = [Math.random(), Math.random()],
      ee = new simplee.EventEmitter(),
      executed = false;

  var emits2 = ee.emits('emits2', function() {
    return bits;
  });

  ee.on('emits2', function(b0, b1) {
    assert.strictEqual(arguments.length, 2);
    assert.strictEqual(b0, bits[0]);
    assert.strictEqual(b1, bits[1]);
    executed = true;
  });
  ee.on('error', function(err) { throw err; });

  emits2();
  assert.ok(executed);
});

test('Test non-destructuring emit', function() {
  var returns = "YEAHHHH",
      ee = new simplee.EventEmitter(),
      executed = false;

  var emits1 = ee.emits('emits1', function() {
    return returns;
  });

  ee.on('emits1', function(what) {
    assert.strictEqual(arguments.length, 1);
    assert.strictEqual(what, returns);
    executed = true;
  });
  ee.on('error', function(err) { throw err; });

  emits1();
  assert.ok(executed);
});

test('Test remove', function() {
  var removed = true,
      ee = new simplee.EventEmitter(),
      toRemove = function() { removed = false; };

  ee.on('something', toRemove);
  ee.on('something', function() {
    assert.ok(removed);
  });
  ee.on('error', function(err) { throw err; });

  ee.remove('something', toRemove);

  ee.emit('something');
});

test('Test emit hits each emitter', function() {
  var expected = [Math.random(), Math.random(), Math.random()],
      result = [],
      cached = expected.slice(),
      ee = new simplee.EventEmitter();

  var hit = function() {
    return function() {
      result.push(expected.shift());
    };
  };

  ee.on('emit', hit());
  ee.on('emit', hit());
  ee.on('emit', hit());

  ee.emit('emit');

  assert.strictEqual(expected.length, 0);
  assert.deepEqual(cached, result);
});

