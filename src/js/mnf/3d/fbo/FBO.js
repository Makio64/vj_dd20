const THREE = require("THREE")
const stage3d = require('mnf/core/stage3d')

class FBO{

	constructor( width, height, simulation, {format=THREE.RGBAFormat}={} ){

		this.simulation = simulation
		this.renderer = stage3d.renderer

		const options = {
			format: format,
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			type: THREE.FloatType,
			encoding: THREE.LinearEncoding,
			stencilBuffer: false,
			depthBuffer: false,
			transparent: format==THREE.RGBAFormat
		}

		this.rt = new THREE.WebGLRenderTarget(width, height, options)
		this.rt2 = new THREE.WebGLRenderTarget(width, height, options)
		this.rt3 = new THREE.WebGLRenderTarget(width, height, options)

		this.rt.texture.generateMipmaps = false
		this.rt2.texture.generateMipmaps = false
		this.rt3.texture.generateMipmaps = false

		this.scene = new THREE.Scene()
		this.orthoCamera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 )
		this.mesh =  new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1, 1, 1 ) )
		this.scene.add( this.mesh )
		this.rt.texture = simulation.uniforms.t_pos.value.clone()
		this.rt2.texture = this.rt.texture.clone()
		this.rt3.texture = this.rt.texture.clone()
		this.mesh.material = simulation
	}

	setSimulation(simulation){
		this.simulation = simulation
		this.mesh.material = this.simulation
		this.simulation.uniforms.t_pos.value = this.rt3.texture
		this.simulation.uniforms.t_oPos.value = this.rt2.texture
	}

	update = ()=> {
		this.renderer.setClearColor(0,0)
		this.renderer.render( this.scene, this.orthoCamera, this.rt, true )
		let tmp = this.rt
		this.rt = this.rt2
		this.rt2 = this.rt3
		this.rt3 = tmp
		this.simulation.uniforms.t_pos.value = this.rt3.texture
		this.simulation.uniforms.t_oPos.value = this.rt2.texture
	}

	debug(size = 2){
		this.debug1 = new THREE.Mesh(new THREE.PlaneBufferGeometry( size, size ), new THREE.MeshBasicMaterial({transparent:false,depthTest:false,depthWrite:false, map:this.rt.texture}))
		this.debug2 = new THREE.Mesh(new THREE.PlaneBufferGeometry( size, size ), new THREE.MeshBasicMaterial({transparent:false,depthTest:false,depthWrite:false, map:this.rt2.texture}))
		this.debug3 = new THREE.Mesh(new THREE.PlaneBufferGeometry( size, size ), new THREE.MeshBasicMaterial({transparent:false,depthTest:false,depthWrite:false, map:this.rt3.texture}))

		// this.debug1.material = new THREE.MeshBasicMaterial({wireframe:true})
		// this.debug2.material = new THREE.MeshBasicMaterial({wireframe:true})
		// this.debug3.material = new THREE.MeshBasicMaterial({wireframe:true})
		this.debug2.position.x = size+.1
		this.debug3.position.x = -size-.1

		stage3d.add(this.debug1)
		stage3d.add(this.debug2)
		stage3d.add(this.debug3)
	}

}

module.exports = FBO
