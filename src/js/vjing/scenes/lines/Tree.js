const rootXSpeed = .5
const rootYSpeed = 5
const rootZSpeed = .5

const branchXSpeed = 3
const branchYSpeed = .5
const branchZSpeed = 3

const randomBetween = require('mnf/utils/random').between

class Tree {

	constructor(){
		// this.branchs = []
		// this.root = this.generateBranch(new THREE.Vector3(),2,true)
	}

	generatePathFromAngle(angle){
		const path = []
		const rootRadius = 15+Math.random()*20
		const trunkRadius = 3
		path.push( new THREE.Vector3(Math.cos(angle)*rootRadius,0, Math.sin(angle)*rootRadius) )
		path.push( new THREE.Vector3(Math.cos(angle)*trunkRadius,0, Math.sin(angle)*trunkRadius) )
		let h = 20+Math.random()*60
		path.push( new THREE.Vector3(Math.cos(angle)*trunkRadius*.5,h, Math.sin(angle)*trunkRadius*.5) )
		path.push( new THREE.Vector3(Math.cos(angle)*(20+Math.random()*10),h*1.2, Math.sin(angle)*(20+Math.random()*10)) )
		return path
	}
}


module.exports = Tree
