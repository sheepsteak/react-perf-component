import injectr from 'injectr';
import React from 'react/addons';
import testUtils from 'react-shallow-testutils';

class TestComponent extends React.Component {
  render() {
    return (
      <div />
    );
  }
}

describe('Perf component', function() {
  beforeEach(function() {
    this.MockReactAddons = {
      Perf: {
        getLastMeasurements: jasmine.createSpy('Perf.getLastMeasurements'),
        printWasted: jasmine.createSpy('Perf.printWasted'),
        start: jasmine.createSpy('Perf.start')
      }
    };

    this.MockConsole = {
      log: jasmine.createSpy('console.log')
    };

    this.NODE_ENV = 'development';

    this.makePerf = () => injectr('../../src/index.js', {
      'react/addons': Object.assign({}, React, {addons: this.MockReactAddons})
    }, {
      console: this.MockConsole,
      process: {env: {NODE_ENV: this.NODE_ENV}}
    });
  });

  describe('given `NODE_ENV` is `development`', function() {
    beforeEach(function() {
      this.perf = this.makePerf();
    });

    describe('given a valid React component is passed', function() {
      it('should be wrapped in a `Perf` component', function() {
        const Perf = this.perf(TestComponent);

        expect(Perf.prototype.constructor.name).toEqual('Perf');
      });

      it('should render the passed component and pass any props', function() {
        const Perf = this.perf(TestComponent);
        const renderer = new testUtils.Renderer();
        const perf = renderer.render(Perf, null, {test: 1});

        const mockPerfChild = testUtils.findWithType(perf, TestComponent);
        expect(mockPerfChild.props.test).toEqual(1);
      });

      describe('given `Perf` component is mounted', function() {
        it('should use `Perf.start`', function() {
          const Perf = this.perf(TestComponent);

          const perf = new Perf();
          perf.componentDidMount();

          expect(this.MockReactAddons.Perf.start).toHaveBeenCalled();
        });

        it('should not print measurements if none are available', function() {
          const Perf = this.perf(TestComponent);
          this.MockReactAddons.Perf.getLastMeasurements.and.returnValue([]);

          const perf = new Perf();
          perf.componentDidMount();
          perf.componentDidUpdate();

          expect(this.MockReactAddons.Perf.getLastMeasurements).toHaveBeenCalled();
          expect(this.MockReactAddons.Perf.printWasted).not.toHaveBeenCalled();
          expect(this.MockConsole.log).not.toHaveBeenCalled();
        });

        it('should print measurements if some are available', function() {
          const Perf = this.perf(TestComponent);
          this.MockReactAddons.Perf.getLastMeasurements.and.returnValue([{
            totalTime: 192
          }]);

          const perf = new Perf();
          perf.componentDidMount();
          perf.componentDidUpdate();

          expect(this.MockReactAddons.Perf.getLastMeasurements).toHaveBeenCalled();
          expect(this.MockReactAddons.Perf.printWasted).toHaveBeenCalled();
          expect(this.MockConsole.log).toHaveBeenCalled();
        });
      });
    });

    describe('given an object is passed', function() {
      it('should throw an error', function() {
        expect(() => this.perf({})).toThrow();
      });
    });
  });

  describe('given `NODE_ENV` is `production`', function() {
    beforeEach(function() {
      this.NODE_ENV = 'production';
      this.perf = this.makePerf();
    });

    it('should return back the passed component', function() {
      const Perf = this.perf(TestComponent);

      expect(Perf).toBe(TestComponent);
    });
  });
});
