import React, { useState } from "react";

import { graphql } from "gatsby";
import "../styles.css";
import { isBrowser } from "../utils/staticRendering";
import { unNestDiaryData } from "../consts/childhoodDiaryConsts";
import * as d3 from "d3";
import { formatDataFunct } from "../utils/childhoodDiaryUtils";

const makeBinnedData = (binData, thresholds) =>
  d3
    .bin()
    .value((d) => d.x)
    .thresholds(thresholds);

const ChildhoodDiaryInkSplotch = ({ data }) => {
  let unNestData = unNestDiaryData(data);
  let binnedData = d3
    .bin()
    .value((d) => d.entry_word_count)
    .thresholds([1, 2, 3, 4, 5, 6, 7]);

  console.log("binnedData", binnedData(unNestData));

  return (
    <svg width={1000} height={1000}>
      {/* // <g>
      //   {unNestData.map((d) => (
      //     <circle
      //       r={d.entry_word_count}
      //       fill="white"
      //       cx={d.entry_word_count * 10}
      //       cy={d.entry_word_count * 10}
      //     ></circle>
      //   ))}
      // </g> */}
    </svg>
  );
};

export const query = graphql`
  query ChildhoodDiaryInkSplotchQuery {
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

export default ChildhoodDiaryInkSplotch;
