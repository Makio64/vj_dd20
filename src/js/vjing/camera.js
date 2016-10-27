const stage3d = require( "mnf/core/stage3d" )
const stage = require( "mnf/core/stage" )
const gui = require( "mnf/utils/gui" )
const audio = require( 'mnf/core/audio' )
const random = require( 'mnf/utils/random' )

class Camera {
	constructor() {
		this.state = 'none'
		this.baseRadius = 1000
	}

	init(){
		this.createGUI()
		stage.onUpdate.add(this.onUpdate)
		audio.onBeat.add(this.onBeat)
		this.phiMin = 1
		this.phiMax = 1.5
		this.thetaMin = 1
		this.thetaMax = 2
		this.radiusMin = 100
		this.radiusMax = 400
		this.phiSpeedMax = 0.0
		this.thetaSpeedMax = 0.0
	}

	headZoom(){
		this.phiMin = 1
		this.phiMax = 1.5
		this.thetaMin = Math.PI/2
		this.thetaMax = Math.PI/2
		this.radiusMin = 150
		this.radiusMax = 200
		this.state = 'violent'
		stage3d.control.offset.y = 25
		this.phiSpeed = 0.01
		this.thetaSpeed = 0.02
	}

	headMiddle(){
		this.phiMin = 1
		this.phiMax = 1.5
		this.thetaMin = Math.PI/2
		this.thetaMax = Math.PI/2
		this.radiusMin = 300
		this.radiusMax = 500
		this.state = 'violent'
		stage3d.control.offset.y = 25
		this.phiSpeed = 0.04
		this.thetaSpeed = 0.04
		this.phiSpeedMax = 0.01
		this.thetaSpeedMax = 0.02

	}

	treeMiddleViolent(){
		this.phiMin = Math.PI/2.1
		this.phiMax = Math.PI/2
		this.thetaMin = 0
		this.thetaMax = Math.PI*2
		this.radiusMin = 500
		this.radiusMax = 700
		this.state = 'violent'
		stage3d.control.offset.y = 80
		this.phiSpeedMax = 0.0
		this.thetaSpeedMax = 0.02
		this.phiSpeed = 0.005
		this.thetaSpeed = 0.01
	}


	treeMiddlePeace(){
		this.phiMin = Math.PI/2.1
		this.phiMax = Math.PI/2
		this.thetaMin = 0
		this.thetaMax = Math.PI*2
		this.radiusMin = 500
		this.radiusMax = 700
		this.state = 'peace'
		stage3d.control.offset.y = 100
		this.phiSpeedMax = 0.0
		this.thetaSpeedMax = 0.1
		this.phiSpeed = 0.0
		this.thetaSpeed = 0.01
		stage3d.control.radius = stage3d.control._radius = random.between(this.radiusMin, this.radiusMax)
	}


			titleMiddleViolent(){
				this.phiMin = Math.PI/2.1
				this.phiMax = Math.PI/2
				this.thetaMin = Math.PI*0.4
				this.thetaMax = Math.PI*0.6
				this.radiusMin = 700
				this.radiusMax = 1200
				this.state = 'violent'
				stage3d.control.offset.y = 150
				this.phiSpeedMax = 0.0
				this.thetaSpeedMax = 0.02
				this.phiSpeed = 0.005
				this.thetaSpeed = 0.01
			}

		smileMiddleViolent(){
			this.phiMin = Math.PI/2.1
			this.phiMax = Math.PI/2
			this.thetaMin = Math.PI*0.4
			this.thetaMax = Math.PI*0.6
			this.radiusMin = 300
			this.radiusMax = 500
			this.state = 'violent'
			stage3d.control.offset.y = 15
			this.phiSpeedMax = 0.0
			this.thetaSpeedMax = 0.02
			this.phiSpeed = 0.005
			this.thetaSpeed = 0.01
		}


		smileMiddlePeace(){
			this.phiMin = Math.PI/2.1
			this.phiMax = Math.PI/2
			this.thetaMin = Math.PI*0.4
			this.thetaMax = Math.PI*0.6
			this.radiusMin = 300
			this.radiusMax = 500
			this.state = 'peace'
			stage3d.control.offset.y = 15
			this.phiSpeedMax = 0.0
			this.thetaSpeedMax = 0.02
			this.phiSpeed = 0
			this.thetaSpeed = 0.001
			stage3d.control.radius = stage3d.control._radius = random.between(this.radiusMin, this.radiusMax)
		}

		circleMiddlePeace(){
			this.phiMin = 1.1
			this.phiMax = 1.4
			this.thetaMin = .1
			this.thetaMax = Math.PI*0.6
			this.radiusMin = 600
			this.radiusMax = 1000
			this.state = 'peace'
			stage3d.control.offset.y = 20
			this.phiSpeedMax = 0.0
			this.thetaSpeedMax = 0.02
			this.phiSpeed = 0
			this.thetaSpeed = 0.001
			stage3d.control._phi = random.between(this.phiMin,this.phiMax)
			stage3d.control._theta = random.between(this.thetaMin,this.thetaMax)

			stage3d.control.radius = stage3d.control._radius = random.between(this.radiusMin, this.radiusMax)
		}

	treeFarViolent(){
		this.phiMin = Math.PI/2.1
		this.phiMax = Math.PI/2
		this.thetaMin = 0
		this.thetaMax = Math.PI*2
		this.radiusMin = 900
		this.radiusMax = 1700
		this.state = 'violent'
		stage3d.control.offset.y = 80
		this.phiSpeedMax = 0.0
		this.thetaSpeedMax = 0.01
		this.phiSpeed = 0.005
		this.thetaSpeed = 0.01
	}


	treeFarPeace(){
		this.phiMin = Math.PI/2.1
		this.phiMax = Math.PI/2
		this.thetaMin = 0
		this.thetaMax = Math.PI*2
		this.radiusMin = 1500
		this.radiusMax = 1700
		this.state = 'peace'
		stage3d.control.offset.y = 80
		this.phiSpeedMax = 0.0
		this.thetaSpeedMax = 0.1
		this.phiSpeed = 0.0
		this.thetaSpeed = 0.01
		stage3d.control.radius = stage3d.control._radius = random.between(this.radiusMin, this.radiusMax)
	}

	onBeat = ()=>{
		if(this.state == 'none'){
			return
		} else if(this.state == 'violent') {
			stage3d.control._phi = random.between(this.phiMin,this.phiMax)
			stage3d.control._theta = random.between(this.thetaMin,this.thetaMax)
			stage3d.control.radius = stage3d.control._radius = random.between(this.radiusMin, this.radiusMax)
			this.phiSpeed = random.between(-this.phiSpeedMax,this.phiSpeedMax)
			this.thetaSpeed = random.between(-this.thetaSpeedMax,this.thetaSpeedMax)
		} else if(this.state == 'peace'){

		}
	}

	onUpdate = (dt)=>{
		if(this.state == 'none'){
			return
		}
		stage3d.control._vy = this.phiSpeed
		stage3d.control._vx = this.thetaSpeed
	}

	createGUI(){
		const guiCamera = gui.addFolder('camera')
		guiCamera.add(stage3d.control.offset,'y',0,200)
		guiCamera.add(stage3d.control.offset,'x',-200,200)
		guiCamera.add(stage3d.control,'radius',0,40000)
		guiCamera.add(this,'headZoom')
		guiCamera.add(this,'headMiddle')
		guiCamera.add(this,'treeMiddleViolent')
		guiCamera.add(this,'treeMiddlePeace')
		guiCamera.add(this,'treeFarViolent')
		guiCamera.add(this,'treeFarPeace')
		guiCamera.add(this,'smileMiddleViolent')
		guiCamera.add(this,'smileMiddlePeace')
		guiCamera.add(this,'titleMiddleViolent')
		guiCamera.add(this,'circleMiddlePeace')
		guiCamera.open()
	}
}

module.exports = new Camera()
