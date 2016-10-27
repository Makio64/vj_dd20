const stage = require("mnf/core/stage")
const stage3d = require("mnf/core/stage3d")
const audio = require("mnf/core/audio")
const gui = require('mnf/utils/gui')

class Grass extends THREE.Group {

  constructor(){

  }

  createGUI(){
	  const f = gui.addFolder('sky')
	  f.add(this,'randomColor')
	  f.add(this,'randomColorTween')
	  f.add(this.material.uniforms.brightness,'value',0,1.2)
	//   f.open()
  }

}

module.exports = Grass
