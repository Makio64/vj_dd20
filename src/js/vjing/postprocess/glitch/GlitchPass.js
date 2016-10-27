const WAGNER = require('WAGNER')
const fs = require('./glitch.fs')
const vs = require('./glitch.vs')

const random = require('mnf/utils/random')
const stage = require('mnf/core/stage')
const toStringRGB = require('mnf/utils/colors').toStringRGB

class GlitchPass extends WAGNER.Pass{

	// Time in ms
	constructor(size = 256, duration = 20, delayBetween = 0, durationVariation=0){
		super()
		this.size = size
		this.duration = duration
		this.delayBetween = 0
		this.durationVariation = durationVariation
		this.time = this.duration
		this.rTime = 0
		this.canvas = document.createElement('canvas')
		this.canvas.width = this.size
		this.canvas.height = this.size
		this.ctx = this.canvas.getContext('2d')

		this.state = 'fullline'

		this.texture = new THREE.Texture(
			this.canvas,
			THREE.UVMapping,
			THREE.RepeatWrapping,
			THREE.RepeatWrapping,
			THREE.NearestFilter,
			THREE.NearestFilter,
			THREE.LuminanceFormat
		)
		this.texture.needsUpdate = true
		this.texture.generateMipmaps = false
		this.params.glitchMap = this.texture
		this.params.glitchResolution  = new THREE.Vector2(this.size,this.size)

		this.shader = WAGNER.processShader( vs, fs )

		this.shader.uniforms.glitchMap.value = this.texture

		this.normal()
		// this.debug()

		stage.onUpdate.add(this.update)
	}

	createGui(gui){
		const f = gui.addFolder('glitch')
		f.add(this,'activate')
		f.add(this,'intensity',0,0.03)
		f.add(this,'minHeight',1,this.size).step(1)
		f.add(this,'maxHeight',1,this.size).step(1)
		f.add(this,'minWidth',0,this.size).step(1)
		f.add(this,'maxWidth',0,this.size).step(1)
		f.add(this,'glitchCount',0,50).step(1)
		f.add(this,'delayBetween',0,100).step(1)
		f.add(this,'duration',0,100).step(1)
		f.add(this,'kick')
		f.add(this,'kickWav')
		f.add(this,'normal')
		f.add(this,'big')
		f.add(this,'cubic')
		// f.open()

	}

	update = (dt)=>{
		this.rTime += dt
		this.time -= dt
		this.shader.uniforms.intensity.value = this.intensity
		if(this.time<=0 || this.state == 'wavy'){
			this.time = Math.floor(this.duration + this.durationVariation*Math.random())+this.delayBetween
			this.clear()
			this.draw()
			this.texture.needsUpdate = true
		} else if(this.time<=this.delayBetween){
			this.clear()
			this.texture.needsUpdate = true
		}
	}

	draw(){
		let w,h,x,y,gradient
		switch(this.state){
			case 'classic':{
				for(let i = 0; i < this.glitchCount; i++){

					// DRAW HORIZONTAL GLITCH
					w = random.between( this.minWidth, this.maxWidth )
					h = random.between( this.minHeight, this.maxHeight )
					w = Math.floor(w)
					h = Math.floor(h)

					x = Math.floor(random.between(-w,this.size))
					y = Math.floor(random.between(-h,this.size))

					this.ctx.save()
					gradient = this.ctx.createLinearGradient(x,0,x+w,0)
					gradient.addColorStop(0, "rgba(0,0,0,1)")
					gradient.addColorStop(1, "rgba(256,256,256,1)")
					this.ctx.fillStyle = gradient
					this.ctx.fillRect(x,y,w,h)
					this.ctx.restore()
				}
				break
			}
			case 'fullline':{
				let y = 0,r
				while(y < this.size){
					h = Math.floor(random.between( this.minHeight, this.maxHeight ))
					this.ctx.save()
					r = Math.floor(Math.random()*0xFF)
					this.ctx.fillStyle = toStringRGB({r:r,g:r,b:r})
					this.ctx.fillRect(0,y,this.size,h)
					this.ctx.restore()
					y += h
				}
				break
			}
			case 'wavy':{
				let y = 0,r
				console.log(this.time)
				while(y < this.size){
					h = 1
					this.ctx.save()
					r = Math.floor(Math.cos(this.rTime/30+y*0.1)*128+127)
					this.ctx.fillStyle = toStringRGB({r:r,g:r,b:r})
					this.ctx.fillRect(0,y,this.size,h)
					this.ctx.restore()
					y += h
				}
				break
			}
		}
	}

	clear(){
		this.ctx.save()
		const r = 128
		this.ctx.fillStyle = toStringRGB({r:r,g:r,b:r})
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
		this.ctx.restore()
	}

	normal = ()=>{
		this.resize(512)
		this.state = 'classic'
		this.minHeight=1
		this.maxHeight=3
		this.minWidth=this.size/2
		this.maxWidth=this.size
		this.glitchCount=2
		this.intensity=0.5
		this.delayBetween= 0
		this.duration = 25
	}

	big = ()=>{
		this.resize(128)
		this.state = 'classic'
		this.minHeight=this.size/4
		this.maxHeight=this.size/4
		this.minWidth=this.size/2
		this.maxWidth=this.size
		this.glitchCount=1
		this.intensity=0.8
		this.delayBetween= 0
		this.duration = 25
	}

	cubic = ()=>{
		this.resize(512)
		this.state = 'classic'
		this.minHeight=18
		this.maxHeight=24
		this.minWidth=this.size
		this.maxWidth=this.size
		this.glitchCount=50
		this.intensity=0.02
		this.delayBetween= 100
		this.duration= 50
	}
	kick = ()=>{
		this.resize(256)
		this.state = 'fullline'
		this.intensity = 0.1
		this.minHeight=1
		this.maxHeight=3
		this.delayBetween= 0
		this.duration = 25
		TweenMax.to(this,.8,{ease:Elastic.easeOut,intensity:0.0,onComplete:this.normal})
	}

	kickWav = ()=>{
		this.resize(256)
		this.state = 'wavy'
		this.intensity = 0.5
		this.delayBetween= 0
		this.duration = 25
		TweenMax.to(this,.8,{ease:Quad.easeOut,intensity:0.0,onComplete:this.normal})
	}

	resize = (size)=>{
		this.size = size
		this.canvas.width = this.size
		this.canvas.height = this.size
		this.clear()
	}

	debug(){
		document.body.appendChild(this.canvas)
		this.canvas.style.zIndex = 10000
		this.canvas.style.position = 'absolute'
		this.canvas.style.top = 0
		this.canvas.style.left = 0
	}
}
module.exports = GlitchPass
