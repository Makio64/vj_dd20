class MeshLineGeometry extends THREE.BufferGeometry{

	constructor( pos ) {

		super()

		const l  = pos.length / 3;
		const l6 = l*6;
		const l6m6 = l6 - 6;

		const positions 		= new Float32Array(l6)
		const previous 			= new Float32Array(l6)
		const next 					= new Float32Array(l6)
		const side 					= new Float32Array(l*2)
		const uvs 					= new Float32Array(l*4)
		const index 				= new Uint16Array(l6)

		for( let j = 0; j < pos.length; j += 3 ) {
			positions[j*2]   =	positions[j*2+3] = pos[ j ]
			positions[j*2+1] =	positions[j*2+4] = pos[ j+1 ]
			positions[j*2+2] =	positions[j*2+5] = pos[ j+2 ]
		}

		let w;
		for( let j = 0; j < l; j++ ) {
			side[j*2] 	=  1
			side[j*2+1] = -1
			uvs[j*4] = uvs[j*4+2] = j / ( l - 1 )
			uvs[j*4+1] = 0
			uvs[j*4+3] = 1
		}

		for( let j = 0; j < l6m6; j++ ) {
			next[j] = positions[(j+6)%l6]
		}
		let diff = ( positions[0] == positions[l6-3] && positions[1] == positions[l6-2] && positions[2] == positions[l6-1] ) ? 6 : l6 - 6
		for( let j = 0; j < 6 ; j++ ) {
			next[l6m6+j] = positions[diff+j]
		}

		diff = ( positions[0] == positions[l6-3] && positions[1] == positions[l6-2] && positions[2] == positions[l6-1] )?l6-12:0;
		for( let j = 0; j < 6 ; j++ ) {
			previous[j] = positions[j+diff]
		}
		for( let j = 6; j < l6; j++ ) {
			previous[j] = positions[j-6]
		}

		let n, k
		for( let j = 0; j < l - 1; j++ ) {
			n = j * 2
			k = j * 6
			index[k] 	 = n
			index[k+1] = index[k+4] = n + 1
			index[k+2] = index[k+3] = n + 2
			index[k+5] = n + 3
		}

		this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) )
		this.addAttribute( 'previous', new THREE.BufferAttribute( previous, 3 ) )
		this.addAttribute( 'next', new THREE.BufferAttribute( next, 3 ) )
		this.addAttribute( 'side', new THREE.BufferAttribute( side, 1 ) )
		this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) )
		this.setIndex( new THREE.BufferAttribute( index, 1 ) )
	}

	updatePositions( pos ){
		const l6 = pos.length * 2
		const l6m6 = l6 - 6

		const positions 	= this.attributes.position.array
		const next 				= this.attributes.next.array
		const previous 		= this.attributes.previous.array

		for( let j = 0; j < pos.length; j += 3 ) {
			positions[j*2]   =	positions[j*2+3] = pos[ j ]
			positions[j*2+1] =	positions[j*2+4] = pos[ j+1 ]
			positions[j*2+2] =	positions[j*2+5] = pos[ j+2 ]
		}

		for( let j = 0; j < l6m6; j++ ) {
			next[j] = positions[(j+6)%l6]
		}
		let diff = ( positions[0] == positions[l6-3] && positions[1] == positions[l6-2] && positions[2] == positions[l6-1] ) ? 6 : l6 - 6
		for( let j = 0; j < 6 ; j++ ) {
			next[l6m6+j] = positions[diff+j]
		}

		diff = ( positions[0] == positions[l6-3] && positions[1] == positions[l6-2] && positions[2] == positions[l6-1] )?l6-12:0;
		for( let j = 0; j < 6 ; j++ ) {
			previous[j] = positions[j+diff]
		}
		for( let j = 6; j < l6; j++ ) {
			previous[j] = positions[j-6]
		}

		this.attributes.position.needsUpdate = true
		this.attributes.previous.needsUpdate = true
		this.attributes.next.needsUpdate = true
	}
}

module.exports = MeshLineGeometry

module.exports.fromTo = (p1,p2,pointCount=2)=>{

	const positions = new Float32Array( pointCount * 4 )

	let percent1, percent, i4

	for(let i = 0; i < pointCount*4; i+=4){
		percent = i/(pointCount-1)
		percent1 = 1 - percent
		positions[i]   = p1.x*percent1 + p2.x*percent
		positions[i+1] = p1.y*percent1 + p2.y*percent
		positions[i+2] = p1.z*percent1 + p2.z*percent
		positions[i+3] = 0
	}
	return positions
}

module.exports.fromAngles = (angleStart,angleEnd,radius=5,pointCount=32)=>{
	const positions = new Float32Array( (pointCount)*3 )
	let step = (angleEnd-angleStart)/(pointCount-1)
	let k = 0
	for(let a = angleStart; a < angleEnd+step; a+=step){
		positions[k]   = Math.cos(a)*radius
		positions[k+1] = Math.sin(a)*radius
		positions[k+2] = 0
		k+=3
	}
	return positions;
}

module.exports.fromLength = (division)=>{
	const positions = new Float32Array( division*3 )
	return new MeshLineGeometry(positions)
}
