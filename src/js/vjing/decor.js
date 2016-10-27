const stage = require("mnf/core/stage")
const stage3d = require("mnf/core/stage3d")

class Decor extends THREE.Object3D {

	constructor(){
		super()
		this.balls = []
		const sphere = new THREE.SphereGeometry(8,8,8)
		for(let i = 0 ; i < 20; i++){
			let ball = new THREE.Mesh(sphere,new THREE.MeshBasicMaterial({color:0xFFF000}))
			ball.scale.multiplyScalar(Math.random()*5+1)
			ball.position.x = (Math.random()-.5)*1300
			ball.position.y = (Math.random())*200+100
			ball.position.z = (Math.random()-.5)*1300
			ball.speed = 10 + 10*Math.random()
			ball.castShadow = true
			this.add(ball)
			this.balls.push(ball)
		}
		stage3d.add(this)
		stage.onUpdate.add(this.onUpdate)
	}

	onUpdate = (dt)=>{
		for(let ball of this.balls){
			ball.position.z -= ball.speed
			if(ball.position.z < -1300){
				ball.position.z += 2600
			}
		}
	}

}

module.exports = Decor
