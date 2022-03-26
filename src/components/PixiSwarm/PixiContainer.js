// To fix canvas blurryness I used this: https://stackoverflow.com/questions/48961797/canvas-circle-looks-blurry
import { useEffect, useRef, useState } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import React from "react";
import { gsap } from "gsap";
import { dodge, dodgeMap } from "../../utils/visualizationUtils";
import * as RoughCanvas from "roughjs/bin/canvas";
import * as RoughSvg from "roughjs/bin/svg";
import { Stage, Sprite, } from '@inlet/react-pixi'
import { usePrevious } from "../../hooks/customHooks";
import { PixiSwarm } from "./PixiSwarm";
import ReactRough, { Circle } from "react-rough";
import { Texture } from 'pixi.js'

import { FixedSizeList as List } from "react-window";

function PixiContainer(
  props,
  {
    data = props.data,
    selectedDate = props.selectedDate,
    selectedValue = props.selectedValue,
    height = props.height,
    width = props.width,
    marginLeft = props.margin,
    marginBottom = props.marginTop,
    marginRight = props.marginRight,
    padding = 0,
  }
) {
  // const usePrevious = (value, defaultRef) => {
  //   const ref = useRef(defaultRef);
  //   useEffect(() => {
  //     ref.current = value;
  //   });
  //   return ref.current;
  // };

  const pixiRef = useRef();
  const pixiCanvasRef = useRef();

  const [animatedData, setAnimatedData] = useState([]);
  const [currentDate, setCurrentDate] = useState("year");
  const prevDate = usePrevious(currentDate, "year");

  let rScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d[selectedValue]))
    .range([1, height / 80]);

  const xScale = (_, prevOrCurrent) =>
    d3
      .scaleSequential()
      .domain(d3.extent(data, (d) => d[prevOrCurrent]))
      .range([100, width]);

  let r = (selectedValue) => rScale(selectedValue);

  PixiSwarm(pixiCanvasRef, width, height, "black", pixiCanvasRef, "updated");

  useEffect(() => {
    const dodgedParticlesOrigin = dodge(
      data,
      prevDate,
      selectedValue,
      xScale(data, prevDate),
      r,
      padding
    );

    const dodgedParticlesOriginMap = dodgeMap(
      data,
      currentDate,
      selectedValue,
      xScale(data, currentDate),
      r,
      padding
    );


    const dodgedParticlesDestination = dodge(
      data,
      currentDate,
      selectedValue,
      xScale(data, currentDate),
      r,
      padding
    );

    function animation() {
      gsap.fromTo(
        dodgedParticlesOrigin,
        {
          x: (index) => dodgedParticlesOrigin[index].x,
          y: (index) => dodgedParticlesOrigin[index].y,
        },
        {
          x: (index) => dodgedParticlesDestination[index].x,
          y: (index) => dodgedParticlesDestination[index].y,
          ease: "power.3.out",
          duration: .5,
          // Documentation: https://greensock.com/docs/v3/Staggers
          onUpdate: animate,
          onInterrupt: animate,

          lazy: true,
          stagger: {
            each: 0.001,
            from: "random",
          },
        }
      );
    }



    animation();
    function animate(index) {
      // Thoughts: If I switch from regenerating the data entirely and move to updating map values I can improve performance

      /////////Map///////////
      // console.time("Map");
      // old working version
      // for (const [key, value] of dodgedParticlesOriginMap.entries()) {
      //   dodgedParticlesOriginMap.set(key, [value * 10, value * 10, value * 10]);
      // }
      // console.timeEnd("Map");
      /////////End Map///////////

      let newParticles = [];
      // console.time("Object");
      dodgedParticlesOrigin.map((d) => newParticles.push(d));
      setAnimatedData(newParticles);
      // console.timeEnd("Object");
    }
  }, [currentDate, prevDate]);

  ////////// Time Buttons
  let timeFrames = ["week", "month", "year"];
  const TimeButton = (timeframe, setFun) => {
    function onClick(e) {
      setFun(e.target.value);
    }
    return (
      <button key={Math.random()} value={timeframe} onClick={onClick}>
        {timeframe}
      </button>
    );
  };
  ///////////


  return (
    <>
      {timeFrames.map((timeframe) => TimeButton(timeframe, setCurrentDate))}
      <canvas
        style={{ border: "1px white solid", position: "absolute", zIndex: 1 }}
        ref={pixiCanvasRef}
        width={width / 3}
        height={height / 3}
      />
<Stage width={300} height={300} options={{ backgroundColor: 0xeef1f5 }}>
{/* <Sprite
    image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png"
    scale={{ x: 0.5, y: 0.5 }}
    anchor={0.5}
    x={150}
    y={150}
  /> */}

<Sprite
    image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png"
    scale={{ x: 0.5, y: 0.5 }}
    anchor={0.5}
    x={150}
    y={150}
  />
  <Sprite
    image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png"
    scale={{ x: 0.5, y: 0.5 }}
    anchor={0.5}
    x={150}
    y={150}
  />
  <Sprite
    image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/coin.png"
    scale={{ x: 0.5, y: 0.5 }}
    anchor={0.5}
    x={150}
    y={150}
  />
        </Stage>

      <ReactRough width={width} height={height} renderer="svg">
        {

        animatedData?.map((d, i) => {
          return (
            <Circle
              diameter={d.r * 2}
              stroke="purple"
              fill="red"
              key={i}
              x={d.x}
              y={height - marginBottom - padding - d.y}
            />
          );
        })

      }
      </ReactRough>
    </>
  );
}

export default PixiContainer;
