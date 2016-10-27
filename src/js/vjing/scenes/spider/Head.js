const stage = require("mnf/core/stage")
const stage3d = require("mnf/core/stage3d")

const replaceIncludes = require( "mnf/utils/shaders" ).replaceIncludes

const ColorMeshLineGPUGroupGeometry = require("./ColorMeshLineGPUGroupGeometry")
const MeshLineGPUMaterial = require("mnf/3d/lines/MeshLineGPUMaterial")

const Leg = require("./Leg")
class Head extends THREE.Object3D {

	constructor(){
		super()
		const loader = new THREE.JSONLoader()
		loader.load('animhead.json',(test)=>{
			const mesh = new THREE.Mesh(test, new THREE.MeshBasicMaterial({color:0xFF1211}))
			mesh.castShadow = true
			this.head = mesh
			this.add(mesh)
		})
		this.middle =  new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({color:0xFFFFFF}))
		this.add(this.middle)
		this.left =  new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({color:0xFFFFFF}))
		this.left.position.set(-5.5,11.5,12)
		this.add(this.left)
		this.right =  new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({color:0xFFFFFF}))
		this.right.position.set(5.5,11.5,12)
		this.add(this.right)

		this.generateLegs()
		stage3d.add(this)
		stage.onUpdate.add(this.onUpdate)
	}

	generatePath(){
		const path = []
		// path.push(this.middle.position.clone())
		if(Math.random()<.5){
			let start = this.left.position.clone()
			start.x += (Math.random()-.5)*.5
			start.y += (Math.random()-.5)*.5
			path.push(start)
			let d = 12+5*Math.random()
			path.push(new THREE.Vector3(-5-(Math.random()-.5)*5,14,d))
			path.push(new THREE.Vector3(-5-(Math.random()-.5)*15+10,20+Math.random()*30,d+(Math.random()-.5)*3))
		} else {
			let start = this.right.position.clone()
			start.x += (Math.random()-.5)*.5
			start.y += (Math.random()-.5)*.5
			path.push(start)
			let d = 12+5*Math.random()
			path.push(new THREE.Vector3(5+(Math.random()-.5)*5,14,d))
			path.push(new THREE.Vector3(5+(Math.random()-.5)*15+10,20+Math.random()*30,d+(Math.random()-.5)*3))
		}
		return path
	}

	generateLegs(){
		const linesCount = 16
		const lineDivision = 3
		const width = 16
		const height = 4
		const size = width*height
		const positions = new Float32Array(size * 4)
		const texture = new THREE.DataTexture(positions, width, height, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0)
			   texture.needsUpdate = true
			  texture.generateMipmaps = false
		const geometry = new ColorMeshLineGPUGroupGeometry(linesCount,lineDivision,width,height)
		geometry.updateColor(0xFF0000)
		const material = new MeshLineGPUMaterial({ texture:texture, width:width, height:height,
				vertexShader: replaceIncludes(require('./material.vs')),
				fragmentShader: replaceIncludes(require('./material.fs')),
				lineWidth:4, depthTest:true, depthWrite:true, transparent:false, color:0, alphaTest:0.1
		})
		const depthMaterial = new THREE.ShaderMaterial({
				vertexShader: replaceIncludes(require('./material_depth.vs')),
				fragmentShader: "#define DEPTH_PACKING 0\n"+replaceIncludes(THREE.ShaderLib.depth.fragmentShader),
				uniforms: THREE.UniformsUtils.clone(material.uniforms),
		});
		const mesh = new THREE.Mesh(geometry, material)
		mesh.castShadow = true
		mesh.receiveShadow = false
		mesh.frustumCulled = false
		mesh.customDepthMaterial = depthMaterial
		this.add(mesh)

		this.legs = []
		let count = linesCount
		for( let i= 0; i < count; i++){
			const leg = new Leg( Math.PI*1.6* (i/(count))-Math.PI/4+Math.PI, i, texture )
			this.legs.push(leg)
		}

		this.texture = texture
	}

	onUpdate = (dt)=>{
		// this.head.y +=
		for(let leg of this.legs){
			leg.update(dt)
		}
		this.texture.needsUpdate = true
	}
}

module.exports = Head
