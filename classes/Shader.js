import { createProgram, createShader, fetchShaderFile, initAttribs, initUniforms } from "../lib/gl.js";

/**
 * @typedef Shader
 * @prop {WebGLRenderingContext} gl
 */
export default class {
  #vertex;
  #fragment;
  #program;
  /**
   * @param {Shader} props
   */
  constructor ({
    gl,
    attributes,
    uniforms,
    vertex,
    fragment
  }) {
    this.gl = gl;
    this.uniforms = uniforms;
    this.attributes = attributes;

    this.init(vertex, fragment);
  }
  async init(vertex, fragment) {
    const _ = this.gl;
    console.log(await fetchShaderFile(vertex));
    this.#vertex = createShader(_, _.VERTEX_SHADER, await fetchShaderFile(vertex));
    this.#fragment = createShader(_, _.FRAGMENT_SHADER, await fetchShaderFile(fragment));
    this.#program = createProgram(_, this.#vertex, this.#fragment);

    initAttribs(_, this.#program, this.attributes);
    initUniforms(_, this.#program, this.uniforms);
  }
  setAttribs() {}
  setUniforms() {}
  update() {}
}