# react-perf-component

[![CircleCI](https://circleci.com/gh/sheepsteak/react-perf-component.svg?style=svg)](https://circleci.com/gh/sheepsteak/react-perf-component)

A [higher-order React component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) for testing the performance of other components.

At the moment it only prints the result from [`Perf.printWasted`](http://facebook.github.io/react/docs/perf.html#perf.printwastedmeasurements) as that's the most useful part.

```
npm install react-perf-component
```

### Example

The best way to use this component is via [babel](https://babeljs.io) and [ES2016/ES7 decorators](https://github.com/wycats/javascript-decorators):
```javascript
import perf from 'react-perf-component'

@perf
export default class MyComponent extends React.Component {
  render() {
    ...
  }
}
```

It can also fallback to being used like:
```javascript
import perf from 'react-perf-component'

class MyComponent extends React.Component {
  render() {
    ...
  }
}

export default perf(MyComponent);
```

### Thanks
Special mention to [PureSin/react-perf](https://github.com/PureSin/react-perf) for helping me to understand how to wrap a component with [React.addons.Perf](http://facebook.github.io/react/docs/perf.html).
