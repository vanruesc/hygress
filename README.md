# EventCache [![Build Status](https://travis-ci.org/vanruesc/eventcache.svg?branch=master)](https://travis-ci.org/vanruesc/eventcache) [![GitHub version](https://badge.fury.io/gh/vanruesc%2Feventcache.svg)](http://badge.fury.io/gh/vanruesc%2Feventcache) [![Dependencies](https://david-dm.org/vanruesc/eventcache.svg?branch=master)](https://david-dm.org/vanruesc/eventcache)

An event support system that manages the binding of event listeners by creating distinct event caches.

## Usage

```javascript
var myCache, signature;

// Some custom listener function.
function listener() {}

// Create an event listener and store it in the default cache.
EventCache.bind(window, "load", listener);

// Create your own event cache.
myCache = EventCache.createCache();

// Create an event listener and store it in the specified cache.
signature = EventCache.bind(window, "load", listener, myCache);

// Unbinds the listener and removes it from its cache.
EventCache.unbind(signature);

// Flushes your cache.
EventCache.flush(myCache);

// Flushes the default cache.
// Listeners inside the default cache are supposed to live long, though.
EventCache.flush(0);

// Flushes all caches and deletes them. (The default one always remains).
EventCache.flush();
```

## Important Note

In order to prevent memory leaks in certain browsers, you might want to 
include the following line in your code:

```javascript
EventCache.bind(window, "unload", EventCache.flush);
```

## Documentation
_(Coming soon)_

## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

## License
Copyright (c) 2015 Raoul van Rüschen  
Licensed under the Zlib license.
