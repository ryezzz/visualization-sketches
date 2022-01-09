import * as d3 from "d3";
import React from "react";
import { dodge } from "../../utils/visualizationUtils";

const BeeswarmSvg = (props) => {
  const data = props.data;
  const selectedDate = props.selectedDate;
  const selectedValue = props.selectedValue;
  const height = props.height;
  const width = props.width;
  const margin = props.margin;
  const marginLeft = props.margin;
  const marginTop = props.marginTop;
  const marginBottom = props.marginTop;
  const marginRight = props.marginRight;
  const padding = 0;

  let rScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[selectedValue]))
    .range([1, height / 80]);

  let x = d3
    .scaleSequential()
    .domain(d3.extent(data, (d) => d[selectedDate]))
    .range([marginLeft, width - marginRight]);

  let r = (selectedValue) => rScale(selectedValue);

  return (
    <div>
      <svg style={{ border: "solid 2px white", width: width, height: height }}>
        <g width={width} height={height} transform={`translate(${10},${10})`}>
          {dodge(data, props.selectedDate, props.selectedValue, x, r, 0).map(
            (d, i) => (
              <circle
                cx={d.x}
                cy={height - marginBottom - padding - d.y}
                r={d.r}
                fill="white"
              />
            )
          )}
        </g>{" "}
      </svg>
    </div>
  );
};

export default BeeswarmSvg;
