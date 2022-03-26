import { Application } from "pixi.js";
import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import { render, Text } from '@inlet/react-pixi';
import * as regl from "regl"




// This is rereendering the entire pixi canvas on every circle update, overwhelming my browsers cpu. This needs to be divided into two functions, one that updates the circle element, and another that initializes the pixi canvas.

//The canvas element shouldn't be re-rendering every time


export const PixiSwarm = (
  targetRef,
  appWidth,
  appHeight,
  background,
  canvasElement
  ) => {
  useEffect(() => {
    const app = new Application({
      width: appWidth,
      height: appHeight,
      color: 'rgb(255,255,255)',
    });
    // On first render add app to DOM
    if (canvasElement != null) {
      targetRef.current.appendChild(app.view);

      const graphics = new PIXI.Graphics();

      // // Start the PixiJS app
      // let graphics = new PIXI.Graphics();
      // app.start();
      // graphics.beginFill(0xDE3249);
      // graphics.drawRect(50, 50, 100, 100);
      // graphics.endFill();
      // // let sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvasElement))

      // // let sprite = new PIXI.Sprite(PIXI.Texture.from(canvasElement));

      // graphics.beginFill();
      // graphics.drawCircle(100, 100, 100);
      // graphics.endFill();
      // // sprite.addChild(graphics);
      // // sprite.mask = graphics;

      // app.stage.addChild(graphics);
    }
    return () => {
      render(<Text text="Hello World" x={200} y={200} />, app.stage);

      // On unload stop the application
      app.stop();
    };
  }, []);
};

// Rectangle
