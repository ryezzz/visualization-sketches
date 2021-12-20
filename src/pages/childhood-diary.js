import React, { useState } from "react";
import CanvasD3Scatter from "../components/CanvasD3Scatter";
import { useScrollData } from "scroll-data-hook";
import { csv } from "d3";
import { Scrollama, Step } from "react-scrollama";



const scatterScrollingtext = (scrollLocation) => {
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


const ChildhoodDiary = () => {
  const checkForUndefined=(windowsize)=> windowsize === undefined ? 1000 : windowsize

  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [currentWidth, setCurrentWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000);
  const [currentHeight, setCurrentHeight] = useState(typeof window !== "undefined" ? window.innerHeight: 1000);



  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data);
  };

  const path = "/data/rye4_word_analysis.csv";
  const [data, setData] = React.useState([]);
  const [particles, setParticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let particlesArr = [];
    csv(path).then((d) => {
      d.forEach((i, index) => {
        let idGen = "i" + Math.random().toString(16).slice(-4) + "d";
        let quarter = new Date(i.formatted_date).getFullYear();
        let year = new Date(i.formatted_date).getFullYear();

        i.id = idGen;
        i.date = i.date;
        i.formatted_date = new Date(i.formatted_date);
        i.month = new Date(i.formatted_date).getMonth();
        i.year = new Date(i.formatted_date).getFullYear();
        i.quarter = quarter;
        i.index = index;
        i.week = new Date(i.formatted_date).getDay();
        i.radius = 20;
        i.particles = particles;
        i.formatted_date = new Date(i.formatted_date);
      });
      setData(d);
      setParticles(particlesArr);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  React.useEffect(() => {

    if( typeof window !== "undefined" ) {

    window.onresize = function(event) {
    setCurrentWidth(checkForUndefined(window.innerWidth))
    setCurrentHeight(checkForUndefined(window.innerHeight))
    }
  };
  return () => undefined;
  }, []);


  return (
    <>
      {!loading && (
        <div>
          <CanvasD3Scatter
            className={"staticGraphicContainer"}
            height={currentHeight * 0.95}
            width={currentWidth * 0.6}
            particles={data}
            useScrollData={useScrollData}
            hsla={"hsla(0, 100%, 65%, 1)"}
            dateSelection={
              scatterScrollingtext(currentStepIndex).date_selection
            }
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
      )}
    </>
  );
};

export default ChildhoodDiary;
