import React from "react";
// import BarChart from "../components/BarChart";
// A demo with everything I want except react https://observablehq.com/@spattana/interaction-in-d3-canvas-based-scatter-plots

import ScatterPlot from "../components/Scatterplot";
import BeeSwarm from "../components/BeeSwarm";
import CanvasDemo from "../components/CanvasDemo";
import CanvasD3Scatter from "../components/CanvasD3Scatter"



import { csv } from "d3";

import * as d3 from "d3";
import moment from "moment";
// markup
// const particles = (n, width, height) =>
//   Array.from({ length: n }, () => [
//     Math.random() * width,
//     Math.random() * height,
//   ]);

// const getParticlesLarge = particles(20000, window.innerWidth, 2000);

// console.log("PARTICLES", getParticlesLarge)
const ChildhoodDiary = () => {

  let path = "/data/rye4_word_analysis.csv";
  const [data, setData] = React.useState([]);
  const [particles, setParticles] = React.useState([]);
  const chunk = function chunk(arr, chunkSize) {
    if (chunkSize <= 0) throw "Invalid chunk size";
    var R = [];
    for (var i=0,len=arr.length; i<len; i+=chunkSize)
      R.push(arr.slice(i,i+chunkSize));
    return R;
  }

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let particlesArr=[]

    csv(path).then((d) => {

      d.forEach((i, index) => {

        const idGen = "i" + Math.random().toString(16).slice(-4) + "d"

        // let quarter = Math.ceil(new Date(i.formatted_date).getMonth() / 3);
        let quarter = moment(new Date(i.formatted_date)).quarter(moment().quarter()).startOf('quarter');
        let month = new Date(i.formatted_date).getMonth();
        let year = new Date(i.formatted_date).getFullYear()
        // put particles in an array
        let particles = [i.entry_word_count, d[index + 1]? d[index + 1].entry_word_count : d[index - 1].entry_word_count]

        particlesArr.push([year, i.entry_word_count, i.formatted_date])



        i.id = idGen
        i.date =  i.date ;
        i.month = month
        i.year = year
        i.quarter = quarter
        i.index=index
        i.radius=20;
        i.particles=particles;





    });
      let chunks = chunk(particlesArr, 2)
      console.log(chunks)
      setData(d)
      // setParticles(chunk(particlesArr, 2))
      setParticles(particlesArr)

      setLoading(false);
    });
    return () => undefined;
  }, []);

  return (
    <> {!loading &&


<div>
<h1>Childhood Journal Analysis Sketches</h1>

<div><CanvasDemo data={data}/></div>

<CanvasD3Scatter height={500} width={window.innerWidth} particles={particles} hsla={"hsla(0, 100%, 65%, 1)"} />

<BeeSwarm height={500} width={window.innerWidth} particles={particles} hsla={"hsla(238, 83%, 35%, .5)"} />



<ScatterPlot data={data}></ScatterPlot>

{JSON.stringify(data)}</div>}
    </>
  );
};

export default ChildhoodDiary;


// let height = props.height;
// let width = props.width;
// let stroke = 5;
// let particles = props.particles;
// let ref = useRef();
