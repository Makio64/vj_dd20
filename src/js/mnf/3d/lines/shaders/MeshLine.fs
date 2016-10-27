precision mediump float;

uniform vec3 color;
uniform float opacity;
// varying vec2 vUv;

void main() {
	gl_FragColor = vec4(color,opacity);
}
