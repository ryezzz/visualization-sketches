// To fix canvas blurryness I used this: https://stackoverflow.com/questions/48961797/canvas-circle-looks-blurry
import { useEffect, useRef, useState, useMemo } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import React from "react";
import { gsap } from "gsap";
import { isBrowser } from "../../utils/staticRendering";
import { dodge, dodgeMap } from "../../utils/visualizationUtils";
import * as RoughCanvas from "roughjs/bin/canvas";
import { usePrevious } from "../../hooks/customHooks";
import { RoughGenerator } from "roughjs/bin/generator";
// import { select } from "d3";
// import { withTheme } from "styled-components";

// import * as RoughSvgfrom from "roughjs/bin/svg"

const ScrollySwarmDrawing = (
  props,
  {
    pixelRatio = props.pixelRatio,
    particles = props.particles,
    height = props.height,
    width = props.width,
    margin = props.margin,
    marginLeft = props.marginLeft,
    circleColor = "rgba(0,0,255,.3)",
    strokeColor = "rgba(0,0,255,1)",
    animationDuration = 2,
    lineWidth = 0,
    padding = lineWidth,
  }
) => {
  const prevDate = usePrevious(props.dateSelection, "year");
  const mainCanvasRef = useRef();
  const axisRef = useRef();
  const interactiveCanvasRef = useRef();

  const rScale = d3
    .scaleLinear()
    .domain(d3.extent(particles, (d) => d[props.valueSelection]))
    .range([1, height / 70]);

  const xScale = (_, prevOrCurrent) =>
    d3
      .scaleSequential()
      .domain(d3.extent(particles, (d) => d[prevOrCurrent]))
      .range([marginLeft + margin, width]);

  const r = (selectedValue) => rScale(selectedValue);

  const tooltip =
    isBrowser() && d3.select("#tooltipDivLight").style("opacity", 0);

  function showTooltip(
    tooltipX,
    tooltipY,
    readableValue,
    readableDate,
    readableFullDate
  ) {
    isBrowser() &&
      tooltip
        .style("opacity", 1)
        .style("display", "block")
        .style("top", tooltipY + "px")
        .style("left", tooltipX + 30 - margin + "px")
        .style("z-index", 5000000)
        .html(
          `<div class ="swarmTooltipText">
          <div>words written: <b>${readableValue}</b></div>
          <div>${props.dateSelection}: <b>${formatTics(
            props.dateSelection,
            readableDate
          )}</b></div>
          <div><b>${readableFullDate}</b></div>
          </div>`
        );
  }

  // const delaunayPoints = (dateString, x, y) =>
  //   Delaunay.from(dodgedParticlesDestination.map((d) => [d.x, d.y]));

  const xAxisScale = d3
    .scaleSequential()
    .domain(d3.extent(particles, (d) => d[props.dateSelection]))
    .range([marginLeft, width - margin]);

  const xAxis = d3
    .axisBottom(xAxisScale)
    .ticks(5)
    .tickFormat((d) => `${formatTics(props.dateSelection, d)}`);

  const dodgedParticlesOrigin = dodge(
    particles,
    prevDate,
    props.valueSelection,
    xScale(particles, prevDate || "year"),
    r,
    padding
  );

  const dodgedParticlesDestination = dodge(
    particles,
    props.dateSelection,
    props.valueSelection,
    xScale(particles, props.dateSelection),
    r,
    padding
  );

  const generateDelaunay = (pointData) =>
    Delaunay.from(pointData.map((d) => [d.x, d.y]));

  const [canvasState, setCanvasState] = useState(mainCanvasRef);
  const originRef = useRef(dodgedParticlesOrigin);

  function animatePoints() {
    if (!mainCanvasRef.current || !originRef.current) {
      return;
    }
    const canvas = canvasState;
    const context = canvas.getContext("2d", { alpha: false });
    const animation = GSAPanimation(
      originRef.current,
      dodgedParticlesDestination,
      animate,
      animationDuration,
      0.001,
      `elastic.inOut(.3, .3)`,
      onComplete,
      onInterupt,
      prevDate
    );

    function onComplete() {
      // for debugging
      // console.log("Complete", animation._start, animation._end);
      // console.log(gsap.globalTimeline.seek(0).invalidate());
    }

    function onInterupt() {
      // for debugging
      // console.log("interrupt");
      // console.log(this);
      // this._ease("elastic.inOut(.4, .4)");
    }

    function animate() {
      context.clearRect(0, 0, width, height);
      d3.select(axisRef.current).call(xAxis);

      originRef.current.map((d, i) => {
        // let variedStroke = d.r > 10 ? d.r / 10 : d.r > 7 ? d.r / 10 : d.r / 5;
        let variedStroke = 1.5;

        context.beginPath();
        context.arc(d.x - margin, height - d.y, d.r - 1, 0, 2 * Math.PI);
        // context.stroke();
        context.fill();
        renderRoughCircle(
          d.x - margin,
          height - d.y,
          d.r * 1.9,
          canvas,
          variedStroke
        );
      });
    }
  }

  // Create Canvas
  useEffect(() => {
    if (!mainCanvasRef.current) {
      return;
    }

    const canvas = mainCanvasRef.current;
    const context = canvas.getContext("2d", { alpha: true });

    context.scale(pixelRatio, pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.lineWidth = lineWidth;
    context.fillStyle = circleColor;
    context.strokeStyle = strokeColor;
    setCanvasState(canvas);
  }, [mainCanvasRef, props.width, props.height]);

  if (canvasState.getContext) {
    animatePoints(canvasState);
  }

  //Make interactive
  useMemo(() => {
    if (!interactiveCanvasRef.current) {
      return;
    }

    const interactiveCanvas = interactiveCanvasRef.current;
    const interactiveContext = interactiveCanvas.getContext("2d");

    interactiveContext.scale(pixelRatio, pixelRatio);
    interactiveContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    interactiveContext.fillStyle = circleColor;

    const delaunayPoints = () => generateDelaunay(dodgedParticlesDestination);

    onscroll = () => {
      pointHoverOut();
    };

    const pointHoverIn = (hoverActive) => {
      interactiveContext.clearRect(0, 0, width, height);
      interactiveContext.fillStyle = "black";

      renderRoughCircle(
        hoverActive.x - margin,
        height - hoverActive.y,
        hoverActive.r * 2,
        interactiveCanvas
      );
      interactiveContext.fill();
    };
    const pointHoverOut = () => {
      interactiveContext.clearRect(0, 0, width, height);
    };

    function hideTooltip(hoverInactive) {
      isBrowser && tooltip.style("display", "none");
      isBrowser && tooltip.style("opacity", "0");
    }

    onmousemove = (event) => {
      event.preventDefault();
      let pageYoffset = window.pageYOffset;
      let mousePoint = d3.pointer(event, this);
      let xi = mousePoint[0] + margin;
      let y = height - mousePoint[1] + pageYoffset;
      let heightCond = xi < width + margin;
      let index = delaunayPoints(props.dateSelection).find(xi, y);
      let indexObj = dodgedParticlesDestination[index];
      let tooltipX = indexObj.x;
      let tooltipY = height - indexObj.y;
      let tooltipLegibleValue = indexObj.data[props.valueSelection];
      let tooltipLegibleSelectedDate = indexObj.data[props.dateSelection];
      let tooltipLegibleDate = indexObj.data.date;

      heightCond
        ? showTooltip(
            tooltipX,
            tooltipY,
            tooltipLegibleValue,
            tooltipLegibleSelectedDate,
            tooltipLegibleDate
          )
        : hideTooltip(indexObj);

      heightCond ? pointHoverIn(indexObj) : pointHoverOut(indexObj);
    };
  }, [interactiveCanvasRef, props.dateSelection, height, width]);

  return (
    <div className="canvasStickyChartContainer scrollySwarmContainerDrawing">
      <div id="tooltipDivLight" className="tooltipDiv" />
      <svg
        className="canvasStickyPointHighlight"
        width={width}
        height={height}
      ></svg>
      <canvas
        className={"canvasStickyChart"}
        style={{
          width: props.width + "px",
          height: props.height + "px",
        }}
        ref={mainCanvasRef}
        width={props.width * props.pixelRatio}
        height={props.height * props.pixelRatio}
      />

      <canvas
        className={"canvasStickyChart"}
        style={{
          width: props.width + "px",
          height: props.height + "px",
        }}
        ref={interactiveCanvasRef}
        width={props.width * props.pixelRatio}
        height={props.height * props.pixelRatio}
      />
      {/* <canvas ref={glRef}></canvas> */}
      <svg style={{ top: props.height - 1 }} className="canvasStickyChartAxis">
        <g className="font-sans text-lg" ref={axisRef}></g>
      </svg>
    </div>
  );
};

export default ScrollySwarmDrawing;

export const GSAPanimation = (
  originData,
  destinationData,
  onUpdate,
  animationDuration,
  stagger,
  ease,
  onComplete,
  onInterrupt,
  isDateNotNull
) =>
  gsap.fromTo(
    originData,
    {
      x: (index) => (isDateNotNull ? originData[index].x : 500),
      y: (index) => (isDateNotNull ? originData[index].y : -30),
    },
    {
      x: (index) => destinationData[index].x,
      y: (index) => destinationData[index].y,
      ease: isDateNotNull ? ease : "elastic.out",
      duration: animationDuration,
      // Documentation: https://greensock.com/docs/v3/Staggers
      onUpdate: onUpdate,
      data: originData,
      lazy: false,
      overwrite: true,
      onComplete: onComplete,
      // startAt: { x: -100, opacity: 0 },
      onInterrupt: onInterrupt,
      // autoRemoveChildren: true,
      stagger: {
        each: stagger,
        from: isDateNotNull ? "random" : "random",
      },
    }
  );

export const renderRoughCircle = (cx, cy, diamater, canvasElem, strokeWidth) =>
  new RoughCanvas.RoughCanvas(canvasElem).circle(cx, cy, diamater, {
    roughness: 0.2,
    move: 0,
    stroke: "#303030",
    strokeWidth: strokeWidth,
  });

console.log("ROUGH", RoughGenerator, renderRoughCircle);

export const formatWeek = (d) => {
  if (d === 0) {
    return "Sun";
  }
  if (d === 1) {
    return "Mon";
  }
  if (d === 2) {
    return "Tues";
  }
  if (d === 3) {
    return "Wed";
  }
  if (d === 4) {
    return "Thurs";
  }
  if (d === 5) {
    return "Fri";
  }
  if (d === 6) {
    return "Sat";
  }
  return d;
};

export const formatMonth = (d) => {
  if (d === 0) {
    return "Jan";
  }
  if (d === 2) {
    return "Feb";
  }
  if (d === 3) {
    return "Mar";
  }
  if (d === 4) {
    return "Apr";
  }
  if (d === 5) {
    return "May";
  }
  if (d === 6) {
    return "Jun";
  }
  if (d === 7) {
    return "Jul";
  }
  if (d === 8) {
    return "Aug";
  }
  if (d === 9) {
    return "Sept";
  }
  if (d === 10) {
    return "Oct";
  }
  if (d === 11) {
    return "Nov";
  }
  if (d === 12) {
    return "Dec";
  }
  return d;
};

export function formatTics(selectedTime, d) {
  if (selectedTime === "week") {
    return formatWeek(d);
  }
  if (selectedTime === "month") {
    return formatMonth(d);
  }
  return d;
}
