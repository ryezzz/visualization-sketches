// To fix canvas blurryness I used this: https://stackoverflow.com/questions/48961797/canvas-circle-looks-blurry
import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import { useScrollData } from "scroll-data-hook";
import React, { useState } from "react";

const pixelRatio = window.devicePixelRatio;

const Veroni = (props) => {

  let height = props.height;

  let width = props.width;

  let particles = props.particles;

  let ref = useRef();

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

  const delaunay = Delaunay.from(
    particles.map((d) => [
      xScale(d[props.dateSelection]),
      yScale(d[props.valueSelection]),
    ])
  );

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
    .style("z-index", 100);

  function showTooltip(event, tooltipX, tooltipY, tooltipZ, xScalei, yScalei) {
    tooltip
      .style("opacity", 0.8)
      .style("top", yScalei + "px")
      .style("left", xScalei + 10 + "px")
      .style("z-index", 1)
      .html(
        `<div>${tooltipX}</div> <div>${tooltipY}</div> <div>${tooltipZ}</div>`
      );
  }

  function hideTooltip() {
    tooltip.style("opacity", 0).style("z-index", -1);
  }





  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d", { alpha: true })
    const pixelRatioinner = window.devicePixelRatio;
    context.scale(pixelRatioinner, pixelRatioinner);
    context.setTransform(pixelRatioinner, 0, 0, pixelRatioinner, 0, 0);
    const update = (hoverActive = false, column = 1) => {
      let hsla = props.hsla;
      let voronoi = delaunay.voronoi([0, 0, width - 0, height - 0]);
      context.clearRect(0, 0, width, height);
      context.beginPath();
      delaunay.render(context);
      context.strokeStyle = hsla;
      context.lineWidth = 2;
      context.lineWidth = 0;
      context.lineCap = "round";
      particles.map((d) => {
        context.beginPath();
        context.arc(
          xScale(d[props.dateSelection]),
          yScale(d[props.valueSelection]),
          5,
          0,
          2 * Math.PI
        );
      });
      hoverActive && context.beginPath();
      let radius = 10;
      hoverActive &&
        context.arc(
          xScale(hoverActive[props.dateSelection]),
          yScale(hoverActive[props.valueSelection]),
          radius,
          0,
          2 * Math.PI
        );
      hoverActive && context.fill();
      voronoi.render(context);
      voronoi.renderBounds(context, 2);
      // context.stroke();
      context.rotate((3 * Math.PI) / 180);

      context.strokeStyle = hsla;
      context.beginPath();
      delaunay.renderPoints(context);
      context.fill();
    };

    onmousemove = (event) => {
      event.preventDefault();
      let mousePoint = d3.pointer(event, this);
      let x = mousePoint[0];
      let y = mousePoint[1];
      let heightCond = y < height && x < width;
      let index = delaunay.find(x, y);
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
    context.restore();
  }, [props.dateSelection]);

  return (
    <canvas
      style={{
        backgroundColor: "white",
        position: "fixed",
        zIndex: 10000,
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
