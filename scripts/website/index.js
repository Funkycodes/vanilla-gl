import Camera from "/classes/Camera.js";
import { uniraf } from "/classes/Uniraf.js";
import { createProgram, createShader, createTexture, fetchShaderFile, getLocation, resizeCanvasToDisplaySize } from "/lib/gl.js";
import { ease } from "/lib/maths.js";
import { mat4 } from "/lib/matrix/index.js";

const lenis = new Lenis({
  ease: ease.o2,
  duration: 2
});
function raf(_, ms) {
  lenis.raf(ms);
}
uniraf.add(raf);

/**** Init ****/
/**
 * @param {string} f 
 * @returns fullPath relative to project root
 */
const getPath = (f) => "/scripts/website/" + f.replace(/(^(\.|\/)+|(\/)+$)/g, "");

const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");
gl.enable(gl.DEPTH_TEST);

resizeCanvasToDisplaySize(canvas);

const vertexSource = await fetchShaderFile(getPath("./shader.vert"));
const fragmentSource = await fetchShaderFile(getPath("./shader.frag"));

const images = document.querySelectorAll("[data-texture]");
images.forEach(i => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  let imageBounds = i.getBoundingClientRect();

  const { a_position, a_texCoord } = getLocation(gl, program, {
    a_position: {},
    a_texCoord: {}
  }, "attrib");
  const u_mvp = gl.getUniformLocation(program, "u_mvp");
  const u_time = gl.getUniformLocation(program, "u_time");
  const u_texture = gl.getUniformLocation(program, "u_texture");

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip webgl image coordinate system
  const t = createTexture(gl);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, i);

  let vertices = new Float32Array([
    0, 0, 0.0, 1.0,
    0, -imageBounds.height, 0.0, 0.0,
    imageBounds.width, 0, 1.0, 1.0,
    imageBounds.width, -imageBounds.height, 1.0, 0.0
  ]);
  const fSize = vertices.BYTES_PER_ELEMENT;
  const verticesBuffer = gl.createBuffer();
  const camera = new Camera(45, gl.canvas.width / gl.canvas.height, 100, 2000);
  let viewProjectionMatrix = mat4.multiply(mat4.create(), camera.projectionMatrix, camera.render());


  let modelMatrix = mat4.fromTranslation(mat4.create(), [ imageBounds.left, -imageBounds.top, 0 ]);
  let modelViewProjectionMatrix = mat4.multiply(mat4.create(), viewProjectionMatrix, modelMatrix);

  lenis.on("scroll", ({ scroll }) => {
    modelMatrix = mat4.fromTranslation(mat4.create(), [ imageBounds.left, -imageBounds.top + scroll, 0 ]);
    modelViewProjectionMatrix = mat4.multiply(mat4.create(), viewProjectionMatrix, modelMatrix);

  });
  let now = 0;
  uniraf.add(draw);
  function draw(delta, _) {
    now += delta;
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(a_position.location, 2, gl.FLOAT, false, fSize * 4, 0);
    gl.enableVertexAttribArray(a_position.location);

    gl.vertexAttribPointer(a_texCoord.location, 2, gl.FLOAT, false, fSize * 4, fSize * 2);
    gl.enableVertexAttribArray(a_texCoord.location);

    gl.useProgram(program);
    gl.uniform1f(u_time, now);
    gl.uniform1i(u_texture, 0);
    // projection
    gl.uniformMatrix4fv(u_mvp, false, modelViewProjectionMatrix);
    //
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
});