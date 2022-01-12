import React, { useRef, createRef, useState } from "react";
import ScrollySwarm from "../components/ScrollySwarm";
import { useScrollData } from "scroll-data-hook";
import debounce from "debounce";
import { Link } from "gatsby"
import { useScrollRestoration } from "gatsby"
import { Scrollama, Step } from "react-scrollama";
import { graphql } from "gatsby";
import "../styles.css";
import { isBrowser } from "../utils/staticRendering";
import { scatterScrollingtextSwarm } from "../utils/childhoodDiaryUtils";
import { formatDataFunct } from "../utils/childhoodDiaryUtils";
// import * as Scroll from 'react-scroll';

const ScrollySwarmPage = ({ data }) => {
  const diaryRawData = data.allDataCsv.edges[0].node.items;


  const scrollOrder = ["year", "month", "week","year", "year", "month", "week", "year"]

  const stepRefs = useRef([]);
  stepRefs.current = scrollOrder.map((element, i) => stepRefs.current[i] ?? createRef(element));
  function handleBackClick() {
    stepRefs.current.scrollIntoView({ behavior: "smooth" });
  }

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

  const onStepEnter = (stepdata) => {
    setCurrentSelectedTime(stepdata.data);
  };

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
    <div className={"scrollySwarmContainer"}>
      <div>
        <ScrollySwarm
          className={"staticGraphicContainer scrollySwarmContainer"}
          height={currentHeight * 0.95}
          width={currentWidth * 0.6}
          particles={formatDataFunct(diaryRawData)}
          useScrollData={useScrollData}
          dateSelection={
            scatterScrollingtextSwarm(currentSelectedTime).date_selection
          }
          valueSelection="entry_word_count"
          stepIndex={currentSelectedTime}
          margin={45}
          marginLeft={currentWidth * 0.1}
          marginTop={currentHeight * 0.7}
          pixelRatio={pixelRatio}
        />

        <div className="scrollingTextContainer darkModeScrollingTitle">
          <Scrollama offset={0.5} onStepEnter={onStepEnter} debug={false}>
            {scrollOrder.map((selectedTime, index) => (
              <Step data={selectedTime}>
                <div ref={stepRefs.current[index]} id={selectedTime}
                  style={{
                    opacity: currentSelectedTime === selectedTime ? 1 : 0.2,
                  }}
                  class="textStep scrollySwarmTextStep"
                >
                  {scatterScrollingtextSwarm(selectedTime).title}
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
  query ScrollySwarmPage {
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

export default ScrollySwarmPage;
