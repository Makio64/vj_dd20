const stage = require('mnf/core/stage')
const stage3d = require('mnf/core/stage3d')
const gui = require('mnf/utils/gui')

class Lights {

	constructor(){
		this.ambient = new THREE.AmbientLight(0x404040)
		this.spotLight = new THREE.SpotLight( 0xffffff )
		this.spotLight.name = 'Spot Light'
		this.targetAngle = this.spotLight.angle = 2.6
		this.spotLight.penumbra = 1
		this.spotLight.distance = 5000
		this.spotLight.position.set( 0, 600, 340 );
		this.spotLight.lookAt( new THREE.Vector3() )
		this.spotLight.castShadow = true;
		this.spotLight.shadow.mapSize.width = 1024;
		this.spotLight.shadow.mapSize.height = 1024;
		this.spotLight.shadow.camera.near = 8;
		this.spotLight.shadow.camera.far = 5000;
		this.spotLight.shadow.bias = -0.01
		stage3d.add(this.spotLight.target)
		this.spotLight.target.y = 100
		this.helper = new THREE.CameraHelper( this.spotLight.shadow.camera )
		// stage3d.add( this.helper );
		this.spotLightTarget = new THREE.Vector3()
		stage3d.add(this.ambient)
		stage3d.add(this.spotLight)
		stage.onUpdate.add(this.onUpdate)

		this.createGUI()
	}

	onUpdate = (dt)=>{
		this.helper.update(dt)
		this.spotLight.angle += (this.targetAngle-this.spotLight.angle)*.1
	}

	createGUI(){
		// const lights = gui.addFolder('lights')
		const guispot = gui.addFolder('spotlight')
		guispot.add(this.spotLight,'angle',0,Math.PI*2)
		guispot.add(this.spotLight,'penumbra',0,1)
		guispot.add(this.spotLight,'intensity',0,1)
		guispot.add(this.spotLight,'decay',0,2000)
		guispot.add(this.spotLight.shadow.camera,'near',0,)
		guispot.add(this.spotLight.shadow.camera,'far',0,4000)
		guispot.add(this.spotLight,'distance',0,3000)
		guispot.add(this.spotLight.position,'y',0,1000).onChange(()=>this.spotLight.lookAt(this.spotLightTarget))
		guispot.add(this.spotLight.position,'z',0,1000).onChange(()=>this.spotLight.lookAt(this.spotLightTarget))
		guispot.add(this.spotLight.target.position,'x',0,1000).name('target x').onChange(()=>this.spotLight.lookAt(this.spotLight.target))
		guispot.add(this.spotLight.target.position,'y',0,1000).name('target y').onChange(()=>this.spotLight.lookAt(this.spotLight.target))
		guispot.add(this.spotLight.target.position,'z',0,1000).name('target z').onChange(()=>this.spotLight.lookAt(this.spotLight.target))

	}


}

module.exports = new Lights()
