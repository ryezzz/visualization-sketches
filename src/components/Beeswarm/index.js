import React from "react";
import { useEffect, useRef } from "react";
import { Delaunay } from "d3-delaunay";

const Veroni = (props) => {
  let height = props.height;
  let width = props.width;
  let stroke = 5;
  let particles = props.particles;
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");
    function update() {
      let hsla = props.hsla;
      const delaunay = Delaunay.from(particles);
      const voronoi = delaunay.voronoi([0, 0, width - 0, height - 0]);
      context.clearRect(0, 0, width, height);
      context.beginPath();
      delaunay.render(context);
      context.strokeStyle = hsla;
      context.lineWidth = 0;
      context.stroke();
      context.lineWidth = 0;
      context.lineCap = "round";
      context.beginPath();
      voronoi.render(context);
      voronoi.renderBounds(context);
      context.strokeStyle = hsla;
      context.stroke();
      context.beginPath();
      delaunay.renderPoints(context);
      context.fill();

    }

     context.canvas.ontouchmove = context.canvas.onmousemove = (event) => {
      event.preventDefault();
      console.log(context)
      // particles[0] = [event.layerX, event.layerY];
      update();
    };

    update();
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
