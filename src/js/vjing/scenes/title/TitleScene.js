const stage = require('mnf/core/stage')
const stage3d = require('mnf/core/stage3d')
const Scene = require('mnf/core/Scene')
const audio = require('mnf/core/audio')
const gui = require('mnf/utils/gui')

const PathLine = require('./PathLine')
const Tree = require('./Tree')

const ifferent = require('./Text').ifferent
const irection = require('./Text').irection
const d = require('./Text').d
const dstroke = require('./Text').dstroke


class TitleScene extends Scene {

	constructor(){
		super()
		this.createDifferentPath()
		this.createCirclePath()
		this.createDDPath()
		this.createTreePath()
		this.time = 0
		this.state = 'mind'
	}

	toSmile = ()=>{this.state = 'smile'}
	tocircle = ()=>{this.state = 'circle'}
	toTree = ()=>{this.state = 'tree'}
	toEye = ()=>{this.state = 'eye'}
	toMind = ()=>{this.state = 'mind'}
	toSpace = ()=>{
		stage3d.control._phi = 3.1
		stage3d.control.radius = 10
		this.state = 'tree'
	}

	transitionIn(){
		super.transitionIn()
	}

	onUpdate=()=>{
		const v = 1 + .3*audio.volume
		depthMaterial.uniforms.lineWidth.value = materialGPU.uniforms.lineWidth.value
		this.time += dt / 500
		switch(this.state){
			case 'smile':{
				for(let i = 0; i < linesCount; i++){
					this.linesSmile[i].update(dt)
				}
				break
			}
			case 'circle' : {
				for(let i = 0; i < linesCount; i++){
					this.lineCircle[i].update(dt)
				}
				break
			}
			case 'tree': {
				for(let i = 0; i < linesCount; i++){
					this.linesTree[i].update(dt)
				}
				break
			}
			case 'eye': {
				for(let i = 0; i < linesCount; i++){
					this.linesEye[i].update(dt)
				}
				break
			}
			case 'mind':{
				for(let i = 0; i < linesCount; i++){
					this.linesDifferents[i].update(dt)
				}
				break
			}
		}
	}

	onBeat=()=>{

	}

	transitionOut(){
		super.transitionOut()
	}

	dispose(){
		stage3d.remove(sky)
	}

	createDifferentPath(){
		this.differentPath = []
		for(i=0; i < linesCount*.4; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, ifferent, -100,330, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < linesCount*.8; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, irection, -110,170, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < linesCount*.85; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, d, -190,300, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < linesCount*.9; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, dstroke, -180,290, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < linesCount*.95; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, d, -205,140, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < linesCount; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, dstroke, -175,130, false,1,4)
			this.differentPath.push(line)
		}
	}

	createDDPath(){
		this.linesSmile = []
		let i = 0
		for(i; i < linesCount*.8; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, Letter["D"], 5,0)
			this.linesSmile.push(line)
		}
		for(i; i < linesCount*.9; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, Letter["."], -20,5)
			this.linesSmile.push(line)
		}
		for(i; i < linesCount; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, Letter["."], -20,35)
			this.linesSmile.push(line)
		}
	}

	createCirclePath(){
		this.lineCircle = []
		for(i=0; i < linesCount; i++){
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, Letter["D"], 5,0)
			this.lineCircle.push(line)
		}
	}

	createTreePath(){
		this.tree = new Tree()
		this.linesTree = []
		for(i=0; i < linesCount; i++){
			let angle = Math.PI*2* Math.random()
			let path = this.tree.generatePathFromAngle(angle)
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, path, 5,0, false)
			this.linesTree.push(line)
		}
	}

	createLineEye(){
		this.linesEye = []
		const left = require('vjing/obj/head').left
		const right = require('vjing/obj/head').right

		const generatePath = ()=>{
			const path = []

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

		for(i=0; i < linesCount; i++){
			let path = generatePath()
			let line = new PathLine(i*lineDivision*4,lineDivision,texture, path, 0,0 , false,1)
			this.linesEye.push(line)
		}
	}

	createGUI(){
		gui.add(o,'toSmile')
		gui.add(o,'tocircle')
		gui.add(o,'toTree')
		gui.add(o,'toEye')
		gui.add(o,'toMind')
		gui.add(o,'toSpace')
		gui.add(geometryGPU,'updateColor')
		gui.add(o, 'toSpace')
	}

}

module.exports = TitleScene
