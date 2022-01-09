import { useEffect, useRef, useState } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import React from "react";
import { gsap } from "gsap";
import { isBrowser } from "../../utils/staticRendering";
import { select } from "d3";

function thresholdTime(n) {
  return (data, min, max) => {
    return d3.scaleSequential().domain([min, max]).ticks(n);
  };
}

const BeeswarmSvg = (props) => {
  const [circleData, setCircleData] = useState(null);

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

  const binnedData = d3
    .bin()
    .value((d) => d[selectedDate])
    .thresholds(thresholdTime(20));

  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(binnedData(data), (d, i) => (d.x1 * i) / 15))
    .range([marginLeft, width - margin]);

  let rScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[selectedValue]))
    .range([1, height/80]);

    // let rScaleMain = d3
    // .scaleLinear()
    // // .domain(d3.extent(binnedData(formattedData), (d, i) => console.log("testingxscale", d),  d.week))
    // // .domain(d3.extent(binnedData(formattedData), (d, i) => d.map((di,ii)=>di.entry_word_count)))
    // .domain(d3.extent(data, (d)=> d[selectedValue]))
    // .range([1, 10])

  let yScale = d3.stack().keys(d3.extent(data, (d) => d[selectedValue]));

  // useEffect(() => {
  let x = d3
    .scaleSequential()
    .domain(d3.extent(data, (d) => d[selectedDate]))
    .range([marginLeft, width - marginRight]);

  let r = (selectedValue) => rScale(selectedValue);




  let dodge = (data) => {
    const circles = data
      .map((d) => ({ x: x(d[selectedDate]), r: r(d[selectedValue]), data: d }))
      // .sort((a, b) => b.r - a.r);

    const epsilon = 1e-3;
    let head = null,
      tail = null,
      queue = null;

    //   // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    function intersects(x, y, r) {
      let a = head;
      while (a) {
        const radius2 = (a.r + r + padding) ** 2;
        if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
          return true;
        }
        a = a.next;
      }
      return false;
    }

    //   // Place each circle sequentially.
    for (const b of circles) {
      //     // Choose the minimum non-intersecting tangent.
      if (intersects(b.x, (b.y = b.r), b.r)) {
        let a = head;
        b.y = Infinity;
        do {
          let y =
            a.y + Math.sqrt((a.r + b.r + padding) ** 2 - (a.x - b.x) ** 2);
          if (y < b.y && !intersects(b.x, y, b.r)) b.y = y;
          a = a.next;
        } while (a);
      }

      //     // Add b to the queue.
      b.next = null;
      if (head === null) {
        head = tail = b;
        queue = head;
      } else tail = tail.next = b;
    }

    return circles;
  };

  console.log("DODGE", dodge(data));

  // console.log("CIRCLE DATA", circleData)

  // }, [circleData]);
  return (
    <div>
      <svg style={{ border: "solid 2px white", width: width, height: height }}>
      <g width={width} height={height} transform={`translate(${10},${10})`}>

        {dodge(data).map((d, i) => (

            <circle
            cx={d.x}
            cy={height - marginBottom - padding - d.y}
            r={d.r}
            fill="white"

            >

              {console.log("Finding radius", d.r)}
                   {/*  <g transform={`translate( ${xScale(d.x1)}  ${height})`}>
          {d.map((di, ii) => (
              <circle
                r={rScale(di[selectedValue])}
                fill="white"
                cx={(di[selectedDate], xScale(di[selectedDate]))}
                cy={ii * -7}
              ></circle>
            ))}
          </g>*/}

            </circle>

        )
        )}

        </g> </svg>{" "}
    </div>
  );
};

export default BeeswarmSvg;
