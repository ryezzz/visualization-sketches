import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import {
  csv, setData
} from "d3";

export const useResizeObserver = (ref) => {
return{
  "x": 0,
  "y": 0,
  "width": window.innerWidth,
  "height": window.innerHeight,
  "top": 0,
  "right": 0,
  "bottom": 0,
  "left": 0
}
}

export const importCSVData = (path) => {
  csv(path).then((d) => {
    return(d)
  });
}
