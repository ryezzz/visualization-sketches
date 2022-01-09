// FIGURING OUT YSCALE FOR STACKED ELEMENTS

import React, { useEffect, useState, useRef } from "react";
import { graphql } from "gatsby";
import "../styles.css";
import { isBrowser } from "../utils/staticRendering";
import { unNestDiaryData } from "../consts/childhoodDiaryConsts";
import { formatDataFunct } from "../utils/childhoodDiaryUtils";
import * as d3 from "d3";
import { bin } from "d3";

function thresholdTime(n) {
  return (data, min, max) => {
    return d3.scaleSequential().domain([min, max]).ticks(n);
  };
}

const ChildhoodDiaryBinned = ({ data }) => {
  const [width, setWidth] = useState(10000);
  const [height, setHeight] = useState(10000);
  const margin = 0;
  const marginLeft = 0;
  const marginTop = 0;
  const svgRef = useRef();
  const unNestData = unNestDiaryData(data);
  const formattedData = formatDataFunct(unNestData);
  const binnedData = d3
    .bin()
    .value((d) => d.week)
    .thresholds(thresholdTime(20));




  let xScale = d3
    .scaleLinear()
    // .domain(d3.extent(binnedData(formattedData), (d, i) => console.log("testingxscale", d),  d.week))
    .domain(d3.extent(binnedData(formattedData), (d, i) => d.x1 * i /15))
    .range([marginLeft, width - margin]);

    let rScale = d3
    .scaleLinear()
    // .domain(d3.extent(binnedData(formattedData), (d, i) => console.log("testingxscale", d),  d.week))
    // .domain(d3.extent(binnedData(formattedData), (d, i) => d.map((di,ii)=>di.entry_word_count)))
    .domain(d3.extent(formattedData, (d)=> d.entry_word_count))
    .range([1, 10])

    let yScale = d3
    .stack()
    .keys(d3.extent(formattedData, (d)=>(d.entry_word_count, console.log("stackedScale", d)))
    )


    // let stackedScale = d3.stack()
    //     .keys(d3.extent(formattedData, (d)=> d.entry_word_count))


// let pack = () => d3.pack()
// .size([width, height])
// .padding(1)

  React.useEffect(() => {
    setWidth(svgRef.current.clientWidth);
    setHeight(svgRef.current.clientHeight);
    window.onresize = function (event) {
      setWidth(svgRef.current.clientWidth);
    };
  }, [width]);

  return (
    <>
      <svg
        ref={svgRef}
        style={{ border: "solid 2px white", width: "50%", height: "100vh" }}
      >
      {binnedData(formattedData).map((d, i) => (
        // <g transform={`translate(36 45.5)`}>


        <g transform={`translate( ${xScale(d.x1)}  ${height})`}>
          {/* {console.log("packed", pack(d))} */}
 {/* {console.log( "first stacked", stackedScale(d.map((di,ii)=>di.entry_word_count)))} */}

                  {/* {console.log("xscale", xScale(d.x1))} */}
                  {/* {console.log("xscale", xScale(d.x1))} */}

          {d.map((di, ii) => (
            <circle
              r={rScale(di.entry_word_count)}
              fill="white"
              cx={(di.week, xScale(di.week))}
              // cy={}
              cy={ii * -7}


            ></circle>
          ))}
        </g>
        ))}
      </svg>
    </>
  );
};

export const query = graphql`
  query ChildhoodDiaryBinnedQuery {
    allDataCsv {
      edges {
        node {
          items {
            date
            formatted_date
            entry_word_count
            quarter
          }
        }
      }
    }
  }
`;

export default ChildhoodDiaryBinned;
