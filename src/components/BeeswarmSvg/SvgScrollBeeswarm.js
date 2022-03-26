import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { dodge } from "../../utils/visualizationUtils";
import * as rough from "roughjs/bin/svg";
import { gsap } from "gsap";
import ReactRough, { Circle } from "react-rough";

function SvgScrollBeeswarm(
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

  function usePrevious(value, defaultValue) {
    let isNotNull = value != null ? value : defaultValue;
    const ref = useRef();
    useEffect(() => {
      ref.current = isNotNull;
    });
    return ref.current;
  }

  const [animatedData, setAnimatedData] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
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

  useEffect(() => {
    setCurrentDate("year");
  }, []);

  const dodgedParticlesOrigin = dodge(
    data,
    prevDate,
    selectedValue,
    xScale(data, prevDate),
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

  useEffect(() => {
    // let isNotNull =
    //   dodgedParticlesOrigin[0].x && dodgedParticlesDestination[0].x
    //     ? true
    //     : false;

    function animation  ()  {
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
          duration: 0.5,
          // Documentation: https://greensock.com/docs/v3/Staggers
          onUpdate: animate,
          lazy: true,
          stagger: {
            each: 0.001,
            from: "random",
          },
        }
      );
    };

    animation()


    function animate() {
      let newParticles = [];
      dodgedParticlesOrigin.map((d) => newParticles.push(d));
      setAnimatedData(newParticles);
    }


  }, [currentDate]);

  let timeFrames = ["week", "month", "year"];



  const TimeButton = (timeframe, setFun) => {

    function onClick(e) {
      setFun(e.target.value);
    }

    return (
      <button value={timeframe} onClick={onClick}>
        {timeframe}
      </button>
    );
  };

  return (
    <>
      {timeFrames.map((timeframe) => TimeButton(timeframe, setCurrentDate))}

      <ReactRough width={width} height={height} renderer="svg">
        {animatedData?.map((d, i) => {

          return (
            <>
              {
                <Circle
                  diameter={d.r * 2}
                  stroke="purple"
                  x={d.x}
                  y={height - marginBottom - padding - d.y}
                />
              }
            </>
          );
        })}
      </ReactRough>
    </>
  );
}

export default SvgScrollBeeswarm;

// <ReactRough width={width} height={height} renderer="svg">

// {dodgedParticlesOrigin.map(
//   (d, i) => {
//   // console.logAnimatedPointHook (0, d.x)
//   // console.log(d.x)

//     return (
// <Circle
//   diameter={d.r * 2}
//   fill="purple"
//   x={d.x}
//   y={height - marginBottom - padding - d.y}
// />
//     )
//   }
// )}
// </ReactRough>

// https://www.framer.com/docs/animation/

// const x = useMotionValue(0)

// useEffect(() => {
//   const controls = animate(x, 100, {
//     type: "spring",
//     stiffness: 2000,
//     onComplete: v => {}
//   })

//   return controls.stop
// })

// {timeFrames.map((elem)=>TimeButton(elem,onClick))}

// <ReactRough width={width} height={height} renderer="svg">

//     {animatedData?.map(
//       (d, i) => {
//       // console.logAnimatedPointHook (0, d.x)
//       // console.log(d.x)

//         return (

//               <Circle
//     diameter={d.r * 2}
//     stroke="purple"
//     x={d.x}
//     y={height - marginBottom - padding - d.y}
//   />

//           // <circle fill="white" cx={d.x} cy={height - marginBottom - padding - d.y} r={d.r}/>

//         )
//       }
//     )}
// </ReactRough>

//   </>

// import * as d3 from "d3";
// import React, { useRef, useEffect, useState } from "react";
// import { dodge } from "../../utils/visualizationUtils";
// import * as rough from "roughjs/bin/svg";
// import { gsap } from "gsap";

// function SvgScrollBeeswarm(
//   props,
//   {
//     data = props.data,
//     selectedDate = props.selectedDate,
//     selectedValue = props.selectedValue,
//     height = props.height,
//     width = props.width,
//     marginLeft = props.margin,
//     marginBottom = props.marginTop,
//     marginRight = props.marginRight,
//     padding = 0,
//   }
// ) {
//   function usePrevious(value, defaultValue) {
//     let isNotNull = value != null ? value : defaultValue;
//     const ref = useRef();
//     useEffect(() => {
//       ref.current = isNotNull;
//     });
//     return ref.current;
//   }

//   const [animatedData, setAnimatedData] = useState(data);
//   const [currentDate, setCurrentDate] = useState(null);
//   const prevDate = usePrevious(currentDate, "year");

//   let rScale = d3
//     .scaleLinear()
//     .domain(d3.extent(data, (d) => d[selectedValue]))
//     .range([1, height / 80]);

//   const xScale = (_, prevOrCurrent) =>
//     d3
//       .scaleSequential()
//       .domain(d3.extent(data, (d) => d[prevOrCurrent]))
//       .range([100, width]);

//   let r = (selectedValue) => rScale(selectedValue);

//   useEffect(() => {
//     setCurrentDate("year");
//   }, []);

//   const dodgedParticlesOrigin = dodge(
//     data,
//     prevDate,
//     selectedValue,
//     xScale(data, prevDate),
//     r,
//     padding
//   );

//   const dodgedParticlesDestination = dodge(
//     data,
//     currentDate,
//     selectedValue,
//     xScale(data, currentDate),
//     r,
//     padding
//   );

//   useEffect(() => {
//     let isNotNull =
//       dodgedParticlesOrigin[0].x && dodgedParticlesDestination[0].x
//         ? true
//         : false;

//     const animation = () => {
//       isNotNull === true &&
//         gsap.fromTo(
//           dodgedParticlesOrigin,
//           {
//             x: (index) => dodgedParticlesOrigin[index].x,
//             y: (index) => dodgedParticlesOrigin[index].y,
//           },
//           {
//             x: (index) => dodgedParticlesDestination[index].x,
//             y: (index) => dodgedParticlesDestination[index].y,
//             ease: "power.3.out",
//             duration: 1,
//             // Documentation: https://greensock.com/docs/v3/Staggers
//             onUpdate: animate,
//             lazy: true,
//             stagger: {
//               each: 0.001,
//               from: "random",
//             },
//           }
//         );
//     };

//     animation();

//     function animate() {
//       let newParticles = [];
//       dodgedParticlesOrigin.map((d) => newParticles.push(d));
//       isNotNull === true && setAnimatedData(newParticles);
//     }
//   }, [currentDate]);

//   let timeFrames = ["week", "month", "year"];

//   function onClick(e) {
//     setCurrentDate(e.target.value);
//   }

//   const TimeButton = (timeframe, onClickFun) => {
//     return (
//       <button value={timeframe} onClick={onClickFun}>
//         {timeframe}
//       </button>
//     );
//   };

//   return (
//     <>
//       {timeFrames.map((elem) => TimeButton(elem, onClick))}
//       <svg width={width} height={height}>
//         <g>
//           {animatedData?.map((d, i) => {
//             let notUndefined = typeof d.x != "undefined";
//             return (
//               <>
//                 {notUndefined && (
//                   <circle
//                     r={d.r}
//                     fill="purple"
//                     cx={d.x}
//                     cy={height - marginBottom - padding - d.y}
//                   >
//                     {console.log(typeof d.x, notUndefined)}
//                   </circle>
//                 )}
//               </>
//             );
//           })}
//         </g>
//       </svg>
//     </>
//   );
// }

// export default SvgScrollBeeswarm;
