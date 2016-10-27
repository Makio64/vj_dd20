// varying vec2 vUv;
// varying vec3 vPos;
#include <common>
#include <logdepthbuf_pars_fragment>

uniform lowp vec3 color;

void main(void) {
	#include <logdepthbuf_fragment>
	vec3 color = color;
	if(!gl_FrontFacing){
		color *= .05;
	}
	gl_FragColor = vec4(color, 1.0);
}
