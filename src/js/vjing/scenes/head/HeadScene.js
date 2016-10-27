const stage = require('mnf/core/stage')
const stage3d = require('mnf/core/stage3d')
const Scene = require('mnf/core/Scene')
const Sky = require('vjing/obj/sky/Sky')
const Head = require('vjing/obj/head/Head')
const audio = require('mnf/core/audio')

class HeadScene extends Scene {

	constructor(){
		super()

		this.ball =  new THREE.Mesh(
			new THREE.SphereBufferGeometry(10,16,16),
			new THREE.MeshPhongMaterial())
		this.ball.castShadow = true
		this.ball.position.y = 10

		this.head = new Head()
		this.head.scale.set(3,3,3)
		this.head.position.y = 20
	}


	onUpdate=()=>{
		const v = 1 + .3*audio.volume
		this.head.scale.set(v,v,v)
		this.head.head.material.uniforms.intensity.value *=.9
	}

	onBeat=()=>{
		// this.head.head.material.uniforms.intensity.value += (audio.volume*2-this.head.head.material.uniforms.intensity.value)*.15
		this.head.head.material.uniforms.intensity.value = audio.volume*2
		// this.ball.material.color.set(Math.random()*0xFFFFFF)
	}

	transitionIn(){
		stage3d.add(this.head)
		stage.onUpdate.add(this.onUpdate)
		audio.onBeat.add(this.onBeat)
		super.transitionIn()
	}

	transitionOut(){
		stage3d.remove(this.head)
		stage.onUpdate.remove(this.onUpdate)
		audio.onBeat.remove(this.onBeat)
		super.transitionOut()
	}

}

module.exports = HeadScene
