import { Vec3, Vec4 } from "regl";
import { Plot } from "../../plot";
import { OrthogonalPlane, Points } from "../../primitives";
import { Axis, Drawable } from "../../types";
import { CameraOptions } from "../../camera";

type ScatterPlot3DOptions = {
  color?: Vec4;
  backgroundColor?: Vec4;
  axes?: {
    x: Axis;
    y: Axis;
    z: Axis;
  };
  showPlanes?: {
    xy?: boolean;
    xz?: boolean;
    yz?: boolean;
  };
  cameraOptions?: Partial<CameraOptions>;
};

export class ScatterPlot3D {
  private plot: Plot;
  private points: Points;

  constructor(
    canvas: HTMLCanvasElement,
    data: Vec3[],
    options: ScatterPlot3DOptions,
  ) {
    this.plot = new Plot(canvas, options);
    this.points = new Points(
      this.plot,
      { pointSize: 5 },
      {
        points: data,
        color: options.color,
      },
    );

    const { x, y, z } = options.axes ?? {
      x: {
        domain: [0, 10],
        step: 1,
      },
      y: {
        domain: [0, 10],
        step: 1,
      },
      z: {
        domain: [0, 10],
        step: 1,
      },
    };

    const showPlanes = options.showPlanes ?? {
      xy: true,
      xz: true,
      yz: true,
    };

    const objects: Drawable[] = [this.points];
    if (showPlanes.xy) {
      objects.push(
        new OrthogonalPlane(this.plot, {
          orientation: "xy",
          axes: [x, y],
        }),
      );
    }
    if (showPlanes.xz) {
      objects.push(
        new OrthogonalPlane(this.plot, {
          orientation: "xz",
          axes: [x, z],
        }),
      );
    }
    if (showPlanes.yz) {
      objects.push(
        new OrthogonalPlane(this.plot, {
          orientation: "yz",
          axes: [y, z],
        }),
      );
    }

    this.plot.with(objects).withCamera(options.cameraOptions);
  }

  public draw() {
    this.plot.draw();
  }

  public frame() {
    this.plot.frame();
  }

  public updateData(data: Vec3[]) {
    this.points.updateData(data);
  }

  public destroy() {
    this.plot.destroy();
  }
}
