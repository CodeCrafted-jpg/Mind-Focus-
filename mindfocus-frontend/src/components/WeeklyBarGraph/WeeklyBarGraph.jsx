
import React from 'react';
import './weeklyBargraph.css';

const WeeklyBarGraph = ({ data }) => {
  return (
    <div className="bar-graph-container">
      <h2 className="bar-graph-title">Weekly Focus Duration</h2>
      <div className="bars-wrapper">
        {data.map((item, index) => (
          <div className="bar-item" key={index}>
            <div
              className="bar"
              style={{ height: `${item.duration}px` }}
              title={`${item.duration} min`}
            ></div>
            <span className="bar-label">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyBarGraph;
