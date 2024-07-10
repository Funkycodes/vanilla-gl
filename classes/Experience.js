import Shader from "./classes/Shader.js";
import { resizeCanvasToDisplaySize } from "./lib/gl.js";

class Experience {
  constructor () {
    this.canvas = document.querySelector("canvas");
    this.gl = this.canvas.getContext("webgl");
    this.crS();
  }
  init() {
    this.crS();
  }
  async crS() {
    const shader = new Shader({
      gl: this.gl,
      fragment: "./shaders/fragment.frag",
      vertex: "./shaders/vertex.frag",
      attributes: {
        a_position: { type: "2f" }
      },
      uniforms: {
        u_matrix: {
          type: "Matrix3f"
        }
      }
    });
  }
  render() {
    resizeCanvasToDisplaySize(this.canvas) && this.onResize();
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }
  onResize() {}
}

new Experience();