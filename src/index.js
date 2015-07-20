import React from 'react/addons';

export default function perf(Component) {
  if(process.env.NODE_ENV !== 'production') {
    if (!Component instanceof React.Component) {
      throw new Error('Component must be a React component');
    }

    return class Perf extends React.Component {
      componentDidMount() {
        React.addons.Perf.start();
      }
      componentDidUpdate() {
        const measurements = React.addons.Perf.getLastMeasurements();

        if (measurements.length > 0) {
          this.totalRenders = (this.totalRenders || 0) + 1;
          this.totalTime = (this.totalTime || 0) + measurements[0].totalTime;

          console.log(`Average: ${this.totalTime / this.totalRenders} over ${this.totalRenders} renders.`);

          React.addons.Perf.printWasted(measurements);
          React.addons.Perf.start();
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
