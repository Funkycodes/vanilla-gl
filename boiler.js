// import { createProgram, createShader } from "./utils.js";

// const vertexShaderSource = `
//   attribute vec2 a_position;
  
//   uniform vec2 u_resolution;

//   void main() {
//     // convert pixels to 0 to 1;
//     vec2 zeroToOne = a_position / u_resolution;
//     // scale by a factor of two
//     vec2 oneToTwo = zeroToOne * 2;
//     // convert to clipSpace
//     vec2 clipSpace = oneToTwo - 1;

//     gl_Position = vec4(clipSpace, 0, 1.);
//   }
// `;
// const fragmentShaderSource = `
//   precision mediump float;

//   void main() {
//     gl_FragColor = vec4(1, 0, 0, 1);
//   }
// `;
// class Experience {

//   constructor () {
//     const canvas = document.querySelector("canvas");
//     this.gl = canvas.getContext("webgl");

//     this.init();
//   }

//   init() {
//     // create shaders
//     this.vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource)
//     this.fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

//     // create program
//     this.program = createProgram(this.gl, this.vertexShader, this.fragmentShader);
//   }
//   setupAttributes() {
//     this.attributes = {
//       a_position: {}
//     }
//     for (let [key, value] of Object.entries(this.attributes)) { 
//     }
//   }
//   setupUniforms() {}
//   render() {

//   }
// };