import React, { useState } from "react";
// import BarChart from "../components/BarChart";
// A demo with everything I want except react https://observablehq.com/@spattana/interaction-in-d3-canvas-based-scatter-plots
import ScatterPlot from "../components/Scatterplot";
import BeeSwarm from "../components/BeeSwarm";
// import BeeSwarm from "../components/BeeSwarm";
// import CanvasDemo from "../components/CanvasDemo";
import CanvasD3Scatter from "../components/CanvasD3Scatter";
import { useScrollData } from "scroll-data-hook";
import { csv } from "d3";
import moment from "moment";
import { Scrollama, Step } from "react-scrollama";

const scatterScrollingtext = (scrollLocation) => {
  if ((scrollLocation === 2)) {
    return {
      title:  <>Diary Entries by <b>week</b></>,
      date_selection: "week",
    };
  }

  if ((scrollLocation === 1)) {
    return {
      title: <>Diary Entries by <b>month</b></>,
      date_selection: "month",
    };
  }

  if ((scrollLocation === 0)) {
    return {
      title:  <>Diary Entries by <b>year</b></>,
      date_selection: "year"
    };
  }

  return {
    title: "",
    date_selection: "",
  };
};

const ChildhoodDiary = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(null);

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
        i.month = new Date(i.formatted_date).getMonth()
        i.year = new Date(i.formatted_date).getFullYear()
        i.quarter = quarter;
        i.index = index;
        i.week = new Date(i.formatted_date).getDay()
        i.radius = 20;
        i.particles = particles;
        i.formatted_date = new Date(i.formatted_date)
      });
      setData(d);
      setParticles(particlesArr);
      setLoading(false);
    });
    return () => undefined;
  }, []);

  const pixelRatio = window.devicePixelRatio;
  return (
    <>
      {!loading && (
        <div>
          <div
            style={{ position: "sticky", top:0, width: "50%", float:"left"}}>
            <CanvasD3Scatter
              height={window.innerHeight * .9}
              width={window.innerWidth/2}
              particles={data}
              useScrollData={useScrollData}
              hsla={"hsla(0, 100%, 65%, 1)"}
              pixelRatio={pixelRatio}
              dateSelection={scatterScrollingtext(currentStepIndex).date_selection}
              valueSelection="entry_word_count"
              stepIndex = {currentStepIndex}
              margin = {10}
            />
          </div>



          <div className="darkModeScrollingTitle" style={{marginTop:-600}}>
          <Scrollama  offset={.5} onStepEnter={onStepEnter}>
            {[0, 1, 2, 3].map((_, stepIndex) => (
              <Step data={stepIndex} key={stepIndex}>
                <div
                  style={{
                    position: "sticky",
                    zIndex: 0,
                    left: "70%",
                    fontSize: "50px",
                    maxWidth: "25%",
                    minHeight: "100px",
                    marginTop: "30vh",
                    marginBottom: "50px",
                    opacity: currentStepIndex === stepIndex ? 1 : .2,
                    transitionProperty: "opacity",
                    transitionDuration: ".5s",
                  }}
                >
                  {scatterScrollingtext(stepIndex).title}
                </div>
              </Step>
            ))}
          </Scrollama>
          </div>



          {/* <BeeSwarm
            height={500}
            width={window.innerWidth}
            particles={particles}
            hsla={"hsla(238, 83%, 35%, .5)"}
          /> */}

          {/* <ScatterPlot data={data}></ScatterPlot> */}

        </div>
      )}

{/* {JSON.stringify(data)} */}

    </>
  );
};

export default ChildhoodDiary;

// let height = props.height;
// let width = props.width;
// let stroke = 5;
// let particles = props.particles;
// let ref = useRef();
