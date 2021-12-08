import React from "react";
import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";
import { tooltipContext } from "../Scatterplot/useTooltip";

const Veroni = (props) => {
  let height = props.height;
  let width = props.width;
  let stroke = 5;
  let particles = props.particles;
  let margin = 1;

  let ref = useRef();

  let xScale = d3
    .scaleLinear()
    .domain(d3.extent(particles, (d) => d[0]))
    .range([0, width])
    .nice();

  let yScale = d3
    .scaleTime()
    .domain(d3.extent(particles, (d) => d[1]))
    .range([height, 0])
    .nice();

  const delaunay = Delaunay.from(
    particles.map((d) => [xScale(d[0]), yScale(d[1])])
  );

  const tooltip = d3
  .select('body')
  .append('div')
  .style('background-color', 'white')
  .style('border', '1px solid')
  .style('border-radius', '2px')
  .style(
    'box-shadow',
    '0 3px 6px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.4)'
  )
  .style('opacity', 0)
  .style('padding', '10px')
  .style('position', 'absolute')
  .style('pointer-events', 'none')
  .style('z-index', 100)


  function showTooltip(event, tooltipX, tooltipY, tooltipZ, xScalei, yScalei) {
    console.log("DEBUGGING Y", xScalei, yScalei/2)
    tooltip
      .style('opacity', 0.8)
      .style('top', yScalei + height/3.2+ 'px')
      .style('left', xScalei + 10 + 'px')
      .style('z-index', 1)
      .html(`<div>${tooltipX}</div> <div>${tooltipY}</div> <div>${tooltipZ}</div>`);
  }


  function hideTooltip() {
    tooltip
      .style('opacity', 0)
      .style('z-index', -1);
  }


  useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");
    function update(hoverActive=false) {

      let hsla = props.hsla;
      const voronoi = delaunay.voronoi([0, 0, width - 0, height - 0]);
      context.clearRect(0, 0, width, height);
      context.beginPath();
      delaunay.render(context);
      context.strokeStyle = hsla;
      context.lineWidth = 2;
      context.lineWidth = 0;
      context.lineCap = "round";
      particles.map((d) => {
        context.beginPath();
        context.arc(xScale(d[0]), yScale(d[1]), 5, 0, 2 * Math.PI);
      });

      hoverActive && context.beginPath();
      let radius=10
      hoverActive && context.arc(xScale(hoverActive[0]), yScale(hoverActive[1]), radius, 0, 2 * Math.PI);
      hoverActive && context.fill()

      voronoi.render(context);
      voronoi.renderBounds(context, 2);
      context.strokeStyle = hsla;
      // context.stroke();
      context.beginPath();
      delaunay.renderPoints(context);

      context.fill();
    }

    onmousemove = (event) => {
      event.preventDefault();
      const voronoi = delaunay.voronoi([0, 0, width - 0, height - 0]);


      const mousePoint = d3.pointer(event, this);

      const x = mousePoint[0];
      const y = mousePoint[1] - height/2;

      const index = delaunay.find(x, y);

      console.log("FINDING POINT", index)

      // console.log("ARC", arc)

      const tooltipX=particles[index][0]
      const tooltipY=particles[index][1]
      const tooltipZ=particles[index][2]

      // const tooltipY=particles[index][1]

      // context.clearRect(0, 0, width, height);




      context.setLineDash([2, 3]);
      context.lineWidth = 0.5;
      context.beginPath();
      context.arc(x, y, 50, 0, 2 * Math.PI);
      showTooltip(event, tooltipX, tooltipY, tooltipZ, xScale(tooltipX), yScale(tooltipY));

      console.log(particles[index])
       update(particles[index]);
    };

    update();
    context.restore();
  });

  return (
    <canvas
      ref={ref}
      particles={props.particles}
      stroke={props.stroke}
      n={props.n}
      width={props.width}
      height={props.height}
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
      />
    </div>
  );
};

export default VeroniBackground;
