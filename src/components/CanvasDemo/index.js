import React from "react";
import "./styles.css";
import * as d3 from "d3";
import { Stage, Layer, Circle } from "react-konva";
import { useInterval } from "./interval";

const margin = { top: 20, bottom: 20, left: 30, right: 20 };
const color = d3.scaleOrdinal(d3.schemeCategory10);

const data = [...Array(300)].map(d => ({
  x: Math.random() * 900,
  y: Math.random() * 900
}));

export default function CanvasDemo() {
  const svgRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const xAxisRef = React.useRef(null);
  const yAxisRef = React.useRef(null);
  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);

  const xScale = d3.scaleLinear().domain([0, 20]);
  const yScale = d3.scaleLinear().domain([0, 130]);

  React.useLayoutEffect(() => {
    setHeight(svgRef.current.clientHeight - margin.top - margin.bottom);
    setWidth(svgRef.current.clientWidth - margin.left - margin.right);
    xScale.range([0, width]);
    yScale.range([height, 0]);
  }, [svgRef, height, width, xScale, yScale]);

  React.useLayoutEffect(() => {
    d3.select(xAxisRef.current).call(d3.axisBottom(xScale));
    d3.select(yAxisRef.current).call(d3.axisLeft(yScale));
  }, [yScale, xScale]);

  // useInterval(() => {
  //   if (layerRef.current) {
  //     layerRef.current.children.forEach(circle => {
  //       circle.to({
  //         x: Math.random() * width,
  //         y: Math.random() * height
  //       });
  //     });
  //   }
  // }, 4000);

  return (
    <div className="canvasDemo">
      <svg ref={svgRef}>
        <g
          ref={xAxisRef}
          transform={`translate(${margin.left}, ${height + margin.top})`}
        />
        <g
          ref={yAxisRef}
          transform={`translate(${margin.left}, ${margin.top})`}
        />
      </svg>
      <Stage
        width={width}
        height={height}
        style={{
          position: "absolute",
          top: margin.top,
          left: margin.left,
          zIndex: 20
        }}
      >
        <Layer ref={layerRef}>
          {data.map((d, i) => (
            <Circle
              key={i}
              x={d.x}
              y={d.y}
              radius={5}
              // fill={color(i)}
fill={"rgba(0,0,0,.5)"}
              onMouseOver={node => {
                node.currentTarget.to({
                  radius: 10,
                  fill:"rgba(252, 3, 232,.9)"

                });
              }}
              onMouseLeave={node => {
                node.currentTarget.to({
                  radius: 5,
                  fill:"rgba(0, 0, 0,.5)"


                });
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
