attribute vec2 a_position;
attribute float a_pointSize;
attribute vec3 a_color;

varying vec3 v_color;

void main() {
  gl_PointSize = a_pointSize;
  gl_Position = vec4(a_position, 0, 1);
  v_color = a_color;
}