varying vec2 vUv;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;

void main() {
	vec3 pos = texture2D( t_pos, vUv ).xyz;
	vec3 old = texture2D( t_oPos, vUv ).xyz;

	pos.x += sin(pos.y*0.2)+0.2*sin(pos.x*0.2);
	pos.y += sin(pos.x*0.2)+0.2*sin(pos.y*0.2);

	gl_FragColor = vec4( pos.xyz, 1.0 );
}
