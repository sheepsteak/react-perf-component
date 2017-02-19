'use strict';

var _enzyme = require('enzyme');

var _enzymeToJson = require('enzyme-to-json');

var _enzymeToJson2 = _interopRequireDefault(_enzymeToJson);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('perf higher-order component', function () {
  var ReactPerf = void 0;

  beforeEach(function () {
    jest.resetModules();
    ReactPerf = jest.genMockFromModule('react-addons-perf');
    jest.setMock('react-addons-perf', ReactPerf);
  });

  it('wraps the passed in component when not in production', function () {
    var MyComp = function MyComp() {
      return _react2.default.createElement('div', { className: 'my-comp' });
    };
    var MyCompPerf = (0, _2.default)(MyComp);

    var result = (0, _enzyme.mount)(_react2.default.createElement(MyCompPerf, { testProp: '1' }));

    expect((0, _enzymeToJson2.default)(result)).toMatchSnapshot();
  });

  it('does not wrap the passed in component when in production', function () {
    var MyComp = function MyComp() {
      return _react2.default.createElement('div', { className: 'my-comp' });
    };
    var NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    var MyCompPerf = (0, _2.default)(MyComp);
    process.env.NODE_ENV = NODE_ENV;

    var result = (0, _enzyme.mount)(_react2.default.createElement(MyCompPerf, { testProp: '1' }));

    expect((0, _enzymeToJson2.default)(result)).toMatchSnapshot();
  });

  it('shows wrapped component in displayName', function () {
    var MyComp = function MyComp() {
      return _react2.default.createElement('div', { className: 'my-comp' });
    };
    var MyCompPerf = (0, _2.default)(MyComp);

    expect(MyCompPerf.displayName).toContain(MyComp.name);
  });

  it('expose wrapped component in WrappedComponent', function () {
    var MyComp = function MyComp() {
      return _react2.default.createElement('div', { className: 'my-comp' });
    };
    var MyCompPerf = (0, _2.default)(MyComp);

    expect(MyCompPerf.WrappedComponent).toBe(MyComp);
  });

  it('starts ReactPerf on mount', function () {
    var MyComp = function MyComp() {
      return _react2.default.createElement('div', { className: 'my-comp' });
    };
    var MyCompPerf = (0, _2.default)(MyComp);

    (0, _enzyme.mount)(_react2.default.createElement(MyCompPerf, null));

    expect(ReactPerf.start).toHaveBeenCalled();
  });

  it('stops ReactPerf on unmount', function () {
    var MyComp = function MyComp() {
      return _react2.default.createElement('div', { className: 'my-comp' });
    };
    var MyCompPerf = (0, _2.default)(MyComp);

    var result = (0, _enzyme.mount)(_react2.default.createElement(MyCompPerf, null));
    result.unmount();

    expect(ReactPerf.stop).toHaveBeenCalled();
  });

  it('stops, collects results and starts again in update', function () {
    var MyComp = function MyComp() {
      return _react2.default.createElement('div', { className: 'my-comp' });
    };
    var MyCompPerf = (0, _2.default)(MyComp);

    var result = (0, _enzyme.mount)(_react2.default.createElement(MyCompPerf, null));
    result.setProps();

    expect(ReactPerf.stop).toHaveBeenCalled();
    expect(ReactPerf.getLastMeasurements).toHaveBeenCalled();
    expect(ReactPerf.printWasted).toHaveBeenCalled();
    expect(ReactPerf.start).toHaveBeenCalled();
  });
});