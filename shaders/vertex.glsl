attribute vec2 a_position;
uniform mat3 u_matrix;

void main() {
  vec3 clipSpace = u_matrix * vec3(a_position, 1);
  gl_Position = vec4(clipSpace, 1);
}