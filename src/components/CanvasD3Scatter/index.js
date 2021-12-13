// To fix canvas blurryness I used this: https://stackoverflow.com/questions/48961797/canvas-circle-looks-blurry
import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import React, { useState } from "react";
import { easeCubicInOut } from "d3-ease";
import { gsap } from "gsap";

const pixelRatio = window.devicePixelRatio;

const Veroni = (props) => {
  let height = props.height;
  let width = props.width;
  let particles = props.particles;
  let ref = useRef();
  let prevDataRef = useRef();

  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(particles, (d) => d[props.dateSelection]))
    .range([0, width])
    .nice();

  let yScale = d3
    .scaleTime()
    .domain(d3.extent(particles, (d) => d[props.valueSelection]))
    .range([height, 0])
    .nice();

  const tooltip = d3
    .select("body")
    .append("div")
    .style("background-color", "white")
    .style("border", "1px solid")
    .style("border-radius", "2px")
    .style(
      "box-shadow",
      "0 3px 6px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.4)"
    )
    .style("opacity", 0)
    .style("padding", "10px")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("z-index", 100)
    .style("max-width", "200px");

  function showTooltip(event, tooltipX, tooltipY, tooltipZ, xScalei, yScalei) {
    tooltip
      .style("opacity", 0.8)
      .style("top", yScalei + window.pageYOffset + 10 + "px")
      .style("left", xScalei + 10 + "px")
      .style("z-index", 1)
      .html(
        `<div>word_count: <b>${tooltipY}</b></div><div>${props.dateSelection}: <b>${tooltipX}</b></div>  <div></div>`
      );
  }

  function hideTooltip() {
    tooltip.style("opacity", 0).style("z-index", -100);
  }

  const usePrevious = (value) => {
    const ref = useRef("year");
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  let prevDate = usePrevious(props.dateSelection);

  const delaunay = (dateString, x, y) =>
    Delaunay.from(
      particles.map((d, i) => [
        xScale(d[props.dateSelection]),
        yScale(d[props.valueSelection]),
      ])
    );

  // let fakeArr = [1, 2, 3];
  // let gsapTest =
  //   // particles.map((d,i) => {
  //   gsap.to(fakeArr, {
  //     duration: 1,
  //     ease: 5,
  //     delay: 0.06,
  //   });
  // // })
  const destinationParticles = [];
  const originParticles = [];

  const mappedParicles = () =>
    particles.map((d) => {
      destinationParticles.push({
        x: xScale(d[props.dateSelection]),
        y: yScale(d[props.valueSelection]),
      });
      originParticles.push({
        x: xScale(d[prevDate]),
        y: yScale(d[props.valueSelection]),
      });
    });

  mappedParicles();

  useEffect(() => {
    // SCALE CANVAS
    const canvas = ref.current;
    const context = canvas.getContext("2d", { alpha: true });
    const pixelRatioinner = window.devicePixelRatio;
    const hoverRadius = 10;
    const radius = 4;

    context.scale(pixelRatioinner, pixelRatioinner);
    context.setTransform(pixelRatioinner, 0, 0, pixelRatioinner, 0, 0);
    // END SCALE CANVAS

    const update = (hoverActive = false, column = 1) => {
      console.log("updated");
      context.clearRect(0, 0, width, height);
      context.beginPath();
      delaunay(props.dateSelection).renderPoints(context, radius);
      context.fill();

      console.log("MAPPED PARTICLES", delaunay(props.dateSelection), originParticles, destinationParticles)

      // let gsapTest = gsap.to(originParticles, {
      //   x: (index, target, targets) => destinationParticles[index].x,
      //   y: (index, target, targets) => destinationParticles[index].y,
      //   duration: 0.5,
      //   ease: 'power.3.out',
      //   stagger: { amount: 10 },
      //   onUpdate: animate
      // });

      // console.log("GSAP TEST", gsapTest, delaunay(prevDate)._delaunator);

      // function animate() {

      //   for (const [_cx, _cy ] of delaunay(prevDate)._delaunator) {
      //     context.beginPath()
      //     context.arc(
      //       _cx,
      //       _cy,
      //       hoverRadius,
      //       0,
      //       2 * Math.PI
      //     );
      //     context.fill()

      //   }
      // }

      // console.log(context);

      hoverActive && context.beginPath();
      hoverActive &&
        context.arc(
          xScale(hoverActive[props.dateSelection]),
          yScale(hoverActive[props.valueSelection]),
          hoverRadius,
          0,
          2 * Math.PI
        );
      hoverActive && context.fill();
    };

    onscroll = (event) => {
      hideTooltip();
    };
    onmousemove = (event) => {
      event.preventDefault();
      hideTooltip();

      let mousePoint = d3.pointer(event, this);
      let x = mousePoint[0];
      let y = mousePoint[1] - window.pageYOffset;
      let heightCond = x < width;
      let index = delaunay(props.dateSelection).find(x, y);
      let tooltipX = particles[index][props.dateSelection];
      let tooltipY = particles[index][props.valueSelection];
      let tooltipZ = particles[index][props.valueSelection];

      heightCond
        ? showTooltip(
            event,
            tooltipX,
            tooltipY,
            tooltipZ,
            xScale(tooltipX),
            yScale(tooltipY)
          )
        : hideTooltip();
      heightCond && update(particles[index]);
      context.restore();
    };

    update();
  }, [props.dateSelection]);

  return (
    <canvas
      style={{
        backgroundColor: "white",
        width: props.width + "px",
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
    />
  );
};

const VeroniBackground = (props) => {
  return (
    <div>
      <Veroni
        particles={props.particles}
        stroke={props.stroke}
        n={props.n}
        hsla={props.hsla}
        width={props.width}
        height={props.height}
        useScrollData={props.useScrollData}
        dateSelection={props.dateSelection}
        valueSelection={props.valueSelection}
      />
    </div>
  );
};

export default VeroniBackground;

