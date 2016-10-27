#include <common>
#include <packing>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying lowp vec3 vColor;

void main() {
	gl_FragColor = vec4(vColor,1.);
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
}
