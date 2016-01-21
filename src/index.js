import React from 'react';
import ReactPerf from 'react-addons-perf';

/**
 * Wraps the passed in `Component` in a higher-order component. It can then
 * measure the performance of every render of the `Component`.
 *
 * Can also be used as an ES2016 decorator.
 * @param  {ReactComponent} Component the component to wrap
 * @return {ReactComponent}           the wrapped component
 */
export default function perf(Component) {
  if(process.env.NODE_ENV !== 'production') {
    if (!(Component.prototype instanceof React.Component)) {
      throw new Error('Component must be a React component');
    }

    return class Perf extends React.Component {
      componentDidMount() {
        ReactPerf.start();
      }
      componentDidUpdate() {
        const measurements = ReactPerf.getLastMeasurements();

        if (measurements.length > 0) {
          this.totalRenders = (this.totalRenders || 0) + 1;
          this.totalTime = (this.totalTime || 0) + measurements[0].totalTime;

          console.log(`Average: ${this.totalTime / this.totalRenders} over ${this.totalRenders} renders.`);

          ReactPerf.printWasted(measurements);
          ReactPerf.start();
        }
      }
      render() {
        return <Component {...this.props} />;
      }
    };
  } else {
    return Component;
  }
}
