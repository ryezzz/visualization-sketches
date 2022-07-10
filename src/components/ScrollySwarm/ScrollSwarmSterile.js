// To fix canvas blurryness I used this: https://stackoverflow.com/questions/48961797/canvas-circle-looks-blurry
import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import React from "react";
import { gsap } from "gsap";
import { isBrowser } from "../../utils/staticRendering";
import { dodge } from "../../utils/visualizationUtils";

const ScrollySwarmSterile = (props) => {
  const pixelRatio = props.pixelRatio;
  let height = props.height;
  let width = props.width;
  let margin = props.margin;
  let marginLeft = props.marginLeft;
  let marginTop = props.marginTop;
  let particles = props.particles;
  let ref = useRef();
  let highlightRef = useRef();
  let axisRef = useRef();
  let circleColor = "rgba(0,0,255,.7)";
  let circleHighlightColor = "rgb(255,255,255)";
  let strokeColor = "rgba(0,0,0,0)";
  let globalOpacity = 1;
  let animationDuration = 1;
  let lineWidth = 1.4;
  let padding = lineWidth;

  ////MOVE TO HOOKS
  const usePrevious = (value, defaultRef) => {
    const ref = useRef(defaultRef);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevDate = usePrevious(props.dateSelection, "");

  let rScale = d3
    .scaleLinear()
    .domain(d3.extent(particles, (d) => d[props.valueSelection]))
    .range([1, height / 80]);

  let x = (incomingData, prevOrCurrent) =>
    d3
      .scaleSequential()
      .domain(d3.extent(particles, (d) => d[prevOrCurrent]))
      .range([marginLeft, width - 0]);

  let r = (selectedValue) => rScale(selectedValue);

  const dodgedParticlesOrigin = dodge(
    particles,
    prevDate,
    props.valueSelection,
    x(particles, prevDate),
    r,
    padding
  );
  const dodgedParticlesDestination = dodge(
    particles,
    props.dateSelection,
    props.valueSelection,
    x(particles, props.dateSelection),
    r,
    padding
  );

  const tooltip =
    isBrowser() &&
    d3
      .select("#tooltipDiv")
      .style("background-color", "white")
      .style("border-radius", "2px")
      .style(
        "box-shadow",
        "0 3px 6px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.4)"
      )
      .style("opacity", 0)
      .style("padding", "5px")
      .style("z-index", 1000000);

  function showTooltip(
    tooltipX,
    tooltipY,
    readableValue,
    readableDate,
    readableFullDate
  ) {
    isBrowser() &&
      tooltip
        .style("opacity", 0.7)
        .style("display", "block")
        .style("top", tooltipY + "px")
        .style("left", tooltipX + 30 - margin + "px")
        .style("z-index", 500000)
        .html(
          `<div class ="swarmTooltipText">
          <div>words written: <b>${readableValue}</b></div>
          <div>${props.dateSelection}: <b>${readableDate}</b></div>
          <div><b>${readableFullDate}</b></div>
          </div>`
        );
  }

  const delaunay2 = (dateString, x, y) =>
    Delaunay.from(dodgedParticlesDestination.map((d) => [d.x, d.y]));

  const xAxisScale = d3
    .scaleSequential()
    .domain(d3.extent(particles, (d) => d[props.dateSelection]))
    .range([margin, width - margin]);

  const xAxis = d3
    .axisBottom(xAxisScale)
    .ticks(5)
    .tickFormat((d) => `${d}`);

  useEffect(() => {
    //************************************************************
    // ***** Scale Canvas and prep
    // ***********************************************************
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    context.scale(pixelRatio, pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.globalAlpha = globalOpacity;
    context.lineWidth = lineWidth;
    context.fillStyle = circleColor;

    //************************************************************
    // ***** End Scale Canvas and prep
    // ***********************************************************

    const update = () => {
      // context.fillStyle = "rgb(226, 99, 255)";
      // context.fillStyle = "rgb(65, 82, 158, 0.2)";

      context.strokeStyle = strokeColor;

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
            // ease: "power.3.out",
            duration: animationDuration,

            // Documentation: https://greensock.com/docs/v3/Staggers
            ease: "strong.inOut",
            // runBackwards: true,
            onUpdate: animate,

            stagger: {
              each: 0.0005,
              from: "random",
            },
          }
        );

      animation();

      function animate() {
        context.restore();

        context.clearRect(0, 0, width, height);

        d3.select(axisRef.current).call(xAxis).transition();
        context.beginPath();
        dodgedParticlesOrigin.map(
          (d, i) => (
            context.beginPath(),
            context.arc(d.x - margin, height - d.y, d.r, 0, 2 * Math.PI),
            context.stroke(),
            context.fill()
          )
        );
      }
    };

    onscroll = (event) => {
      pointHoverOut();
    };

    const pointHoverIn = (hoverActive) => {
      let xSelection = hoverActive.x - margin;

      let ySelection = hoverActive.y;

      d3.select(highlightRef.current)
        .attr("r", hoverActive.r + 1)
        .attr("cx", xSelection)
        .attr("cy", height - ySelection)
        .attr("fill", circleHighlightColor)
        .attr("stroke", circleColor);
    };

    const pointHoverOut = () => {
      d3.select(highlightRef.current).attr("r", 0);
    };

    function hideTooltip(hoverInactive) {
      isBrowser && tooltip.style("display", "none");
      isBrowser && tooltip.style("opacity", "0");
    }

    onmousemove = (event) => {
      event.preventDefault();
      const pageYoffset = window.pageYOffset;
      let mousePoint = d3.pointer(event, this);
      let xi = mousePoint[0] + margin;
      let y = height - mousePoint[1] + pageYoffset;
      let heightCond = xi < width + margin;
      let index = delaunay2(props.dateSelection).find(xi, y);
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
  }, [props.dateSelection, props.width, props.height, props.pixelRatio]);

  return (
    <div className="canvasStickyChartContainer scrollySwarmContainerSterile">
      <div id="tooltipDiv" className="tooltipDiv" />

      <svg className="canvasStickyPointHighlight" width={width} height={height}>
        <circle r={0} className="highlightCircle" ref={highlightRef}></circle>
      </svg>
      <canvas
        className={"canvasStickyChart"}
        style={{
          width: props.width + "px",
          height: props.height + "px",
        }}
        ref={ref}
        particles={props.particles}
        stroke={props.stroke}
        width={props.width * props.pixelRatio}
        height={props.height * props.pixelRatio}
        useScrollData={props.useScrollData}
        dateSelection={props.dateSelection}
        valueSelection={props.valueSelection}
        margin={props.margin}
      />
      <svg style={{ top: props.height - 1 }} className="canvasStickyChartAxis">
        <g className="lightModeAxis" ref={axisRef}></g>
      </svg>
    </div>
  );
};

export default ScrollySwarmSterile;
