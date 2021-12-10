import React, { useState } from 'react';
// import BarChart from "../components/BarChart";
// A demo with everything I want except react https://observablehq.com/@spattana/interaction-in-d3-canvas-based-scatter-plots
import ScatterPlot from "../components/Scatterplot";
import BeeSwarm from "../components/BeeSwarm";
// import BeeSwarm from "../components/BeeSwarm";
import {GetScroll} from "../hooks/customHooks";
// import CanvasDemo from "../components/CanvasDemo";
import CanvasD3Scatter from "../components/CanvasD3Scatter";
import { useScrollData } from "scroll-data-hook";
import { csv } from "d3";
import moment from "moment";
import { Scrollama, Step } from 'react-scrollama';


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
        let quarter = moment(new Date(i.formatted_date))
          .quarter(moment().quarter())
          .startOf("quarter");
        let month = new Date(i.formatted_date).getMonth();
        let year = new Date(i.formatted_date).getFullYear();
        particlesArr.push([year, i.entry_word_count, i.formatted_date]);
        i.id = idGen;
        i.date = i.date;
        i.month = month;
        i.year = year;
        i.quarter = quarter;
        i.index = index;
        i.radius = 20;
        i.particles = particles;
      });
      setData(d);
      setParticles(particlesArr);
      setLoading(false);

    });
    return () => undefined;
  }, []);

  const pixelRatio = window.devicePixelRatio
  const stepCheck = (currentStepIndex)=> {
  if (currentStepIndex === 0) { return "year" }
  if (currentStepIndex === 1) { return "month" }
  if (currentStepIndex === 2) { return "quarter" }
  return "year"

  }
  return (
    <>
      {}
      {!loading && (
        <div>


<div style={{ position: 'sticky', top: 0, border: '1px solid orchid' }}>

       <CanvasD3Scatter
            height={500}
            width={500}
            particles={data}
            useScrollData = {useScrollData}
            hsla={"hsla(0, 100%, 65%, 1)"}
            pixelRatio={pixelRatio}
            dateSelection={stepCheck(currentStepIndex)}
            valueSelection="entry_word_count"
          />

{console.log('current step index home', stepCheck(currentStepIndex))}
        I'm sticky. The current triggered step index is: {currentStepIndex}
      </div>
<Scrollama onStepEnter={onStepEnter} debug>


        {[1, 2, 3, 4].map((_, stepIndex) => (
          <Step data={stepIndex} key={stepIndex}>



            <div
              style={{
                margin: '50vh 0',
                border: '1px solid gray',
                opacity: currentStepIndex === stepIndex ? 1 : 0.2,
              }}
            >
              I'm a Scrollama Step of index {stepIndex}
            </div>
          </Step>
        ))}
        </Scrollama>
          {/* <BeeSwarm
            height={500}
            width={window.innerWidth}
            particles={particles}
            hsla={"hsla(238, 83%, 35%, .5)"}
          /> */}

          {/* <ScatterPlot data={data}></ScatterPlot> */}

          {JSON.stringify(data)}
        </div>
      )}
    </>
  );
};

export default ChildhoodDiary;

// let height = props.height;
// let width = props.width;
// let stroke = 5;
// let particles = props.particles;
// let ref = useRef();
