# Singleton Module Registry

## Description

Implementation of the Registry Pattern to have loosely-coupled modules in your app.
You can either use the singleton provided to just import the library or create as many Registry as you want and pass them to your different modules.

## Installation

```bash
npm i --save singleton-module-registry
```

## Usage

Using the singleton

```javascript
import { getRegistrySingleton } from 'singleton-module-registry';

const registry = getRegistrySingleton();

const { moduleA, moduleB } = registry.getModules(['moduleA', 'moduleB']);
```

Instantiating a new registry

```javascript
import { ModuleRegistry } from 'singleton-module-registry';

const registry1 = new ModuleRegistry();

registry1.registerModule({
  id: 'moduleA',
  sum: (a, b) => a + b,
  product: (a, b) => a * b,
});
const { moduleA } = registry.getModules(['moduleA']);

console.log(moduleA.sum(1, 2)); // prints 3
```

## events

You can register events with your module

```javascript
import EventEmitter from 'eventemitter3'; // or 'events'
import { getRegistrySingleton } from 'singleton-module-registry';

const registry = getRegistrySingleton();

const emitter = new EventEmitter();
registry.registerModule({
  id: 'moduleA',
  event: {
    emitter,
    eventNames: ['ev1', 'ev2'],
  },
});

registry.on('moduleA:ev1', (data) => console.log(data, 'test1'));

registry.on('moduleA:ev3', (data) => console.log(data, 'test2'));
// --> will never happen because 'ev3' wasn't declared in the eventNames

emitter.emit('ev1', 'eventData'); // prints 'eventData test1'
emitter.emit('ev3', 'eventData'); // doesn't print anything since it wasn't declared
```
