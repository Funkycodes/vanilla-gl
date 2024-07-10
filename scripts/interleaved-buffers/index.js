import { createProgram, createShader, fetchShaderFile, getLocation, resizeCanvasToDisplaySize } from "/lib/gl.js";
/**
 * @param {string} f 
 * @returns fullPath relative to project root
 */
const getPath = (f) => "/scripts/interleaved-buffers/" + f.replace(/(^(\.|\/)+|(\/)+$)/g, "");

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

const vertexShader = createShader(gl, gl.VERTEX_SHADER, await fetchShaderFile(getPath("./vertex.vert")));
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, await fetchShaderFile(getPath("./fragment.frag")));
const program = createProgram(gl, vertexShader, fragmentShader);

const { a_position, a_pointSize, a_color } = getLocation(gl, program, {
  a_position: {},
  a_pointSize: {},
  a_color: {}
}, "attrib");

const vertices = new Float32Array([
  0.0, 0.75, 40.0, 1.0, 0, 0,
  -0.4, -0.5, 40.0, 0, 1.0, 0,
  0.4, -0.5, 40.0, 0, 0, 1.0
]);
const fSize = vertices.BYTES_PER_ELEMENT;
const verticesBuffer = gl.createBuffer();



function draw() {
  resizeCanvasToDisplaySize(canvas);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_position.location, 2, gl.FLOAT, false, fSize * 6, 0);
  gl.enableVertexAttribArray(a_position.location);

  gl.vertexAttribPointer(a_pointSize.location, 1, gl.FLOAT, false, fSize * 6, fSize * 2);
  gl.enableVertexAttribArray(a_pointSize.location);

  gl.vertexAttribPointer(a_color.location, 3, gl.FLOAT, false, fSize * 6, fSize * 3);
  gl.enableVertexAttribArray(a_color.location);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

draw();