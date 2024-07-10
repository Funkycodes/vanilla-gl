
//@ts-check
/**
 * @param {WebGLRenderingContext} gl 
 * @param {number} type 
 * @param {string} source 
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;


  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
/**
 * @param {WebGLRenderingContext} gl
 */
export function createTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}
/**
 * 
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader 
 * @param {WebGLShader} fragmentShader 
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
/**
 * @param {WebGLRenderingContext} gl
 * @param {string} attributeName
 */
export function initAttribute(gl, program, attributeName) {
  const location = gl.getAttribLocation(program, attributeName);
  gl.enableVertexAttribArray(location);
  const buffer = gl.createBuffer();

  return {
    location,
    buffer
  };
}
/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {boolean}
 */
export function resizeCanvasToDisplaySize(canvas) {
  const { width, height } = canvas.getBoundingClientRect();
  const displayWidth = width;
  const displayHeight = height;
  const dpr = Math.min(window.devicePixelRatio, 2);
  const needResize = canvas.width != displayWidth ||
    canvas.height != displayHeight;

  if (needResize) {
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
  }
  return needResize;
}
/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLProgram} program
 * @param {Record<string, any>} obj
 * @param {"uniform" | "attrib"} type
 */

export function getLocation(gl, program, obj, type) {
  const getMethod = `get${type[ 0 ].toUpperCase() + type.slice(1)}Location`;
  for (const key of Object.keys(obj)) {
    if (typeof obj[ key ] === "function")
      continue;
    obj[ key ].location = gl[ getMethod ](program, key);
  }
  return obj;
}

export function initAttribs(gl, program, obj) {
  getLocation(gl, program, obj, "attrib");
  for (let key of Object.keys(obj)) {
    if (typeof obj[ key ] === "function")
      continue;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(obj[ key ].location);
    obj[ key ].buffer = buffer;
  }
}

export function initUniforms(gl, program, obj) {
  getLocation(gl, program, obj, "uniform");
}
/**
 * @param {WebGLRenderingContext} gl 
 */
export function setUniforms(gl, obj) {
  // iterate thru object, check if object is in cache else create new
  // update value
  for (const key of Object.keys(obj)) {
    if (typeof obj[ key ] === "function")
      continue;
    let method;
    let { value, type, location } = obj[ key ];
    method = "uniform" + type;
    if (type.includes("Matrix"))
      gl[ (method + "fv") ](location, false, value);
    else
      gl[ method ](location, ...value);
  }
}

/**
 * @typedef Attribute
 * @prop {string} type
 * @prop {Float32Array} value
 * @prop {number} location
 * @prop {WebGLBuffer} buffer
 */



export const fetchShaderFile = async (path) => {
  const res = await fetch(path, { mode: "same-origin" });
  const text = await res.text();
  return text;
};

/**
 * 
 */
function loadTexture(path, texVar) {
  const image = new Image();
  image.src = path;

  image.onload = () => {
    texVar = image;
  };
}

/**@param {number} fov - angle in radians
 * @param {number} height - height of render window
*/
export const getViewingDist = (fov, height) => {
  return (height * 0.5) / Math.tan(fov * 0.5);
};
/**
 * @param {number} dist - distance of camera from obj
 * @param {number} height - height of render window
 */
export const getViewingFov = (dist, height) => {
  return Math.atan((height * 0.5) / dist) * 2;
};