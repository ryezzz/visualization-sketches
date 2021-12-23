// To fix canvas blurryness I used this: https://stackoverflow.com/questions/48961797/canvas-circle-looks-blurry
import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import React, { useState } from "react";
import { easeCubicInOut } from "d3-ease";
import { gsap } from "gsap";
import { toArray } from "gsap/all";
import { FastLayer } from "react-konva";
import { Axis, axisPropsFromTickScale, LEFT } from "react-d3-axis";
import { date } from "faker/lib/locales/vi";

const checkForUndefined=(windowsize, defaultValue)=> windowsize === undefined ? defaultValue : windowsize
export const isBrowser = () => typeof window !== "undefined"


const pixelRatio = typeof window !== "undefined" ? window.devicePixelRatio : 1;


const Veroni = (props) => {
  const destinationParticles = [];
  const originParticles = [];
  let height = props.height;
  let width = props.width;
  let margin = props.margin;
  let marginLeft = props.marginLeft;
  let marginTop = props.marginTop;
  let particles = props.particles;
  let ref = useRef();
  let pointRef = useRef();
  let highlightRef = useRef();
  let axisRef = useRef();
  const radius = 8;

  const usePrevious = (value, defaultRef) => {
    const ref = useRef(defaultRef);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevDate = usePrevious(props.dateSelection, "year");

  let xScale = (dateElem, dateSelection) =>
    d3
      .scaleLinear()
      .domain(d3.extent(particles, (d) => d[dateSelection]))
      .range([marginLeft, width - margin]);

  let xScaleFaster = d3
    .scaleLinear()
    .domain(d3.extent(particles, (d) => d[props.dateSelection]))
    .range([margin, width - margin]);

  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(particles, (d) => d[props.valueSelection]))
    .range([height - margin, marginTop])
    .nice();

  const animatedParticles = () =>
    props.particles.map((d) => {
      destinationParticles.push({
        x: xScale(d[props.dateSelection], props.dateSelection)(
          d[props.dateSelection],
          props.dateSelection
        ),
        y: yScale(d[props.valueSelection]),
        id: d.id,
      });
      originParticles.push({
        x: xScale(d[prevDate], prevDate)(d[prevDate], prevDate),
        y: yScale(d[props.valueSelection]),
        id: d.id,
      });
    });

  const tooltip = d3
    .select("#tooltipDiv")
    .style("background-color", "white")
    .style("border", "1px solid")
    .style("border-radius", "2px")
    .style(
      "box-shadow",
      "0 3px 6px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.4)"
    )
    .style("opacity", 1)
    .style("padding", "10px");

  function showTooltip(tooltipX, tooltipY, tooltipZ, xScalei, yScalei) {
    tooltip
      .style("opacity", 0.7)
      .style("display", "block")

      .style("top", yScalei + "px")
      .style("left", xScalei + 15 + "px")
      .style("z-index", 5)
      .html(
        `<div>word_count: <b>${tooltipY}</b></div><div>${props.dateSelection}: <b>${tooltipX}</b></div>  <div></div>`
      );
  }

  const delaunay = (dateString, x, y) =>
    Delaunay.from(
      particles.map((d) => [
        xScale(d[props.dateSelection], props.dateSelection)(
          d[props.dateSelection],
          props.dateSelection
        ),
        yScale(d[props.valueSelection]),
      ])
    );

  const xAxisScale = d3
    .scaleSequential()
    .domain(d3.extent(particles, (d) => d[props.dateSelection]))
    .range([marginLeft, width - margin]);

  const xAxis = d3
    .axisBottom(xAxisScale)
    .ticks(5)
    .tickFormat((d) => `${d}`);

  d3.select(axisRef.current).call(xAxis);

  animatedParticles();

  useEffect(() => {
    // SCALE CANVAS
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    context.scale(pixelRatio, pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.globalAlpha = 0.5;
    // END SCALE CANVAS

    const update = (hoverActive = false) => {
      hideTooltip();

      context.clearRect(0, 0, width, height);

      // Animate
      gsap.fromTo(
        originParticles,
        {
          x: (index) => originParticles[index].x,
          y: (index) => originParticles[index].y,
        },
        {
          x: (index) => destinationParticles[index].x,
          y: (index) => destinationParticles[index].y,
          ease: "power.3.out",
          duration: 0.3,
          onUpdate: animate,
        }
      );

      function animate() {
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.fillStyle = "rgb(226, 99, 255)";
        originParticles.map(
          (d, i) => (
            context.beginPath(),
            context.arc(d.x, d.y, radius, 0, 2 * Math.PI),
            context.fill()
          )
        );
      }
    };

    onscroll = (event) => {
      hideTooltip();
      pointHoverOut();
    };

    const pointHoverIn = (hoverActive) => {
      let xSelection = xScale(
        hoverActive[props.dateSelection],
        props.dateSelection
      )(hoverActive[props.dateSelection], props.dateSelection);
      let ySelection = yScale(
        hoverActive[props.valueSelection],
        props.valueSelection
      );
      d3.select(highlightRef.current)
        .attr("r", radius)
        .attr("cx", xSelection)
        .attr("cy", ySelection)
        .attr("fill", "rgba(255,255,255,.3)")
        .attr("stroke", "rgba(255,255,255, 1)");
    };

    const pointHoverOut = () => {
      d3.select(highlightRef.current).attr("r", 0);
    };

    function hideTooltip(hoverInactive) {
      tooltip.style("display", "none");
    }

    onmousemove = (event) => {
      // event.preventDefault();
      const pageYoffset = typeof window !== "undefined" ? window.pageYOffset : 0
      let mousePoint = d3.pointer(event, this);
      let x = mousePoint[0];
      let y = mousePoint[1] - [pageYoffset];
      let heightCond = x < width;
      let index = delaunay(props.dateSelection).find(x, y);
      let indexObj = particles[index];
      let tooltipX = indexObj[props.dateSelection];
      let tooltipY = indexObj[props.valueSelection];
      let tooltipZ = indexObj[props.valueSelection];

      heightCond
        ? showTooltip(
            tooltipX,
            tooltipY,
            tooltipZ,
            xScale(tooltipX, props.dateSelection)(
              tooltipX,
              props.dateSelection
            ),
            yScale(tooltipY)
          )
        : hideTooltip(indexObj);

      heightCond ? pointHoverIn(indexObj) : pointHoverOut(indexObj);
    };

    update();
  }, [props.dateSelection, props.width]);

  return (
    <div className="canvasStickyChartContainer">


      <div
        id="tooltipDiv"
        className="tooltipDiv"
      />

      <svg className="canvasStickyPointHighlight" width={width} height={height}>
        <circle
          r={0}
          className="highlightCircle"
          ref={highlightRef}
        ></circle>
      </svg>

      <canvas
        className={"canvasStickyChart"}
        style={{
          width: props.width  + "px",
          height: props.height + "px",
        }}
        ref={ref}
        particles={props.particles}
        stroke={props.stroke}
        width={props.width * pixelRatio}
        height={props.height * pixelRatio}
        useScrollData={props.useScrollData}
        dateSelection={props.dateSelection}
        valueSelection={props.valueSelection}
        margin={props.margin}
      />
      <svg className="canvasStickyChartAxis">
        <g className="darkModeAxis" ref={axisRef}></g>
      </svg>
    </div>
  );
};

export default Veroni;