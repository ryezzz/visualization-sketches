// Starter from https://swizec.com/blog/tooltips-and-state-across-various-d3-charts-in-a-react-dashboard/

import React, { useMemo, useState } from "react";
import { range } from "d3-array";
import { scaleOrdinal } from "d3-scale";
import * as d3 from "d3";
import ScatterplotChart from "./ScatterplotChart";
import { useTooltip, tooltipContext } from "./useTooltip";
import "./styles.css";

const Scatterplot = (props) => {
  let width = 640;
  let height = 400;
  let xType = d3.scaleLinear().range([height, 0]); // type of x-scale
  let yType = d3.scaleLinear(); // type of y-scale
  let xFormat; // a format specifier string for the x-axis
  let yFormat; // a format specifier string for the y-axis

  let fields = [
    "date",
    "formatted_date",
    "entry_word_count",
    "index",
    "quarter",
    "quarter",
    "quarter",
  ];
  let marginLeft = 10;
  let insetLeft = 10;
  let marginRight = 10;
  let insetRight = 10;
  let marginBottom = 10;
  let insetBottom = 10;
  let marginTop = 10;
  let insetTop = 10;
  let xDomain = 10;
  let xRange = [marginLeft + insetLeft, width - marginRight - insetRight];
  let yDomain; // [ymin, ymax]
  let yRange = [height - marginBottom - insetBottom, marginTop + insetTop]; // [bottom, top]
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);

  const xAxis = d3.axisBottom(xScale).ticks(width / 80, xFormat);
  const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);

  const dataForDotPlot = d3
    .bin()
    .value((d) => d.year)
    .thresholds(20);

  const stateToNumber = scaleOrdinal()
    .domain(props.data.map((d) => d.state))
    .range(range(50));

  const state = useTooltip();

  return (
    <div className="Container">

      <div
      >
        <tooltipContext.Provider value={state}>
          <div
            style={{
              width: "250px",
              height: "700px",
              margin: "20px",
              border: "1px black solid",
              float: "left",
            }}
          >
            {/* <svg width={window.innerWidth / 3} height="880"> */}
              <ScatterplotChart
                x={10}
                y={680}
                width={300}
                height={300}
                className="dotPlot"
                fields={[
                  "date",
                  "formatted_date",
                  "entry_word_count",
                  "quarter",
                  "quarter",
                  "quarter",
                  "quarter",
                ]}
                data={dataForDotPlot(props.data)}
                xDimension={(d) => new Date(d.mo)}
                yDimension={(d) => d[fields[2]]}
              />
            {/* </svg> */}
          </div>
          <div
            style={{
              width: "400px",
              height: "450px",
              margin: "20px",
              border: "1px black solid",
              float: "left",
            }}
          >
            <ScatterplotChart
              x={0}
              y={0}
              width={400}
              height={450}
              fields={[
                "date",
                "formatted_date",
                "entry_word_count",
                "quarter",
                "quarter",
                "quarter",
                "quarter",
              ]}
              data={props.data}
              xDimension={(d) => d.quarter}
              yDimension={(d) => d[fields[2]]}
            />
          </div>

          <div
            style={{
              width: "400px",
              height: "450px",
              margin: "20px",
              border: "1px black solid",
              float: "left",
            }}
          >
            {/* <svg width="700px" height="450px"> */}
            <ScatterplotChart
              x={20}
              y={150}
              width={400}
              height={300}
              fields={[
                "date",
                "formatted_date",
                "entry_word_count",
                "quarter",
                "quarter",
                "quarter",
                "quarter",
              ]}
              data={props.data}
              xDimension={(d) => new Date(d[fields[1]]).getMonth()}
              yDimension={(d) => d[fields[2]]}
            />
          {/* </svg> */}
          </div>
        </tooltipContext.Provider>
      </div>
    </div>
  );
};

export default Scatterplot;
