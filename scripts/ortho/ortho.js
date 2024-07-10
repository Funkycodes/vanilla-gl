import { createProgram, createShader, fetchShaderFile, getLocation, resizeCanvasToDisplaySize } from "/lib/gl.js";
import { mat4, vec3, vec4 } from "/lib/matrix/index.js";

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

const getPath = (f) => "/scripts/ortho/" + f.replace(/(^(\\|\/|\.)*|(\\|\/)*$)/g, "");
let vertexShader = await fetchShaderFile(getPath("shader.vert"));
let fragmentShader = await fetchShaderFile(getPath("shader.frag"));

vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
const program = createProgram(gl, vertexShader, fragmentShader);

const { a_position } = getLocation(gl, program, {
  a_position: {},
  a_pointSize: {}
}, "attrib");
const u_mvp_location = gl.getUniformLocation(program, "u_mvp");

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
const vertices = new Float32Array([
  // left column front
  0, 0, 0,
  0, 150, 0,
  30, 0, 0,
  0, 150, 0,
  30, 150, 0,
  30, 0, 0,

  // top rung front
  30, 0, 0,
  30, 30, 0,
  100, 0, 0,
  30, 30, 0,
  100, 30, 0,
  100, 0, 0,

  // middle rung front
  30, 60, 0,
  30, 90, 0,
  67, 60, 0,
  30, 90, 0,
  67, 90, 0,
  67, 60, 0,

  // left column back
  0, 0, 30,
  0, 150, 30,
  30, 0, 30,
  0, 150, 30,
  30, 150, 30,
  30, 0, 30,

  // top rung back
  30, 0, 30,
  100, 0, 30,
  30, 30, 30,
  30, 30, 30,
  100, 0, 30,
  100, 30, 30,

  // middle rung back
  30, 60, 30,
  67, 60, 30,
  30, 90, 30,
  30, 90, 30,
  67, 60, 30,
  67, 90, 30,

  // top
  0, 0, 0,
  100, 0, 0,
  100, 0, 30,
  0, 0, 0,
  100, 0, 30,
  0, 0, 30,

  // top rung right
  100, 0, 0,
  100, 30, 0,
  100, 30, 30,
  100, 0, 0,
  100, 30, 30,
  100, 0, 30,

  // under top rung
  30, 30, 0,
  30, 30, 30,
  100, 30, 30,
  30, 30, 0,
  100, 30, 30,
  100, 30, 0,

  // between top rung and middle
  30, 30, 0,
  30, 30, 30,
  30, 60, 30,
  30, 30, 0,
  30, 60, 30,
  30, 60, 0,

  // top of middle rung
  30, 60, 0,
  30, 60, 30,
  67, 60, 30,
  30, 60, 0,
  67, 60, 30,
  67, 60, 0,

  // right of middle rung
  67, 60, 0,
  67, 60, 30,
  67, 90, 30,
  67, 60, 0,
  67, 90, 30,
  67, 90, 0,

  // bottom of middle rung.
  30, 90, 0,
  30, 90, 30,
  67, 90, 30,
  30, 90, 0,
  67, 90, 30,
  67, 90, 0,

  // right of bottom
  30, 90, 0,
  30, 90, 30,
  30, 150, 30,
  30, 90, 0,
  30, 150, 30,
  30, 150, 0,

  // bottom
  0, 150, 0,
  0, 150, 30,
  30, 150, 30,
  0, 150, 0,
  30, 150, 30,
  30, 150, 0,

  // left side
  0, 0, 0,
  0, 0, 30,
  0, 150, 30,
  0, 0, 0,
  0, 150, 30,
  0, 150, 0 ]);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

resizeCanvasToDisplaySize(canvas);
let u_mvp = mat4.ortho(mat4.create(), 0, gl.canvas.width, gl.canvas.height, 0, 400, -400);
// (function (width, height, depth) {
//   // Note: This matrix flips the Y axis so 0 is at the top.
//   return [
//     2 / width, 0, 0, 0,
//     0, -2 / height, 0, 0,
//     0, 0, 2 / depth, 0,
//     -1, 1, 0, 1,
//   ];
// })(gl.canvas.width, gl.canvas.height, 400);
const sliders = fetchAndSetupSliders();
draw();

function draw() {
  resizeCanvasToDisplaySize(canvas);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enableVertexAttribArray(a_position.location);
  gl.vertexAttribPointer(a_position.location, 3, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.uniformMatrix4fv(u_mvp_location, false, u_mvp);
  gl.drawArrays(gl.TRIANGLES, 0, 96);
}

function fetchAndSetupSliders() {
  /**
   * @type {Array<HTMLInputElement>}
   */
  const sliders = Array.from(document.querySelectorAll(".gl-sliders__slider>input"));

  sliders.forEach(slider => {
    const { type, axis } = slider.dataset;
    switch (type) {
      case "translate":
        slider.step = 1;
        slider.value = 0;
        slider.max = axis === "y" ? window.innerHeight : window.innerWidth;
        break;
      case "rotate":
        slider.step = 1;
        slider.value = 0;
        slider.max = 360;
        break;
      case "scale":
        slider.value = 1.0;
        slider.step = 0.1;
        slider.max = 4.0;
        slider.min = -2.0;
    }
    slider.onchange = () => {
      slider.previousElementSibling.children[ 1 ].textContent = slider.value;
    };
    slider.onchange();
  });

  return sliders.sort((s) => s.dataset.type === "translate" ? -1 : 0);
}
