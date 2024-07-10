#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_mvp;
const float PI = 3.142;

varying vec2 v_texCoord;

void main() {
  gl_Position = u_mvp * vec4(a_position.xy, 0, 1);
  v_texCoord = a_texCoord;
}