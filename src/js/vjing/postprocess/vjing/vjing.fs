uniform sampler2D tInput;
uniform vec2 resolution;
varying vec2 vUv;

uniform float gamma;
uniform float contrast;
uniform float brightness;

uniform float boost;
uniform float mirrorX;
uniform float mirrorY;
uniform float divide4;
uniform float vignetteFallOff;
uniform float vignetteAmount;
uniform float invertRatio;
uniform float bw;

vec3 toGamma( vec3 rgb ) {
  return pow( rgb, vec3( 1.0 / gamma ) );
}

void main() {
	vec2 uv = vUv;
	if(mirrorY>0.){ uv.y = abs(uv.y-.5)+.5; }
	if(mirrorX>0.){ uv.x = abs(uv.x-.5)+.5; }
	if(divide4>0.){ uv *= 2.; uv = mod(uv,vec2(1.)); }

	vec4 color = texture2D(tInput, uv);

	vec3 rgb = toGamma( color.rgb );
	rgb = rgb * contrast;
	rgb = rgb + vec3( brightness );

	//invert
	rgb = mix(rgb, (1. - rgb),invertRatio);

	//Vignette
	float dist = distance(uv, vec2(0.5, 0.5));
	rgb *= smoothstep(0.8, vignetteFallOff * 0.799, dist * (vignetteAmount + vignetteFallOff));

	//Boost
	// lowp float vignette = boost - distance( resolution * .5, vUv ) / resolution.x;
	// rgb = mix(rgb, rgb * vignette, boost-1.);

	//BW
	vec3 luma = vec3( .299, 0.587, 0.114 );
	gl_FragColor = vec4(mix(rgb,vec3( dot( rgb, luma ) ), bw), 1. );
}
