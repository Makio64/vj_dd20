class Leg {

	constructor(angle, index, texture){

		this.textureIndex = index*3*4
		this.texture = texture
		this.time = Math.random()*1000//index>=2 ? 500 : 0 + (index%2==0)?250:0

		const baseRadius = 12
		const baseHeight = 20
		const elbowHeight = 25
		const elbowRadius = 30
		const footRadius = 65
		const footY = -10


		this.attach = new THREE.Vector3( Math.cos(angle)*baseRadius, baseHeight, Math.sin(angle)*baseRadius )
		this.elbows = new THREE.Vector3( Math.cos(angle)*elbowRadius, elbowHeight, Math.sin(angle)*elbowRadius)
		this.foot = new THREE.Vector3( Math.cos(angle)*footRadius, footY, Math.sin(angle)*footRadius )

		this.attachB = this.attach.clone()
		this.elbowsB = this.elbows.clone()
		this.footB = this.foot.clone()


		this.joints = [this.attach, this.elbows, this.foot]

	}

	update = (dt)=>{
		this.time += dt
		const motionPercent = (this.time/1000)%1

		this.elbows.y = this.elbowsB.y + Math.max(0,Math.sin(motionPercent*Math.PI*2))*10
		this.foot.y = this.footB.y + Math.max(0,Math.sin(motionPercent*Math.PI*2)*2)
		this.foot.z = this.footB.z + Math.sin(motionPercent*Math.PI*2)*27

		for(let i = 0; i < this.joints.length; i++){
			let joint = this.joints[i]
			this.texture.image.data[this.textureIndex + i*4    ] = joint.x
			this.texture.image.data[this.textureIndex + i*4 + 1] = joint.y
			this.texture.image.data[this.textureIndex + i*4 + 2] = joint.z
		}
	}


}

module.exports = Leg
