import React, { useEffect, useRef, createRef, useState } from "react";
import { ScrollSwarmDrawing } from "../components/ScrollySwarm";
import { useScrollData } from "scroll-data-hook";
import debounce from "debounce";
import { Link } from "gatsby";
import { useScrollRestoration } from "gatsby";
import { Scrollama, Step } from "react-scrollama";
import { graphql } from "gatsby";
import "../styles.css";
import { isBrowser } from "../utils/staticRendering";
import { scatterScrollingtextSwarm } from "../utils/childhoodDiaryUtils";
import { formatDataFunct } from "../utils/childhoodDiaryUtils";
// import * as Scroll from 'react-scroll';

// const ScrollSwarmPageDrawing = () => {
//   return(
//     <ScrollSwarmDrawing/>
//   )
// }

const ScrollSwarmPageDrawing = ({ data }) => {
  const diaryRawData = data.allDataCsv.edges[0].node.items;

  const [currentSelectedTime, setCurrentSelectedTime] = useState(null);
  const [pixelRatio, setPixelRatio] = useState(
    isBrowser() ? window.devicePixelRatio : 0
  );
  const [currentWidth, setCurrentWidth] = useState(
    isBrowser() ? window.innerWidth : 0
  );
  const [currentHeight, setCurrentHeight] = useState(
    isBrowser() ? window.innerHeight : 0
  );

  const onStepEnter = (stepdata, index) => {
    setCurrentSelectedTime(stepdata.data);
  };

  const generateOffset = (stepdata, index) => {
    console.log("OFFSET", stepdata);
    return 1;
  };

  function onStepProgress(data, index) {
    console.log("STEPDATA", data);
    // window.scrollTo({
    //   top: stepdata.element.offsetTop - currentHeight/2,
    //   behavior: 'smooth'
    // });
  }

  const scrollOrder = ["year", "month", "week"];

  // const [elRefs, setElRefs] = useState([]);

  const stepRefs = useRef([]);

  // console.log(Object.keys(stepRefs).length != scrollOrder.length)
  stepRefs.current = scrollOrder.map(
    (element, i) => stepRefs.current[i] ?? createRef()
  );

  React.useEffect(() => {
    if (isBrowser()) {
      setCurrentWidth(window.innerWidth);
      setCurrentHeight(window.innerHeight);
      setPixelRatio(window.devicePixelRatio);
      window.onresize = function () {
        setCurrentWidth(window.innerWidth);
        setCurrentHeight(window.innerHeight);
        setPixelRatio(window.devicePixelRatio);
      };
    }
  }, [currentWidth, pixelRatio]);

  if (isBrowser() === false) {
    return <></>;
  }

  return (
    <div className="">
      <div>
        <ScrollSwarmDrawing
          className={"left-0"}
          height={currentHeight * 0.9}
          width={currentWidth * 0.9}
          particles={formatDataFunct(diaryRawData)}
          useScrollData={useScrollData}
          dateSelection={
            scatterScrollingtextSwarm(currentSelectedTime).date_selection
          }
          valueSelection="entry_word_count"
          stepIndex={currentSelectedTime}
          margin={currentWidth * 0.2}
          marginLeft={currentWidth * 0.1}
          marginTop={currentHeight * 0.1}
          pixelRatio={pixelRatio}
        />
        <div className="w-1/4 float-right">
          {/* {scrollOrder.map((selectedTime, i) => (
            <div ref={stepRefs.current[i]}></div>
          ))} */}
          <Scrollama
            threshold={1}
            offset={0.5}
            onStepEnter={onStepEnter}
            debug={false}
          >
            {scrollOrder.map((selectedTime, i) => (
              <Step data={selectedTime}>
                <div
                  key={i}
                  ref={stepRefs.current[i]}
                  style={{
                    opacity: currentSelectedTime === selectedTime ? 1 : 0.5,
                  }}
                  class="textStep scrollySwarmTextStep"
                >
                  <div
                    id={currentSelectedTime + i}
                    style={{
                      opacity: currentSelectedTime === selectedTime ? 1 : 1,
                    }}
                    className="scrollToSelection"
                    ref={stepRefs.current[i]}
                  >
                    {" "}
                    {scatterScrollingtextSwarm(selectedTime).title}
                  </div>
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
  query ScrollSwarmPageDrawing {
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

export default ScrollSwarmPageDrawing;
