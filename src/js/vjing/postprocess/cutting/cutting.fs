varying mediump vec2 vUv;

uniform sampler2D tInput;
uniform lowp vec2 resolution;

uniform sampler2D cuttingMap;
uniform lowp vec2 cuttingResolution;
uniform mediump float intensity;
uniform mediump vec2 direction;

void main() {
	lowp vec2 res = resolution / cuttingResolution;
	lowp float cutting = texture2D(cuttingMap,vUv).r-.5;

	lowp vec2 uv = vUv + cutting * vec2(0.,1.) * intensity;
	uv = mod(1.+uv,vec2(1.));

	gl_FragColor = vec4( texture2D( tInput, uv ).rgb, 1. );
}
