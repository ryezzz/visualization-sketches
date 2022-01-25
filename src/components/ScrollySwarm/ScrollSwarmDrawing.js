// To fix canvas blurryness I used this: https://stackoverflow.com/questions/48961797/canvas-circle-looks-blurry
import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import React from "react";
import { gsap } from "gsap";
import { isBrowser } from "../../utils/staticRendering";
import { dodge } from "../../utils/visualizationUtils";
import * as RoughCanvas from "roughjs/bin/canvas";
import { usePrevious } from "../../hooks/customHooks";

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
    // marginTop = props.marginTop,
    circleColor = "rgba(0,0,255,.3)",
    // circleHighlightColor = "rgb(255,255,255)",
    strokeColor = "rgba(0,0,255,1)",
    animationDuration = 0.5,
    lineWidth = 0,
    padding = lineWidth,
  }
) => {
  const mainCanvasRef = useRef();
  const glRef = useRef();
  const highlightRef = useRef();
  const axisRef = useRef();
  const prevDate = usePrevious(props.dateSelection, "");
  const preRenderCanvasRef = useRef()

  const rScale = d3
    .scaleLinear()
    .domain(d3.extent(particles, (d) => d[props.valueSelection]))
    .range([1, height / 70]);


  const xScale = (_, prevOrCurrent) => d3
      .scaleSequential()
      .domain(d3.extent(particles, (d) => d[prevOrCurrent]))
      // .range([marginLeft + margin, width]);
      .range([marginLeft + margin, width]);

  const r = (selectedValue) => rScale(selectedValue);

  const tooltip =
    isBrowser() &&
    d3.select("#tooltipDivLight")
      .style("opacity", 0)


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
          <div>${props.dateSelection}: <b>${readableDate}</b></div>
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
    .tickFormat((d) => `${d}`);

  useEffect(() => {

    //************************************************************
    // ***** Scale Canvas and prep
    // ***********************************************************
    const canvas = mainCanvasRef.current;
    const context = canvas.getContext("2d", { alpha: false });
    const preRenderCanvas = preRenderCanvasRef.current
    const preRenderContext = preRenderCanvas.getContext("2d");
    preRenderContext.scale(pixelRatio, pixelRatio);
    preRenderContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);



    context.scale(pixelRatio, pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.lineWidth = lineWidth;
    context.fillStyle = circleColor;
    preRenderContext.fillStyle = circleColor;
    context.strokeStyle = strokeColor;
    const renderRoughCircle = (cx, cy, diamater, canvasElem ) =>

    new RoughCanvas.RoughCanvas(canvasElem).circle(cx, cy, diamater, {
      roughness: 0.5, move: 0
    });

    const dodgedParticlesOrigin = dodge(
      particles,
      prevDate,
      props.valueSelection,
      xScale(particles, prevDate),
      r,
      padding,
    );

    const dodgedParticlesDestination = dodge(
      particles,
      props.dateSelection,
      props.valueSelection,
      xScale(particles, props.dateSelection),
      r,
      padding,
    );

    const delaunayPoints = (dateString, x, y) =>
    Delaunay.from(dodgedParticlesDestination.map((d) => [d.x, d.y]));


    //************************************************************
    // ***** End Scale Canvas and prep
    // ***********************************************************
    const update = () => {
      const animation = () =>
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
            duration: animationDuration,
            // Documentation: https://greensock.com/docs/v3/Staggers
            onUpdate: animate,
            lazy: true,
            stagger: {
              each: 0.001,
              from: "random",
            },

          },
        );

      animation();




      function animate() {
        preRenderContext.clearRect(0, 0, width, height);
        context.clearRect(0, 0, width, height);

        d3.select(axisRef.current).call(xAxis);
        dodgedParticlesOrigin.map(

          (d) => (
         renderRoughCircle(d.x - margin, height - d.y, d.r * 2, canvas)),
        );
      }
    };

    onscroll = (event) => {
      pointHoverOut();
    };

    const pointHoverIn = (hoverActive) => {
      preRenderContext.clearRect(0, 0, width, height);
      renderRoughCircle(hoverActive.x - margin, height - hoverActive.y, hoverActive.r * 2, preRenderCanvas)
      preRenderContext.fill()
    };

    const pointHoverOut = () => {
      preRenderContext.clearRect(0, 0, width, height);
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

    update();
  }, [props.dateSelection, props.width, props.height]);

  return (
    <div className="canvasStickyChartContainer scrollySwarmContainerDrawing">
      <div id="tooltipDivLight" className="tooltipDiv" />
      <svg className="canvasStickyPointHighlight" width={width} height={height}>
        {/* <ReactRough
          width={width}
          height={height}
          className="canvasStickyPointHighlight"
          renderer="svg"
        >
          <Circle
            renderer="svg"
            r={0}
            className="highlightCircle"
            ref={highlightRef}
          ></Circle>
        </ReactRough> */}
      </svg>
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
        ref={preRenderCanvasRef}
        width={props.width * props.pixelRatio}
        height={props.height * props.pixelRatio}
      />
  {/* <canvas ref={glRef}></canvas> */}
      <svg style={{ top: props.height - 1 }} className="canvasStickyChartAxis">
        <g className="lightModeAxis" ref={axisRef}></g>
      </svg>
    </div>
  );
};

export default ScrollySwarmDrawing;
