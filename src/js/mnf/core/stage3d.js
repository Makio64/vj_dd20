//
// Wrapper for requestAnimationFrame, Resize & Update
// this.author : David Ronai / this.Makio64 / makiopolis.com
//

const Signals = require("mnf/events/Signals")
const stage = require("mnf/core/stage")

//------------------------
class Stage3d{

	constructor(){
		this.models =	{}
		this.camera 	= null
		this.scene 		= null
		this.renderer 	= null
		this.usePostProcessing 		= false
		this.passes 				= []
		this.isActivated 			= false
		this.clearAlpha				= 1

		this.onBeforeRenderer = new Signals()

		let w = stage.width
		let h = stage.height

		this.camera = new THREE.PerspectiveCamera( 50, w / h, 1, 1000000 )
		this.scene = new THREE.Scene()

		const attributes = { alpha:true, antialias:false, preserveDrawingBuffer:true, logarithmicDepthBuffer:true }

		this.resolution = new THREE.Vector2(1, h/w)
		this.renderer = new THREE.WebGLRenderer( attributes )
		this.renderer.setPixelRatio( 1 )
		this.renderer.domElement.className = 'three'
		this.renderer.setSize( w, h )
		this.renderer.setClearColor( 0, 1 )

		stage.onUpdate.add(this.render)
		stage.onResize.add(this.resize)
		document.body.appendChild(this.renderer.domElement)
	}

	initPostProcessing = ()=>{
		this.composer = new WAGNER.Composer( this.renderer, {useRGBA: false} )
		this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height )
		this.usePostProcessing = true
	}

	add = (obj)=>{
		this.scene.add(obj)
	}

	remove = (obj)=>{
		this.scene.remove(obj)
	}

	getObjectByName = ( name )=>{
		return this.scene.getObjectByName( name )
	}

	addPass = (pass)=>{
		this.passes.push(pass)
	}

	render = (dt)=> {
		if(this.control){
			this.control.update(dt)
		}
		this.onBeforeRenderer.dispatch()
		if(this.usePostProcessing){
			this.composer.reset()
			this.composer.render( this.scene, this.camera )

			const passActivate = []
			for( let i = 0, n = this.passes.length; i < n; i++ ) {
				let pass = this.passes[ i ]
				if(pass.activate){
					passActivate.push(pass)
				}
			}

			for( let i = 0, n = passActivate.length-1; i < n; i++ ) {
				let pass = passActivate[ i ]
				this.composer.pass( pass )
			}

			if(passActivate.length>0){
				this.composer.toScreen( passActivate[passActivate.length-1] )
			}

		}
		else{
			this.renderer.render(this.scene, this.camera)
		}
	}

	resize = ()=>{
		this.camera.aspect = stage.width / stage.height
		this.camera.updateProjectionMatrix()
		this.renderer.setSize( stage.width, stage.height )
		this.renderer.setPixelRatio( 1 )
		this.resolution = new THREE.Vector2(1, stage.height/stage.width)

		this.render(0)
		if(this.composer){
			this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height )
		}
	}
}

module.exports = new Stage3d()
