import React, { Component } from 'react';

/**
 * Wraps the passed in `Component` in a higher-order component. It can then
 * measure the performance of every render of the `Component`.
 *
 * Can also be used as an ES2016 decorator.
 * @param  {ReactComponent} Component the component to wrap
 * @return {ReactComponent}           the wrapped component
 */
export default function perf(Target) {
  if (process.env.NODE_ENV === 'production') {
    return Target;
  }

  // eslint-disable-next-line global-require
  const ReactPerf = require('react-addons-perf');

  class Perf extends Component {
    componentDidMount() {
      ReactPerf.start();
    }

    componentDidUpdate() {
      ReactPerf.stop();

      const measurements = ReactPerf.getLastMeasurements();

      ReactPerf.printWasted(measurements);
      ReactPerf.start();
    }

    componentWillUnmount() {
      ReactPerf.stop();
    }

    render() {
      return <Target {...this.props} />;
    }
  }

  Perf.displayName = `perf(${Target.displayName || Target.name || 'Component'})`;
  Perf.WrappedComponent = Target;
  return Perf;
}
