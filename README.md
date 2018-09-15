# Singleton Module Registry

[![CircleCI](https://circleci.com/gh/chipp972/singleton-module-registry/tree/master.svg?style=svg)](https://circleci.com/gh/chipp972/singleton-module-registry/tree/master)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5372ac20d93b40199845b2343f29d44f)](https://www.codacy.com/app/pierrecharles.nicolas/singleton-module-registry?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=chipp972/singleton-module-registry&amp;utm_campaign=Badge_Grade)

[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/5372ac20d93b40199845b2343f29d44f)](https://www.codacy.com/app/pierrecharles.nicolas/singleton-module-registry?utm_source=github.com&utm_medium=referral&utm_content=chipp972/singleton-module-registry&utm_campaign=Badge_Coverage)

## Description

Implementation of the Registry Pattern to have loosely-coupled modules in your app.
You can either use the singleton provided to just import the library or create as many Registry as you want and pass them to your different modules.

## Breaking change notes

* We don't provide event emitter anymore because event emission is meant to decouple modules. But we use dependency injdection for this purpose so event emission is not needed anymore.
* We do not support module interdependency anymore (via the required property) because modules are meant to be decoupled units.

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

registry1.registerModule('moduleA', {
  sum: (a, b) => a + b,
  product: (a, b) => a * b,
});
const { moduleA } = registry.getModules(['moduleA']);

console.log(moduleA.sum(1, 2)); // prints 3
```
