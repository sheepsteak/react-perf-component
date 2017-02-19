import React from 'react';

/**
 * Wraps the passed in `Component` in a higher-order component. It can then
 * measure the performance of every render of the `Component`.
 *
 * Can also be used as an ES2016 decorator.
 * @param  {ReactComponent} Component the component to wrap
 * @return {ReactComponent}           the wrapped component
 */
export default function perf(Component) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    const ReactPerf = require('react-addons-perf');

    return class Perf extends React.Component {
      componentDidMount() {
        ReactPerf.start();
      }
      componentDidUpdate() {
        const measurements = ReactPerf.getLastMeasurements();

        ReactPerf.printWasted(measurements);
        ReactPerf.start();
      }
      render() {
        return <Component {...this.props} />;
      }
    };
  }
  return Component;
}
