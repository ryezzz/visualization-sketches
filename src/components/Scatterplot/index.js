import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { range } from "d3-array";
import { scaleOrdinal } from "d3-scale";
import * as d3 from "d3";
import Faker from "faker";

import ScatterplotChart from "./ScatterplotChart";
import { useTooltip, tooltipContext } from "./useTooltip";
import "./styles.css";

const Scatterplot = (props) => {
  console.log("DATA FROM SCATTER", props.data);
  // sample from https://swizec.com/blog/tooltips-and-state-across-various-d3-charts-in-a-react-dashboard/
  // Generate random data on first load
  const dataFaker = useMemo(
    () =>
      range(100).map((i) => ({
        id: i,
        number1: Math.random(),
        number2: Math.random(),
        name: Faker.name.findName(),
        zipCode: Faker.address.zipCode(),
        state: Faker.address.state(),
        color: Faker.internet.color(),
      })),
    []
  );
  let width = 640; // outer width, in pixels
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

  const testBin = props.data.map((d) => d[fields[1]]);

  // const testBin2 = d3.bin().value(d => d["quarter"])
  // .thresholds(20)
  const testBin2 = d3
    .bin()
    .value((d) => d.year)
    .thresholds(20);
  // const testxScale = d3.scalePoint(d3.range(10).map(d => d / 10), [20, 480])
  // .padding(0.5);

  console.log("TEST BIN", testBin2(props.data));
  //   const binData = d3.bin().domain()((d)=>d[fields[2]]);
  // console.log(binData())

  //   console.log("DATA FROM SCATTER", dataFaker)

  // bucketize states into 50 buckets
  const stateToNumber = scaleOrdinal()
    .domain(props.data.map((d) => d.state))
    .range(range(50));

  // alphabetize letters into 25 buckets
  const alphabet = scaleOrdinal()
    .domain("abcdefghijklmnoprstuvwxyz".split(""))
    .range(range(25));

  const state = useTooltip();

  // Compute default domains.

  return (
    <div className="App">
      <h1>React & D3 dashboard with synced tooltips</h1>
      <tooltipContext.Provider value={state}>
        <svg width="800" height="10000">
          <ScatterplotChart
            x={20}
            y={2900}
            width={window.innerWidth/3}
            height={300}
            // date,entry_word_count,formatted_date,quarter

            fields={[
              "date",
              "formatted_date",
              "entry_word_count",
              "quarter",
              "quarter",
              "quarter",
              "quarter",
            ]}
            data={testBin2(props.data)}
            xDimension={(d) => new Date(d.mo)}
            yDimension={(d) => d[fields[2]]}
          />

          <ScatterplotChart
            x={20}
            y={350}
            width={window.innerWidth/2}
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
            xDimension={(d) => d.quarter}
            yDimension={(d) => d[fields[2]]}
          />

          <ScatterplotChart
            x={20}
            y={1000}
            width={window.innerWidth/3}
            height={300}
            // fields={["id", "number1", "number2", "name", "zipCode", "state", "color"]}
            // data={dataFaker}
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
        </svg>
      </tooltipContext.Provider>
    </div>
  );
};

export default Scatterplot;
