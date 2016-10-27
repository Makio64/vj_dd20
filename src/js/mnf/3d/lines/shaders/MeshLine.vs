precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 previous;
attribute vec3 next;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;

// varying vec2 vUv;

vec2 fix( vec4 i, float aspect ) {
	vec2 res = i.xy / i.w;
	res.x *= aspect;
	return res;
}

void main() {
	// vUv = uv;
	float aspect = resolution.x / resolution.y;

	mat4 m = projectionMatrix * modelViewMatrix;
	vec4 finalPosition = m * vec4( position, 1.0 );
	vec4 prevPos = m * vec4( previous, 1.0 );
	vec4 nextPos = m * vec4( next, 1.0 );

	vec2 prevP = fix( prevPos, aspect );
	vec2 nextP = fix( nextPos, aspect );

	vec2 dir = normalize( nextP - prevP );
	finalPosition.xy += vec2( -dir.y/aspect, dir.x ) * lineWidth * side * lineWidth;
	gl_Position = finalPosition;
}
