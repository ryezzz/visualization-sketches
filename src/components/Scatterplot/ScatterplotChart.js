import React, { useState, useContext } from "react";
import * as d3 from "d3";
import styled from "styled-components";

import { tooltipContext } from "./useTooltip";
import { date } from "faker";

const Circle = styled.circle`
  fill: steelblue;
  fill-opacity: 0.6;
  stroke: steelblue;
  stroke-width: 1px;
  cursor: pointer;
  &:hover {
    fill: orange;
  }
`;

// fields={["id", "number1", "number2", "name", "zipCode", "state", "color"]}

const ForeignObject = styled.foreignObject`
  background: white;
  font-size: 9px;
  text-align: left;
  div {
    box-shadow: 10px 10px 8px #888888;
  }
`;

const Tooltip = ({ x, y, info, fields }) => (
  <ForeignObject x={x + 10} y={y + 10} width={100} height={50}>
    <div>

    // {console.log("info", info.date)}
      <strong> {JSON.stringify(info.formatted_date)} <p>{info.entry_word_count}</p>  </strong>
    </div>
  </ForeignObject>
);


// let width = 640 // outer width, in pixels
// let height = 4000
// let xType = d3.scaleLinear().range([height, 0]) // type of x-scale
// let yType = d3.scaleLinear() // type of y-scale
// let xFormat // a format specifier string for the x-axis
// let yFormat // a format specifier string for the y-axis
// let marginLeft = 10
// let insetLeft = 10
// let marginRight = 10
// let insetRight =10
// let marginBottom = 10
// let insetBottom = 10
// let marginTop= 10
// let insetTop= 10
// let xDomain= 10
// let xRange = [marginLeft + insetLeft, width - marginRight - insetRight]
// let yDomain // [ymin, ymax]
// let yRange = [height - marginBottom - insetBottom, marginTop + insetTop]// [bottom, top]
// const xScale = xType(xDomain, xRange);
// const yScale = yType(yDomain, yRange);


export default ({
  x,
  y,
  fields,
  width,
  height,
  data,
  xDimension,
  yDimension,
  padding = 20
}) => {
  const { tooltip, setTooltip } = useContext(tooltipContext);

  const xScale = d3
  .scaleTime()
  .domain(d3.extent(data, xDimension))
  .range([0, width-(padding + 10)]);


  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yDimension))
    .range([height - (padding + 10), padding + 10]);






  return (
    <g transform={`translate(${x}, ${y})`}>
      {data.map((d) => (
        <Circle
          key={d[fields[0]]}
          cx={xScale(xDimension(d))}
          cy={yScale(yDimension(d))}
          r={3}
          onMouseOver={() => setTooltip(d)}
          onMouseOut={() => setTooltip(false)}
        />
      ))}

      {tooltip && (
        <Tooltip
          x={xScale(xDimension(tooltip))}
          y={yScale(yDimension(tooltip))}
          info={tooltip}
        />
      )}
    </g>
  );
};
