const stage = require('mnf/core/stage')
const stage3d = require('mnf/core/stage3d')

const GlitchPass = require('./glitch/GlitchPass')
const CuttingPass = require('./cutting/CuttingPass')
const VjingPass = require('./vjing/VjingPass')
const gui = require('mnf/utils/gui')
const audio = require('mnf/core/audio')

class PostProcess {

	constructor(){
		stage3d.initPostProcessing()

		this.bloomPass = new WAGNER.MultiPassBloomPass(256,256)
		this.bloomPass.params.applyZoomBlur = false
		this.bloomPass.params.blurAmount = .9

		this.bloomPass2 = new WAGNER.MultiPassBloomPass(256,256)
		this.bloomPass2.params.applyZoomBlur = true
		this.bloomPass2.params.zoomBlurStrength = .1
		this.bloomPass2.params.blurAmount = 1

		this.fxaa = new WAGNER.FXAAPass()
		this.glitch = new GlitchPass()
		this.cutting = new CuttingPass()
		this.vjing = new VjingPass()

		stage3d.addPass(this.bloomPass)
		stage3d.addPass(this.bloomPass2)
		stage3d.addPass(this.glitch)
		stage3d.addPass(this.cutting)
		stage3d.addPass(this.vjing)
		// stage3d.addPass(this.fxaa)

		// this.bloomPass.activate = false
		// this.bloomPass2.activate = false
		// this.glitch.activate = false
		// this.cutting.activate = false
		// this.vjing.activate = false

		this.createGui()
		stage.onUpdate.add(this.onUpdate)
	}

	onUpdate = ()=>{
		this.bloomPass2.params.zoomBlurStrength += ((audio.volume+.1) - this.bloomPass2.params.zoomBlurStrength)*.15
	}

	createGui(){
		const f = gui.addFolder('postprocess')

		const bloom1 = f.addFolder('bloom1')
		bloom1.add(this.bloomPass,'activate')
		bloom1.add(this.bloomPass.params,'zoomBlurStrength',0,1)
		bloom1.add(this.bloomPass.params,'blurAmount',0,1)

		const bloom2 = f.addFolder('bloom2')
		bloom2.add(this.bloomPass2,'activate')
		bloom2.add(this.bloomPass2.params,'zoomBlurStrength',0,1)
		bloom2.add(this.bloomPass2.params,'blurAmount',0,1)

		this.glitch.createGui(f)
		this.cutting.createGui(f)
		this.vjing.createGui(f)

		const fxaa = f.addFolder('fxaa')
		fxaa.add(this.fxaa,'activate')

		// f.open()

	}

}

module.exports = new PostProcess()
