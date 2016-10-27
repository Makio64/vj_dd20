const stage = require("mnf/core/stage")
const stage3d = require("mnf/core/stage3d")
const gui = require('mnf/utils/gui')

class Sky extends THREE.Group {

  constructor(){
    const geometry = new THREE.IcosahedronBufferGeometry(1,3)
    const material = new THREE.ShaderMaterial({
            vertexShader: require('./Sky.vs'),
            fragmentShader: require('./Sky.fs'),
            uniforms: {
				color1:{type:'v3', value:new THREE.Color(0xFFFFFF*Math.random())},
				color2:{type:'v3', value:new THREE.Color(0xFFFFFF*Math.random())},
				color3:{type:'v3', value:new THREE.Color(0xFFFFFF*Math.random())},
				brightness:{type:'f',value:.6}
			},
            side:THREE.BackSide
    });
	super()
	this.material = material
    this.add(new THREE.Mesh(geometry,material))
	// let wireframe = new THREE.Mesh(geometry,material.clone())
	//  	wireframe.scale.multiplyScalar(1.1)
	// 	wireframe.material.wireframe = true
	// this.add(wireframe)
	this.scale.multiplyScalar(10000)
	this.createGUI()
  }

  randomColor(){
	  this.material.uniforms.color1.value.set(0xFFFFFF*Math.random())
	  this.material.uniforms.color2.value.set(0xFFFFFF*Math.random())
	  this.material.uniforms.color3.value.set(0xFFFFFF*Math.random())
  }

  randomColorTween(){
	  const c1 = {r:this.material.uniforms.color1.value.r,g:this.material.uniforms.color1.value.g,b:this.material.uniforms.color1.value.b}
	  const c2 = {r:this.material.uniforms.color2.value.r,g:this.material.uniforms.color2.value.g,b:this.material.uniforms.color2.value.b}
	  const c3 = {r:this.material.uniforms.color3.value.r,g:this.material.uniforms.color3.value.g,b:this.material.uniforms.color3.value.b}

	 TweenMax.to(c1,2.5,{r:Math.random(),g:Math.random(),b:Math.random()})
	 TweenMax.to(c2,2.5,{r:Math.random(),g:Math.random(),b:Math.random()})
	 TweenMax.to(c3,2.5,{r:Math.random(),g:Math.random(),b:Math.random(),onUpdate:()=>{
		 this.material.uniforms.color1.value.setRGB(c1.r,c1.g,c1.b)
		 this.material.uniforms.color2.value.setRGB(c2.r,c2.g,c2.b)
		 this.material.uniforms.color3.value.setRGB(c3.r,c3.g,c3.b)
	 }})
  }

  createGUI(){
	  const f = gui.addFolder('sky')
	  f.add(this,'randomColor')
	  f.add(this,'randomColorTween')
	  f.add(this.material.uniforms.brightness,'value',0,1.2)
	//   f.open()	
  }

}

module.exports = Sky
