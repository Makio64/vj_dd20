const gui = require('mnf/utils/gui')
const o = {
	globalSpeed : 1000,
	bySegment: 2,
	tension:.2,
	easing: 0.1
}
const f = gui.addFolder('lineWidth')
f.add(o,'globalSpeed',20,1000)
f.add(o,'bySegment',0,15)
f.add(o,'tension',0,2)
f.add(o,'easing',0.001,1)

class PathLine {

	constructor(index, division, texture, path, offsetX=0, offsetY=0, closed=true,multiply=4,randomPower=1){
		this.index = index
		this.division = division
		this.texture = texture
		this.time = Math.random()*1000
		this.closed = closed

		if(path == undefined){
			this.path = new THREE.CatmullRomCurve3([
				this.randomPoint(),
				this.randomPoint(),
				this.randomPoint(),
				this.randomPoint(),
				this.randomPoint(),
			])
		}
		else {
			let a = []
			for(let p of path){
				let v = new THREE.Vector3()
				v.set(
					p.x+(Math.random()-.5)*.5*randomPower,
					p.y+(Math.random()-.5)*.5*randomPower,
					p.z+(Math.random()-.5)*2*randomPower
				)
				v.multiplyScalar(multiply)
				v.x += offsetX
				v.y += offsetY
				a.push(v)
			}
			this.path = new THREE.CatmullRomCurve3(a)
		}

		this.path.type = 'catmullrom'
		this.path.closed = closed
		this.position = this.time/o.globalSpeed

		this.update(100)
	}

	randomPoint(){
		return new THREE.Vector3((Math.random()-.5)*400,(Math.random()-.5)*400,(Math.random()+.5)*50)
	}

	reset(){
		this.time = Math.random()*1000
		this.position = this.time/o.globalSpeed
		this.update(100)
	}

	update = (dt)=>{
		this.path.tension = o.tension
		this.time += dt/6
		this.position += dt / 6 / o.globalSpeed
		let easing = o.easing
		let isForce = false

		if(!this.closed){
				if(this.position-(this.division-1)*o.bySegment/o.globalSpeed >= 1.1){
					this.position=0
					isForce = true
					easing = 1
				}
		} else {
			this.position%=1
		}

		for( let i = 0 ; i < this.division; i++){
			let pp
			if(isForce){
				pp = 0
			} else {
				pp = Math.max(0,Math.min(1,this.position-i*o.bySegment/ o.globalSpeed))
			}
			let p = this.path.getPoint(pp)
			this.texture.image.data[this.index+i*4+0] += (p.x - this.texture.image.data[this.index+i*4+0]) * easing
			this.texture.image.data[this.index+i*4+1] += (p.y - this.texture.image.data[this.index+i*4+1]) * easing
			this.texture.image.data[this.index+i*4+2] += (p.z - this.texture.image.data[this.index+i*4+2]) * easing
			this.texture.image.data[this.index+i*4+3] = 0
		}
		this.texture.needsUpdate = true
	}
}

module.exports = PathLine
module.exports.config = o
