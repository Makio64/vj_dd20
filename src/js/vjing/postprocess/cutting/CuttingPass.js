const WAGNER = require('WAGNER')
const fs = require('./cutting.fs')
const vs = require('./cutting.vs')

const gui = require('mnf/utils/gui')
const stage = require('mnf/core/stage')
const audio = require('mnf/core/audio')

class CuttingPass extends WAGNER.Pass{

	// Time in ms
	constructor(size = 256, duration = 1, delayBetween = 0, durationVariation=0){
		super()
		this.size = size
		this.canvas = document.createElement('canvas')
		this.canvas.width = this.size
		this.canvas.height = this.size
		this.ctx = this.canvas.getContext('2d')

		this.texture = new THREE.Texture(this.canvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, THREE.LuminanceFormat)
		this.texture.needsUpdate = true
		this.texture.anysotropy = 0
		this.texture.generateMipmaps = false

		this.time = 0
		this.rTime = 0
		this.cutCount = 0

		this.shader = WAGNER.processShader( vs, fs )
		this.params.mapResolution  = new THREE.Vector2(this.size,this.size)
		this.params.direction = new THREE.Vector2(0,1)
		this.params.intensity = .3
		this.constantTime = 0
		this.shader.uniforms.cuttingMap.value = this.texture
		// this.debug()
		this.state = 'standby'
		stage.onUpdate.add(this.update)
		audio.onBeat.add(this.onBeat)
	}

	onBeat = ()=>{
		if(this.state=='auto'){
			this.cutCount++
		}
	}

	update = (dt)=>{
		if(this.state== 'standby'){
			this.shader.uniforms.intensity.value *= .9
		}
		else if(this.state == 'auto'){
			if(audio.volume>.3){
				this.shader.uniforms.intensity.value += ( (this.cutCount%2==0?1:-1)*audio.volume*.05-this.shader.uniforms.intensity.value)*.05
			}
			this.shader.uniforms.intensity.value *= .9
		} else {
			this.intensity += dt/16*this.constantTime
			this.shader.uniforms.intensity.value += (this.intensity-this.shader.uniforms.intensity.value)*.05
		}
		// this.rTime += dt
		// this.time -= dt
		// this.shader.uniforms.intensity.value = this.intensity
		// if(this.time<=0 || this.state == 'wavy'){
		// 	this.time = Math.floor(this.duration + this.durationVariation*Math.random())+this.delayBetween

			this.clear()
			this.draw()
			this.texture.needsUpdate = true
		// } else if(this.time<=this.delayBetween){
		// 	this.clear()
		// 	this.texture.needsUpdate = true
		// }
	}


	draw(){
		this.ctx.save()
		this.ctx.fillStyle = 'white'
		this.ctx.fillRect(0,0,this.size/2,this.size)
		this.ctx.restore()
		this.texture.needsUpdate = true
	}

	clear(){
		this.ctx.save()
		this.ctx.fillStyle = 'black'
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
		this.ctx.restore()
		this.texture.needsUpdate = true
	}

	auto(){
		this.state = 'auto'
	}

	manual(){
		this.state = 'manual'
		this.intensity = 0
	}

	standby(){
		this.state = 'standby'
	}

	cut(){
		this.state = 'standby'
		this.cutCount++
		this.shader.uniforms.intensity.value = (this.cutCount%2==0?1:-1)*.2
	}

	debug(){
		document.body.appendChild(this.canvas)
		this.canvas.style.zIndex = 10000
		this.canvas.style.position = 'absolute'
		this.canvas.style.top = 0
		this.canvas.style.left = 0
	}

	createGui(gui){
		const f = gui.addFolder('cutting')
		f.add(this,'activate')
		f.add(this,'constantTime',0,0.1)
		f.add(this.params.direction,'x',-1,1).step(0.001)
		f.add(this.params.direction,'y',-1,1).step(0.001)
		f.add(this.params,'intensity',0,30)
		f.add(this,'cut')
		f.add(this,'auto')
		f.add(this,'manual')
		f.add(this,'standby')
		f.open()
	}

}
module.exports = CuttingPass
