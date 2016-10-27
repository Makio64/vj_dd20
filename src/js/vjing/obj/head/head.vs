#include <common>
#include <logdepthbuf_pars_vertex>

uniform float intensity;
uniform float zombie;

void main() {
	vec3 pos = position;
	vec3 left = vec3(-5.5,11.5,12);
	vec3 right = vec3(5.5,11.5,12);
	pos -= zombie*normal*(1.-smoothstep(0., 15., distance(pos,left)))*intensity;
	pos -= zombie*normal*(1.-smoothstep(0., 15., distance(pos,right)))*intensity;
	vec3 direction = normalize(left-pos);
	pos -= direction*(1.-smoothstep(0., 10., distance(pos,left)))*intensity;
	direction = normalize(right-pos);
	pos -= direction*(1.-smoothstep(0., 10., distance(pos,right)))*intensity;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
	#include <logdepthbuf_vertex>
}
