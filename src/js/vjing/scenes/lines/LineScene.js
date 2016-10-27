const stage = require('mnf/core/stage')
const stage3d = require('mnf/core/stage3d')
const Scene = require('mnf/core/Scene')
const audio = require('mnf/core/audio')
const gui = require('mnf/utils/gui')

const PathLine = require('vjing/lines/PathLine')
const createLines = require('vjing/lines/lineManager').createLines
const lights = require('vjing/lights')
const camera = require('vjing/camera')

const Tree = require('./Tree')
const Letter = require('./Letter')
const ifferent = require('./Text').ifferent
const irection = require('./Text').irection
const d = require('./Text').d
const dstroke = require('./Text').dstroke

class TitleScene extends Scene {

	constructor(){
		super()
		this.linesCount = 512
		this.lineDivision = 8
		this.line = createLines(512,8)
		this.mesh = this.line.mesh
		this.texture = this.line.texture
		this.geometry = this.line.geometry
		this.createDifferentPath()
		this.createCirclePath()
		this.createDDPath()
		this.createTreePath()
		this.createLineEye()
		this.createHeadPath()
		this.state = 'head'
		this.time = 0
		this.multiplicator = .5
		this.lineWidth = .5
		this.isPaused = false
		this.bySegmentTarget = PathLine.config.bySegment
		this.easingTarget = PathLine.config.easing
		this.createGUI()
	}

	onBeat=()=>{

	}


	onUpdate=(dt)=>{
		PathLine.config.easing += (this.easingTarget-PathLine.config.easing)*.02
		PathLine.config.bySegment += (this.bySegmentTarget-PathLine.config.bySegment)*.05
		this.mesh.material.uniforms.lineWidth.value += (this.lineWidth+audio.volume*audio.volume*audio.volume*this.multiplicator - this.mesh.material.uniforms.lineWidth.value)*.25
		if(this.mesh.customDepthMaterial){
			this.mesh.customDepthMaterial.uniforms.lineWidth.value = this.mesh.material.uniforms.lineWidth.value
		}
		this.time += dt / 500
		switch(this.state){
			case 'smile':{
				lights.targetAngle = 2.7
				if(!this.isPaused){
					for(let i = 0; i < this.linesCount; i++){
						this.linesSmile[i].update(dt)
					}
				}
				break
			}
			case 'circle' : {
				lights.targetAngle = 3
				if(!this.isPaused){
					for(let i = 0; i < this.linesCount; i++){
						this.lineCircle[i].update(dt)
					}
				}
				break
			}
			case 'tree': {
				lights.targetAngle = 2.6
				if(!this.isPaused){
					for(let i = 0; i < this.linesCount; i++){
						this.linesTree[i].update(dt)
					}
				}
				break
			}
			case 'eye': {
				if(!this.isPaused){
					for(let i = 0; i < this.linesCount; i++){
						this.linesEye[i].update(dt)
					}
				}
				break
			}
			case 'title':{
				if(!this.isPaused){
					for(let i = 0; i < this.linesCount; i++){
						this.differentPath[i].update(dt)
					}
				}
				break
			}
			case 'head':{
				if(!this.isPaused){
					for(let i = 0; i < this.linesCount; i++){
						this.lineHead[i].update(dt)
					}
				}
				break
			}
		}
	}

	createLineEye(){
		this.linesEye = []
		const left = require('vjing/obj/head/Head').left
		const right = require('vjing/obj/head/Head').right

		const generatePath = ()=>{
			const path = []

			if(Math.random()<.5){
				let start = left.clone()
				start.x += (Math.random()-.5)*.5
				start.y += (Math.random()-.5)*.5
				path.push(start)
				let d = 12+5*Math.random()
				path.push(new THREE.Vector3(-5-(Math.random()-.5)*5,14,d))
				path.push(new THREE.Vector3(-5-(Math.random()-.5)*15+10,20+Math.random()*30,d+(Math.random()-.5)*3))
			} else {
				let start = right.clone()
				start.x += (Math.random()-.5)*.5
				start.y += (Math.random()-.5)*.5
				path.push(start)
				let d = 12+5*Math.random()
				path.push(new THREE.Vector3(5+(Math.random()-.5)*5,14,d))
				path.push(new THREE.Vector3(5+(Math.random()-.5)*15+10,20+Math.random()*30,d+(Math.random()-.5)*3))
			}
			return path
		}

		for(let i=0; i < this.linesCount; i++){
			let path = generatePath()
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, path, 0,0 , false,1)
			this.linesEye.push(line)
		}
	}


	createDifferentPath(){
		this.differentPath = []
		let i=0
		for(i; i < this.linesCount*.3; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, ifferent, -100,330, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < this.linesCount*.6; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, irection, -110,170, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < this.linesCount*.7; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, d, -190,300, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < this.linesCount*.8; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, dstroke, -180,290, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < this.linesCount*.9; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, d, -205,140, false,1,4)
			this.differentPath.push(line)
		}

		for(i; i < this.linesCount; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, dstroke, -175,130, false,1,4)
			this.differentPath.push(line)
		}
	}

	createDDPath(){
		this.linesSmile = []
		let i = 0
		for(i; i < this.linesCount*.8; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, Letter["D"], 5,0,true,7)
			this.linesSmile.push(line)
		}
		for(i; i < this.linesCount*.9; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, Letter["."], -30,10,true,7)
			this.linesSmile.push(line)
		}
		for(i; i < this.linesCount; i++){
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, Letter["."], -30,55,true,7)
			this.linesSmile.push(line)
		}
	}

	createCirclePath(){
		this.lineCircle = []
		const generatePath = ()=>{
			const path = []
			for(let i = 0; i < 8; i++){
				let angle = i/8 * Math.PI * 2
				let radius = 20 + 30*Math.random()
				path.push(new THREE.Vector3(Math.cos(angle)*radius,Math.random()*2 + 1,Math.sin(angle)*radius))
			}
			return path
		}
		for(let i=0; i < this.linesCount; i++){

			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, generatePath(), 5,0)
			this.lineCircle.push(line)
		}
	}

	createHeadPath(){
		this.lineHead = []
		// const model = stage3d.models.animheadfull
		// const mesh = new THREE.Mesh(model)
		// const precision = 32
		// const raycaster = new THREE.Raycaster();
		// let intersection = null
		// const generatePath = (percent)=>{
		// 	const path = []
		// 	const y = (mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y)*percent + mesh.geometry.boundingBox.min.y
		// 	for(let i = 0; i < precision; i++){
		// 		let angle = i/precision * Math.PI * 2
		// 		raycaster.ray.origin.set(Math.cos(angle)*1000,y,Math.sin(angle)*1000)
		// 		raycaster.ray.direction.set(-Math.cos(angle),0,-Math.sin(angle))
		// 		intersection = raycaster.intersectObject(mesh,true)
		// 		if(intersection.length > 0){
		// 			path.push(intersection[0].point)
		// 		}
		// 	}
		// 	return path
		// }
		// let s = "["
		// for(let i=0; i < this.linesCount; i++){
		// 	let path =  generatePath(i/this.linesCount*.96+.02)
		// 	s+="["
		// 	for(let j = 0; j<path.length; j++){
		// 		s += "new THREE.Vector3("+path[j].x+","+path[j].y+","+path[j].z+")"
		// 		if(j!=path.length-1){
		// 			s+=','
		// 		}
		// 	}
		// 	s+="]"
		// 	if(i!=this.linesCount-1){
		// 		s+=","
		// 	}
		// 	let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, path, 0,15,true,2)
		// 	this.lineHead.push(line)
		// }
		// s+="]"
		// console.log(s)
		const paths = require('./model').head
		for(let i=0; i < this.linesCount; i++){
			let path = paths[i]
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, path, 0,15,true,2)
			this.lineHead.push(line)
		}

	}

	createTreePath(){
		this.tree = new Tree()
		this.linesTree = []
		for(let i=0; i < this.linesCount; i++){
			let angle = Math.PI*2* Math.random()
			let path = this.tree.generatePathFromAngle(angle)
			let line = new PathLine(i*this.lineDivision*4,this.lineDivision,this.texture, path, 5,0, false)
			this.linesTree.push(line)
		}
	}

	transitionIn(){
		stage3d.add(this.mesh)
		stage.onUpdate.add(this.onUpdate)
		audio.onBeat.add(this.onBeat)
		super.transitionIn()
	}
	transitionOut(){
		stage.onUpdate.remove(this.onUpdate)
		audio.onBeat.remove(this.onBeat)
		stage3d.remove(this.mesh)
		super.transitionOut()
	}

	toSmile = ()=>{this.state = 'smile'
		camera.smileMiddleViolent()
		PathLine.config.easing = 0.01
		this.easingTarget = .1
	}
	tocircle = ()=>{
		if(this.state=='smile'){
			camera.circleMiddlePeace()
		}
		this.state = 'circle'
	PathLine.config.easing = 0.01
	this.easingTarget = .1
	}
	toTree = ()=>{this.state = 'tree'
		camera.treeMiddlePeace()
		PathLine.config.easing = 0.01
		this.easingTarget = .1
	}
	toHead = ()=>{this.state = 'head'
		camera.treeMiddlePeace()
		PathLine.config.easing = 0.01
		this.easingTarget = .1
	}
	toEye = ()=>{
		this.state = 'eye'
		PathLine.config.easing = 0.01
		this.easingTarget = .1
	}
	toTitle = ()=>{
		this.state = 'title'
		this.easingTarget = .7
		this.bySegmentTarget = 7
		camera.titleMiddleViolent()

	}
	toSpace = ()=>{
		stage3d.control._phi = 3.1
		stage3d.control.radius = 10
		this.state = 'tree'
		this.easingTarget = .3
	}

	resetArray = (array)=>{
		for(let o of array){
			o.reset()
		}
	}
	reset = ()=>{
		this.resetArray(this.linesSmile)
		this.resetArray(this.linesTree)
		this.resetArray(this.lineHead)
		this.resetArray(this.lineCircle)
		this.resetArray(this.linesEye)
	}

	createGUI(){
		const f = gui.addFolder('lineBasic')
		f.add(this,'multiplicator',0,2)
		f.add(this,'lineWidth',0,4)
		f.add(this,'bySegmentTarget',0,40)
		f.add(this.mesh.geometry,'updateColor')
		f.add(this,'toSmile')
		f.add(this,'tocircle')
		f.add(this,'toTree')
		f.add(this,'toEye')
		f.add(this,'toTitle')
		f.add(this,'toSpace')
		f.add(this,'toHead')
		f.add(this,'isPaused')
		f.add(this,'reset')
		// f.open()
	}

}

module.exports = TitleScene
