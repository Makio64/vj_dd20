const OrbitControl = require( "mnf/3d/OrbitControl" )
const stage3d = require( "mnf/core/stage3d" )
const stage = require( "mnf/core/stage" )
const gui = require( "mnf/utils/gui" )

const sceneTraveler = require( "mnf/core/sceneTraveler" )
const Scenes        = require('vjing/Scenes')
const postprocess   = require('vjing/postprocess/manager')
const audio 		= require('mnf/core/audio')
const camera		= require('vjing/camera.js')
const lights		= require('vjing/lights.js')
const keyboard 		= require('mnf/utils/keyboard.js')

const Sky = require('vjing/obj/sky/Sky')

class Main {

	constructor() {
		stage3d.control = new OrbitControl(stage3d.camera,null,500)
		stage3d.control._phi = Math.PI/2
		stage3d.control._theta = Math.PI/2
		stage3d.renderer.shadowMap.enabled = true
		stage3d.renderer.shadowMap.type = THREE.PCFSoftShadowMap
		stage3d.renderer.gammaInput = false
		stage3d.renderer.gammaOutput = false
		stage3d.renderer.shadowMap.renderReverseSided = false
		// stage3d.scene.fog = new THREE.Fog( 0, 400, 800)

		//------------------------------------------------------------------------------ LIGHTS
		this.sky = new Sky()
		this.shadowGround = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(3000,3000,1,1),
			new THREE.ShadowMaterial())
		this.shadowGround.rotation.x = - Math.PI/2
		this.shadowGround.receiveShadow = true
		// this.shadowGround.material.side = THREE.DoubleSide
		this.shadowGround.transparent = true
		this.shadowGround.opacity = .1

		stage3d.add(this.sky)
		stage3d.add(this.shadowGround)
		//------------------------------------------------------------------------------ Camera control

		this.loadCount = 2
		this.loaded = 0

		const loader = new THREE.JSONLoader()
		loader.load('animhead.json',(geometry)=>{
			geometry.computeVertexNormals()
			geometry.computeBoundingSphere()
			geometry.computeBoundingBox()
			stage3d.models.animhead = geometry
			this.onModelLoaded()
		})

		const loader2 = new THREE.JSONLoader()
		loader2.load('animheadfull.json',(geometry)=>{
			geometry.computeVertexNormals()
			geometry.computeBoundingSphere()
			geometry.computeBoundingBox()
			stage3d.models.animheadfull = geometry
			this.onModelLoaded()
		})
	}

	onModelLoaded = ()=>{
		this.loaded++
		if(this.loaded == this.loadCount){
			audio.start({live:true,playlist:['audio/galvanize.mp3','audio/doitagain.mp3','audio/getlucky.mp3'
			],onLoad:()=>{
				Scenes.init()
				camera.init()
				this.showHead = false
				this.showLine = false
				// Scenes.line.transitionIn()
				// Scenes.head.transitionIn()
				this.createGUI()
				keyboard.down.add(this.onKey)
			}})
		}
	}

	onKey = (e)=>{
		console.log(e)
		switch(e){
			case 81:{
				this.sky.start()
				break
			}
			case 87:{//w
				if(!this.showLine){
					this.showLine = true
					Scenes.line.transitionIn()
				}
				break
			}
			case 69:{//e
				Scenes.line.toSmile()
				break
			}
			case 82:{//e
				Scenes.line.tocircle()
				break
			}
			case 84:{//e
				Scenes.line.toTitle()
				break
			}
			case 89:{//e
				Scenes.line.toTree()
				break
			}
			case 85:{//e

				break
			}
			case 73:{//e
				break
			}
			case 90:{//e
				this.sky.randomColorTween()
				break
			}
			case 88:{//e
				Scenes.line.mesh.geometry.updateColor()
				break
			}
		}
	}

	createGUI(){
		const f = gui.addFolder('scenes')
		f.add(this,'showHead').onChange((v)=>{
			if(v){
				Scenes.head.transitionIn()
			}else{
				Scenes.head.transitionOut()
			}
		})
		f.add(this,'showLine').onChange((v)=>{
			if(v){
				Scenes.line.transitionIn()
			}else{
				Scenes.line.transitionOut()
			}
		})
		f.open()
	}
}

module.exports = Main

//------------------------------------------------------------------------------ REQUIRE
