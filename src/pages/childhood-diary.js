import React, { useState } from "react";
import CanvasD3Scatter from "../components/CanvasD3Scatter";
import { useScrollData } from "scroll-data-hook";
import { Scrollama, Step } from "react-scrollama";
import { graphql } from "gatsby";
import "../styles.css"
import { json } from "d3";

const scatterScrollingtext = (scrollLocation) => {
  console.log(scrollLocation);
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

const ChildhoodDiary = ({ data }, props) => {

  const diaryRawData = data.allDataCsv.edges[0].node.items;
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [currentWidth, setCurrentWidth] = useState(
    typeof window != "undefined" ? window.innerWidth : 0
  );
  const [currentHeight, setCurrentHeight] = useState(
    typeof window != "undefined" ? window.innerHeight : 0
  );
  const onStepEnter = (stepdata) => {
    setCurrentStepIndex(stepdata.data);
  };

  const formatDatafFunct = (dataElem) => {
    const diaryFormattedData = [];
    dataElem.forEach((d) => {
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
    return diaryFormattedData;
  };

  React.useEffect(() => {
    if (typeof window != "undefined") {
      setCurrentWidth(window.innerWidth);
      setCurrentHeight(window.innerHeight);
      window.onload = () => {
        setCurrentWidth(window.innerWidth);
        setCurrentHeight(window.innerHeight);
      }
      window.onresize = function (event) {
        console.log('window loaded')
        setCurrentWidth(window.innerWidth);
        setCurrentHeight(window.innerHeight);
      };

    }
  }, [currentWidth, currentHeight]);

const windowHeightWidth =()=> {
  if (typeof window != "undefined") {
    return {width: window.innerWidth, height: window.innerHeight}

  }

  window.onload = () => {
    return {width: window.innerWidth, height: window.innerHeight}
    }

  return 0
}


if (typeof window === `undefined`) {
  return(<></>);
}
  return (

    <div>
      <div>
        <CanvasD3Scatter
          className={"staticGraphicContainer"}
          height={currentHeight * 0.95}
          width={currentWidth * 0.6}
          particles={formatDatafFunct(diaryRawData)}
          useScrollData={useScrollData}
          hsla={"hsla(0, 100%, 65%, 1)"}
          dateSelection={scatterScrollingtext(currentStepIndex).date_selection}
          valueSelection="entry_word_count"
          stepIndex={currentStepIndex}
          margin={10}
          marginLeft={currentWidth * 0.1}
          marginTop={currentHeight * 0.7}
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
    </div>
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
