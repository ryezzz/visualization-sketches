import React, { useState } from "react";
import CanvasD3Scatter from "../components/CanvasD3Scatter";
import { useScrollData } from "scroll-data-hook";
import { Scrollama, Step } from "react-scrollama";
import { graphql } from "gatsby";
import "../styles.css";
import { isBrowser } from "../utils/staticRendering";
import { scatterScrollingtext } from "../utils/childhoodDiaryUtils";
import { formatDataFunct } from "../utils/childhoodDiaryUtils";

const ChildhoodDiary = ({ data }) => {
  const diaryRawData = data.allDataCsv.edges[0].node.items;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [pixelRatio, setPixelRatio] = useState(
    isBrowser() ? window.devicePixelRatio : 0
  );
  const [currentWidth, setCurrentWidth] = useState(
    isBrowser() ? window.innerWidth : 0
  );
  const [currentHeight, setCurrentHeight] = useState(
    isBrowser() ? window.innerHeight : 0
  );

  const onStepEnter = (stepdata) => {
    setCurrentStepIndex(stepdata.data);
  };

  React.useEffect(() => {
    if (isBrowser()) {
      setCurrentWidth(window.innerWidth);
      setCurrentHeight(window.innerHeight);
      setPixelRatio(window.devicePixelRatio);
      window.onresize = function (event) {
        setCurrentWidth(window.innerWidth);
        setCurrentHeight(window.innerHeight);
        setPixelRatio(window.devicePixelRatio);

      };
    }
  }, [currentWidth, currentHeight, pixelRatio]);


  if (isBrowser()===false) {
    return <></>;
  }

  return (
    <div className="fixedContainer">
      <div>

        <CanvasD3Scatter
          className={"staticGraphicContainer"}
          height={currentHeight * 0.95}
          width={currentWidth * 0.6}
          particles={formatDataFunct(diaryRawData)}
          useScrollData={useScrollData}
          hsla={"hsla(0, 100%, 65%, 1)"}
          dateSelection={scatterScrollingtext(currentStepIndex).date_selection}
          valueSelection="entry_word_count"
          stepIndex={currentStepIndex}
          margin={10}
          marginLeft={currentWidth * 0.1}
          marginTop={currentHeight * 0.7}
          pixelRatio={pixelRatio}
        />

        <div className="scrollingTextContainer darkModeScrollingTitle">

          <Scrollama className="" offset={0.5} onStepEnter={onStepEnter} debug={false}>
            {[0, 1, 2, 3].map((_, stepIndex) => (
              <Step data={stepIndex} key={stepIndex}>
                <div style={{                opacity: currentStepIndex === stepIndex ? 1 : 0.2,
}} class="textStep">
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
