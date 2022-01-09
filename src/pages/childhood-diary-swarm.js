// FIGURING OUT YSCALE FOR STACKED ELEMENTS

import React, { useEffect, useState, useRef } from "react";
import { graphql } from "gatsby";
import "../styles.css";
import { unNestDiaryData } from "../consts/childhoodDiaryConsts";
import { formatDataFunct } from "../utils/childhoodDiaryUtils";
import BeeswarmSvg from "../components/BeeswarmSvg";

const ChildhoodDiaryBinned = ({ data }) => {
  const [width, setWidth] = useState(10000);
  const [height, setHeight] = useState(10000);
  const margin = 0;
  const marginLeft = 100;
  const marginRight= 100;

  const marginTop = 0;
  const containerRef = useRef();
  const unNestData = unNestDiaryData(data);
  const formattedData = formatDataFunct(unNestData);

  useEffect(() => {
    setWidth(containerRef.current.clientWidth);
    setHeight(containerRef.current.clientHeight);
    window.onresize = function () {
      setWidth(containerRef.current.clientWidth);
      setHeight(containerRef.current.clientHeight);

    };
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      style={{ border: "solid 2px white", width: "100%", height: "100vh" }}
    >
      <BeeswarmSvg
        selectedDate="week"
        selectedValue="entry_word_count"
        data={formattedData}
        margin={margin}
        marginLeft={marginLeft}
        marginTop={marginTop}
        marginRight={marginRight}
        width={width}
        height={height}
      />
    </div>
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
