import { createShader, fetchShaderFile, createProgram, getLocation, resizeCanvasToDisplaySize, createTexture } from "/lib/gl.js";

/**
 * @param {string} f 
 * @returns fullPath relative to project root
 */
const getPath = (f) => "/scripts/textures/" + f.replace(/(^(\.|\/)+|(\/)+$)/g, "");

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

const vertexShader = createShader(gl, gl.VERTEX_SHADER, await fetchShaderFile(getPath("./shader.vert")));
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, await fetchShaderFile(getPath("./shader.frag")));
const program = createProgram(gl, vertexShader, fragmentShader);



const { a_position, a_texCoord } = getLocation(gl, program, {
  a_position: {},
  a_texCoord: {}
}, "attrib");
const u_texture = gl.getUniformLocation(program, "u_texture");
const t = createTexture(gl);
const i = new Image();
i.src = "/texture.jpg";
i.onload = () => {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.useProgram(program);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i);
  gl.uniform1i(u_texture, 0);
};

const vertices = new Float32Array([
  -0.5, 0.5, 0.0, 1.0,
  -0.5, 0.0, 0.0, 0.0,
  0.5, 0.5, 1.0, 1.0,
  0.5, 0.0, 1.0, 0.0
]);
const fSize = vertices.BYTES_PER_ELEMENT;
const verticesBuffer = gl.createBuffer();



function draw() {
  resizeCanvasToDisplaySize(canvas);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_position.location, 2, gl.FLOAT, false, fSize * 4, 0);
  gl.enableVertexAttribArray(a_position.location);

  gl.vertexAttribPointer(a_texCoord.location, 2, gl.FLOAT, false, fSize * 4, fSize * 2);
  gl.enableVertexAttribArray(a_texCoord.location);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(draw);
}

draw();