import React, { useState } from "react";
import CanvasD3Scatter from "../components/CanvasD3Scatter";
import { useScrollData } from "scroll-data-hook";
import { csv } from "d3";
import { Scrollama, Step } from "react-scrollama";
import { graphql } from "gatsby";

const scatterScrollingtext = (scrollLocation) => {
  console.log(scrollLocation)
  if (scrollLocation === 2) {
    return {
      title: (
        <>
          Diary Entries by <b>week</b>
        </>
      ),
      date_selection: "week",
    };
  }

  if (scrollLocation === 1) {
    return {
      title: (
        <>
          Diary Entries by <b>month</b>
        </>
      ),
      date_selection: "month",
    };
  }

  if (scrollLocation === 0) {
    return {
      title: (
        <>
          Diary Entries by <b>year</b>
        </>
      ),
      date_selection: "year",
    };
  }

  return {
    title: (
      <>
        Diary Entries by <b>year</b>
      </>
    ),
    date_selection: "year",
  };
};

const ChildhoodDiary = ({ data }) => {
  const diaryRawData = data.allDataCsv.edges[0].node.items;
  const [formattedData, setFormattedData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [currentWidth, setCurrentWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );
  const [currentHeight, setCurrentHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 1000
  );
  const onStepEnter = (stepdata) => {
    setCurrentStepIndex(stepdata.data);
  };

  React.useEffect(() => {
    const diaryFormattedData = [];

    diaryRawData.forEach((d) => {
      let dObject = {
        id: d.id,
        date: d.date,
        entry_word_count: d.entry_word_count,
        formatted_date: new Date(d.formatted_date),
        month: new Date(d.formatted_date).getMonth(),
        year: new Date(d.formatted_date).getFullYear(),
        quarter: new Date(d.formatted_date).getFullYear(),
        week: new Date(d.formatted_date).getDay(),
        radius: 20,
        formatted_date: new Date(d.formatted_date),
      };
      diaryFormattedData.push(dObject);
    });
    setFormattedData(diaryFormattedData);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.onresize = function (event) {
        setCurrentWidth(window.innerWidth);
        setCurrentHeight(window.innerHeight);
      };
    }
    return () => [{}];
  }, []);

  return (
    formattedData && (<div>
      <CanvasD3Scatter
        className={"staticGraphicContainer"}
        height={currentHeight * 0.95}
        width={currentWidth * 0.6}
        particles={formattedData}
        useScrollData={useScrollData}
        hsla={"hsla(0, 100%, 65%, 1)"}
        dateSelection={scatterScrollingtext(currentStepIndex).date_selection}
        valueSelection="entry_word_count"
        stepIndex={currentStepIndex}
        margin={10}
        marginLeft={currentWidth * 0.1}
        marginTop={currentWidth * 0.3}
      />

      <div className="scrollingTextContainer darkModeScrollingTitle">
        <Scrollama className="" offset={0.5} onStepEnter={onStepEnter}>
          {[0, 1, 2, 3].map((_, stepIndex) => (
            <Step data={stepIndex} key={stepIndex}>
              <div class="textStep">
                {scatterScrollingtext(stepIndex).title}
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>
    </div>
    )
  );
};

export const query = graphql`
  query ChildhoodDiaryQuery {
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

export default ChildhoodDiary;
