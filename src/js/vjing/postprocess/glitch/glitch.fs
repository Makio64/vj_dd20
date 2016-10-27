varying mediump vec2 vUv;

uniform sampler2D tInput;
uniform sampler2D glitchMap;

uniform lowp vec2 resolution;
uniform lowp vec2 glitchResolution;
uniform mediump float intensity;

void main() {
	lowp vec2 res = resolution/glitchResolution;
	lowp float glitch = texture2D(glitchMap,vUv).r;
	lowp vec2 uv = vec2( vUv.x +(glitch-.5)*intensity, vUv.y);
	uv.x = mod(1.+uv.x,1.);
	gl_FragColor = vec4( texture2D( tInput, uv ).rgb, 1. );
}
