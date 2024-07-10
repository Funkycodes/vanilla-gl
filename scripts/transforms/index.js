import { createShader, createProgram, fetchShaderFile, initAttribs, initUniforms, setAttribs, setUniforms, resizeCanvasToDisplaySize } from "../../lib/gl.js";
import { animate, ease, lerp } from "../../lib/maths.js";
import { mat3 } from "../../lib/matrix/index.js";

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

const vertexShader = createShader(gl, gl.VERTEX_SHADER, await fetchShaderFile("/scripts/transforms/vertex.glsl"));
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, await fetchShaderFile("/scripts/transforms/fragment.glsl"));
const program = createProgram(gl, vertexShader, fragmentShader);

const attributes = {
  a_position: {
    type: "2f",
  },
  setValue: function (k, v) {
    this[ k ].value = v;
  }
};
const uniforms = {
  u_matrix: {
    type: "Matrix3"
  },
  setValue: function (k, v) {
    this[ k ].value = v;
  }
};
const texture = gl.createTexture();
initAttribs(gl, program, attributes);
initUniforms(gl, program, uniforms);
console.log(gl.getSupportedExtensions());

let angle = 0;
function draw() {
  resizeCanvasToDisplaySize(canvas);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  let mat = mat3.create();
  mat3.rotate(mat, mat, angle);
  uniforms.setValue("u_matrix", mat);

  attributes.setValue("a_position", new Float32Array([
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5,
  ]));

  gl.useProgram(program);
  setUniforms(gl, uniforms);
  setAttribs(gl, attributes);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  requestAnimationFrame(draw);
}

draw();

function translate(progress) {
  angle = lerp(angle, Math.PI * 6, progress);
}

animate(translate, 3000, ease.io6);