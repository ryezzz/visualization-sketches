// Potential directions: canvas/veroni
// https://observablehq.com/@d3/voronoi-labels
// https://observablehq.com/@didoesdigital/9-may-2020-d3-scatterplot-with-voronoi-tooltips
// d3 canvas react https://medium.com/@louisemoxy/my-canvas-d3-and-react-setup-1a325bd4fde5

// Create canvas demo and re-create scatter https://codesandbox.io/s/naughty-worker-sj0iw?from-embed=&file=/src/interval.js:264-284

import React, { useState, useContext, useRef } from "react";
import * as d3 from "d3";
import styled from "styled-components";

import { tooltipContext } from "./useTooltip";
// import { Stage, Layer, Circle } from "react-konva";



const Circle = styled.circle`
  fill: #eb344f;
  fill-opacity: 0.6;
  stroke: none;
  stroke-width: 1px;
  cursor: pointer;
  &:hover {
    fill: black;
  }
`;

const TooltipStyles = styled.div`
  position: absolute;
  width: 100x;
  height: 50px;
  background: white;
  font-size: 9px;
  text-align: left;
  div {
    box-shadow: 10px 10px 8px #888888;
  }
`;

const Tooltip = ({ info, id }) => (
  <TooltipStyles id={id} className="tooltip">
    <div>
      <strong>
        {JSON.stringify(info.entry_word_count)}
        {/* {JSON.stringify(info.formatted_date)} <p>{info.entry_word_count}</p>{" "} */}
      </strong>
    </div>
  </TooltipStyles>
);

const NewTooltipComp = ({ x, y, info }) => (
  <TooltipStyles x={x + 10} y={y + 10} width={100} height={50}>
    <div>
      <strong>
        Word Count:
      </strong>
    </div>
  </TooltipStyles>
);

export default ({
  x,
  y,
  fields,
  width,
  height,
  data,
  xDimension,
  yDimension,
  padding = 20,
}) => {

const svgRef = React.useRef(null);
const layerRef = React.useRef(null);
const xAxisRef = React.useRef(null);
const yAxisRef = React.useRef(null);

  const [newTooltip, setNewTooltip] = useState("BLAH");

  const { tooltip, setTooltip } = useContext(tooltipContext);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xDimension))
    .range([0, width - (padding + 10)]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yDimension))
    .range([height - (padding + 10), padding + 10]);

  let minDate = data[0][0] != undefined && data[0][0].quarter;
  let maxDate = data[0][0] != undefined && data[data.length - 1][0].quarter;

  // const xScale1 = d3.scaleTime();
  // .domain(d3.extent(data, xDimension))
  // .domain([maxDate, minDate])
  // .range([height - (padding + 10), padding + 10]);

  const yScale1 = d3
    .scaleLinear()
    .domain([0, data.length])
    .rangeRound([height, 0]);
  const circleRef = useRef();

  const RefCircle = (circleData, circlei) => {
    const circleRef2 = useRef();
    return (
      <Circle
        ref={circleRef2}
        id={circleData.id}
        key={Math.random()}
        cx={0}
        cy={-8 * circlei}
        r={4}
        onMouseEnter={
          () =>
            setNewTooltip(circleRef2.current)
        }
        onMouseLeave={() => setNewTooltip("")}
      />
    );
  };

  return (
    // Regular scatter, search for unnested
    // If data is a regular array
    data[0][0] === undefined ? (
      <>
        <svg width="700px" height="450px">
          <g transform={`translate(${x}, ${y})`}>
            {data.map((d) => (
              <Circle
                id={d.id}
                key={Math.random()}
                cx={xScale(xDimension(d))}
                cy={yScale(yDimension(d))}
                r={5}
                onMouseOver={() => setTooltip(d)}
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
        </svg>
        ))
      </>
    ) : (
      // If data is nested

      <>
        <svg width={window.innerWidth / 3} height="880">
          <g transform={`translate(${x}, ${y})`}>
            {data.map((d, i) => (
              <g transform={`translate(${i * 8}, ${8})`}>
                {d.map((di, i) => (
                  // RefCircle(di,i)
                  <Circle
                    id={di.id}
                    key={Math.random()}
                    cx={0}
                    cy={-8 * i}
                    r={4}
                    onMouseEnter={() => setNewTooltip({ di })}
                    onMouseLeave={() => setNewTooltip("")}
                  />
                ))}
              </g>
            ))}
            {/* <NewTooltßipComp content={newTooltip} /> */}
          </g>
        </svg>
      </>
    )
  );
};
