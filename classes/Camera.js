import { getViewingDist } from "/lib/gl.js";
import { degToRad, radToDeg } from "/lib/maths.js";
import { mat4 } from "/lib/matrix/index.js";

export default class Camera {
  constructor (fov = 70, aspect = 1, far = 100, near = 2000, renderWindow = { h: window.innerHeight, w: window.innerWidth }) {
    this.angle = degToRad(fov);
    this.far = far;
    this.near = near;
    this.aspect = aspect;

    this.renderWindow = renderWindow;

    this.viewMatrix = mat4.create();
    this.cameraMatrix = mat4.create();
    this.projectionMatrix = mat4.create();

    this.x = this.renderWindow.w * 0.5;
    this.y = -this.renderWindow.h * 0.5;
    this.z = getViewingDist(this.angle, this.renderWindow.h);

    this.updateProjectionMatrix();
  }
  get x() {
    return this.cameraMatrix[ 12 ];
  }
  get y() {
    return this.cameraMatrix[ 13 ];
  }
  get z() {
    return this.cameraMatrix[ 14 ];
  }
  get fov() {
    return radToDeg(this.angle);
  }

  /**@param {number} v*/
  set x(v) {
    this.cameraMatrix[ 12 ] = v;
  }
  /**@param {number} v*/
  set y(v) {
    this.cameraMatrix[ 13 ] = v;
  }
  /**@param {number} v*/
  set z(v) {
    this.cameraMatrix[ 14 ] = v;
  }
  /**@param {number} v*/
  set fov(v) {
    this.angle = degToRad(v);
    this.z = getViewingDist(this.angle, this.renderWindow.h);
    this.updateProjectionMatrix();
  }

  /**@param {vec3} point */
  lookAt(point) {
    mat4.lookAt(this.cameraMatrix, [ this.x, this.y, this.z ], point, [ 0, 1, 0 ]);
  }

  setPosition(x, y, z) {
    is.def(x) ? (this.x = x) : void 0;
    is.def(y) ? (this.x = y) : void 0;
    is.def(z) ? (this.x = z) : void 0;
  }

  resize(config) {
    is.def(config.aspect) && (this.aspect = config.aspect);
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    this.projectionMatrix = mat4.perspective(this.projectionMatrix, this.angle, this.aspect, this.near, this.far);
  }
  render() {
    mat4.invert(this.viewMatrix, this.cameraMatrix);
    return this.viewMatrix;
  }
}