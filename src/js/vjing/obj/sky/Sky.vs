// varying vec2 vUv;
// varying vec3 vPos;

// uniform vec3 lightPos[];
// uniform vec3 lightColor[];

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float brightness;

varying lowp vec3 vColor;

vec3 light(vec3 lightColor, vec3 lightPos, float intensity, vec3 pos){
	float d = smoothstep(0., distance(lightPos,pos),intensity);
	return lightColor*d;
}

void main() {
	vColor += vec3(.1);
	vColor += light(color1,vec3(.2,.3,1.),.3,position);
	vColor += light(color2,vec3(1.,.5,0.3),.2,position);
	vColor += light(color3,vec3(-1.,-.3,1.),.4,position);
	vColor = normalize(vColor)*brightness;
	vColor *= min(vec3(1.2),(vec3(position.y)*vec3(position.y))+.2);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
