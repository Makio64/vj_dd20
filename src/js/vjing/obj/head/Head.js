const stage = require("mnf/core/stage")
const stage3d = require("mnf/core/stage3d")
const gui = require("mnf/utils/gui")
const replaceIncludes = require( "mnf/utils/shaders" ).replaceIncludes

const redMaterial = new THREE.MeshBasicMaterial({color:0xFF1211,transparent:true,opacity:.5})
const blackMaterial = new THREE.MeshBasicMaterial({color:0x00FF00,side:THREE.BackSide, depthTest:false,depthWrite:false})
const multimaterial = new THREE.MultiMaterial([
	blackMaterial,
	redMaterial,
])

const redCustomMaterial = new THREE.ShaderMaterial({
		vertexShader: replaceIncludes(require('./head.vs')),
		fragmentShader: require('./head.fs'),
		uniforms: {
			color:{type:'v3',value:new THREE.Color(0xFFFFFF)},
			intensity:{type:'f',value:1},
			zombie:{type:'f',value:1},

		},
		depthTest:true,
		// depthWrite:true,
        side:THREE.DoubleSide
});

const left = new THREE.Vector3(-5.5,11.5,12)
const right = new THREE.Vector3(5.5,11.5,12)

const f = gui.addFolder('head')
f.add(redCustomMaterial.uniforms.intensity,'value',0,10)
f.add(redCustomMaterial.uniforms.zombie,'value',0,10)

class Head extends THREE.Group {

  constructor(){
    super()
	const eyeMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF,depthTest:true,depthWrite:true})
	this.middle =  new THREE.Mesh(new THREE.SphereGeometry(1), eyeMaterial)
	this.add(this.middle)

	this.left =  new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({color:0xFFFFFF,depthTest:true,depthWrite:true}))
	this.left.position.copy(left)
	this.add(this.left)

	this.right =  new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({color:0xFFFFFF,depthTest:true,depthWrite:true}))
	this.right.position.set(5.5,11.5,12)
	this.add(this.right)

	const mesh = new THREE.Mesh(stage3d.models.animhead, redCustomMaterial)
	mesh.castShadow = true
	this.head = mesh
	this.add(mesh)
  }

}

module.exports = Head
module.exports.left = left
module.exports.right = right
