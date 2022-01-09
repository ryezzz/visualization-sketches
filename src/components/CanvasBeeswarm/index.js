// import React from "react";
// import { useEffect, useRef } from "react";
// import { Delaunay } from "d3-delaunay";
// import * as d3 from "d3";
// import Plot from "plot"

// function beeswarm(
//   data = [-0.7440685491587817, 0.04325263102950569],
//   { gap = 1, ticks = 50, dynamic, direction, ...options }
// ) {
//   const dots = Plot.dot(data, options);
//   const { render } = dots;

//   dots.render = function () {
//     const g = render.apply(this, arguments);
//     const circles = d3.select(g).selectAll("circle");

//     const nodes = [];
//     const [cx, cy, x, y, forceX, forceY] =
//       direction === "x"
//         ? ["cx", "cy", "x", "y", d3.forceX, d3.forceY]
//         : ["cy", "cx", "y", "x", d3.forceY, d3.forceX];
//     for (const c of circles) {
//       const node = {
//         x: +c.getAttribute(cx),
//         y: +c.getAttribute(cy),
//         r: +c.getAttribute("r")
//       };
//       nodes.push(node);
//     }
//     const force = d3
//       .forceSimulation(nodes)
//       .force("x", forceX((d) => d[x]).strength(0.8))
//       .force("y", forceY((d) => d[y]).strength(0.05))
//       .force(
//         "collide",
//         d3
//           .forceCollide()
//           .radius((d) => d.r + gap)
//           .iterations(3)
//       )
//       .tick(ticks)
//       .stop();
//     update();
//     if (dynamic) force.on("tick", update).restart();
//     return g;

//     function update() {
//       circles.attr(cx, (_, i) => nodes[i].x).attr(cy, (_, i) => nodes[i].y);
//     }
//   };

//   return dots;
// }

// export default beeswarm
