import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import perf from '../';

describe('perf higher-order component', () => {
  let ReactPerf;

  beforeEach(() => {
    jest.resetModules();
    ReactPerf = jest.genMockFromModule('react-addons-perf');
    jest.setMock('react-addons-perf', ReactPerf);
  });

  it('wraps the passed in component when not in production', () => {
    const MyComp = () => <div className="my-comp" />;
    const MyCompPerf = perf(MyComp);

    const result = mount(<MyCompPerf testProp="1" />);

    expect(toJson(result)).toMatchSnapshot();
  });

  it('does not wrap the passed in component when in production', () => {
    const MyComp = () => <div className="my-comp" />;
    const NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const MyCompPerf = perf(MyComp);
    process.env.NODE_ENV = NODE_ENV;

    const result = mount(<MyCompPerf testProp="1" />);

    expect(toJson(result)).toMatchSnapshot();
  });

  it('starts ReactPerf on mount', () => {
    const MyComp = () => <div className="my-comp" />;
    const MyCompPerf = perf(MyComp);

    mount(<MyCompPerf />);

    expect(ReactPerf.start).toHaveBeenCalled();
  });

  it('stops ReactPerf on unmount', () => {
    const MyComp = () => <div className="my-comp" />;
    const MyCompPerf = perf(MyComp);

    const result = mount(<MyCompPerf />);
    result.unmount();

    expect(ReactPerf.stop).toHaveBeenCalled();
  });

  it('stops, collects results and starts again in update', () => {
    const MyComp = () => <div className="my-comp" />;
    const MyCompPerf = perf(MyComp);

    const result = mount(<MyCompPerf />);
    result.setProps();

    expect(ReactPerf.stop).toHaveBeenCalled();
    expect(ReactPerf.getLastMeasurements).toHaveBeenCalled();
    expect(ReactPerf.printWasted).toHaveBeenCalled();
    expect(ReactPerf.start).toHaveBeenCalled();
  });
});
