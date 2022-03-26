export const dodge = (data, selectedDateI, selectedValueI, xScaleI, rScaleI, paddingI, preRenderFun=false) => {
  const circles = data
    .map((d) => ({ x: xScaleI(d[selectedDateI]), r: rScaleI(d[selectedValueI]), data: d }))
    .sort((b, a) => b.data.formatted_date - a.data.formatted_date);

  const epsilon = 1e-3;
  let head = null,
    tail = null,
    queue = null;

  //   // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
  function intersects(x, y, r) {
    let a = head;
    while (a) {
      const radius2 = (a.r + r + paddingI) ** 2;
      if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
        return true;
      }
      a = a.next;
    }
    return false;
  }

  //   // Place each circle sequentially.
  for (const b of circles) {

    //     // Choose the minimum non-intersecting tangent.
    if (intersects(b.x, (b.y = b.r ), b.r)) {
      let a = head;
      b.y = Infinity;
      do {
        let y =
          a.y + Math.sqrt((a.r + b.r + paddingI) ** 2 - (a.x - b.x) ** 2);
        if (y < b.y && !intersects(b.x, y, b.r)) b.y = y;
        a = a.next;
      } while (a);
    }

    //     // Add b to the queue.
    b.next = null;
    if (head === null) {
      head = tail = b;
      queue = head;
    } else tail = tail.next = b;

    // console.log("Dodge Undefined:", selectedDateI, selectedValueI, b.x)

    // if (preRenderFun) {b.preRendered=preRenderFun(b.x, b.y,b.r)}
  }

  return circles;
};



export const dodgeMap = (data, selectedDateI, selectedValueI, xScaleI, rScaleI, paddingI, externalMap) => {
  // const M = new Map(dodgedParticlesMap.map(d => [[d.x, d.y], d.r]));
  data.sort((b, a) => b.formatted_date - a.formatted_date)
  const circles = data.map((d) => ({ x: xScaleI(d[selectedDateI]), r: rScaleI(d[selectedValueI]), data: d }))

  const M = new Map(data.sort((b, a) => b.formatted_date - a.formatted_date).map(d => [d.id, [xScaleI(d[selectedDateI]), d.y, rScaleI(d[selectedValueI])]]));

  const epsilon = 1e-3;
  let head = null,
    tail = null,
    queue = null;

  //   // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
  function intersects(x, y, r) {
    let a = head;
    while (a) {
      const radius2 = (a.r + r + paddingI) ** 2;
      if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
        return true;
      }
      a = a.next;
    }
    return false;
  }

  //   // Place each circle sequentially.
  for (const b of circles) {

    //     // Choose the minimum non-intersecting tangent.
    if (intersects(b.x, (b.y = b.r ), b.r)) {
      let a = head;
      b.y = Infinity;
      do {
        let y =
          a.y + Math.sqrt((a.r + b.r + paddingI) ** 2 - (a.x - b.x) ** 2);
        if (y < b.y && !intersects(b.x, y, b.r)) b.y = y;
        a = a.next;
      } while (a);
    }

    //     // Add b to the queue.
    b.next = null;
    if (head === null) {
      head = tail = b;
      queue = head;
    } else tail = tail.next = b;

    // console.log("Dodge Undefined:", selectedDateI, selectedValueI, b.x)

    // if (preRenderFun) {b.preRendered=preRenderFun(b.x, b.y,b.r)}
  }


  return M;
};




// export const dodgeMap = (data, selectedDateI, selectedValueI, xScaleI, rScaleI, paddingI, preRenderFun=false) => {
//   // const M = new Map(dodgedParticlesMap.map(d => [[d.x, d.y], d.r]));

//   const circles = data.sort((b, a) => b.formatted_date - a.formatted_date)
//     .map((d) => ({ x: xScaleI(d[selectedDateI]), r: rScaleI(d[selectedValueI]), data: d }))

//   const M = new Map(data.sort((b, a) => b.formatted_date - a.formatted_date).map(d => [d.id, [xScaleI(d[selectedDateI]), d.y, rScaleI(d[selectedValueI])]]));

//   const epsilon = 1e-3;
//   let head = null,
//     tail = null,
//     queue = null;

//   //   // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
//   function intersects(x, y, r) {
//     let a = head;
//     while (a) {
//       const radius2 = (a.r + r + paddingI) ** 2;
//       if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
//         return true;
//       }
//       a = a.next;
//     }
//     return false;
//   }

//   //   // Place each circle sequentially.
//   for (const b of circles) {

//     //     // Choose the minimum non-intersecting tangent.
//     if (intersects(b.x, (b.y = b.r ), b.r)) {
//       let a = head;
//       b.y = Infinity;
//       do {
//         let y =
//           a.y + Math.sqrt((a.r + b.r + paddingI) ** 2 - (a.x - b.x) ** 2);
//         if (y < b.y && !intersects(b.x, y, b.r)) b.y = y;
//         a = a.next;
//       } while (a);
//     }

//     //     // Add b to the queue.
//     b.next = null;
//     if (head === null) {
//       head = tail = b;
//       queue = head;
//     } else tail = tail.next = b;

//     // console.log("Dodge Undefined:", selectedDateI, selectedValueI, b.x)

//     // if (preRenderFun) {b.preRendered=preRenderFun(b.x, b.y,b.r)}
//   }


//   return M;
// };


