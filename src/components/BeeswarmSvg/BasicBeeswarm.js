import * as d3 from "d3";
import React, { useRef } from "react";
import { dodge } from "../../utils/visualizationUtils";
import * as rough from "roughjs/bin/svg";

const BasicBeeswarm = (
  props,
  {
    data = props.data,
    selectedDate = props.selectedDate,
    selectedValue = props.selectedValue,
    height = props.height,
    width = props.width,
    marginLeft = props.margin,
    marginBottom = props.marginTop,
    marginRight = props.marginRight,
    padding = 0,
  }
) => {
  let svgRef = useRef();

  let rScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[selectedValue]))
    .range([1, height / 80]);

  let x = d3
    .scaleSequential()
    .domain(d3.extent(data, (d) => d[selectedDate]))
    .range([marginLeft, width - marginRight]);

  let r = (selectedValue) => rScale(selectedValue);

  let roughSvg = rough.svg(svgRef);

  return (
    <div>
      <svg
        ref={svgRef}
        style={{ border: "solid 2px white", width: width, height: height }}
      >
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

export default BasicBeeswarm;
