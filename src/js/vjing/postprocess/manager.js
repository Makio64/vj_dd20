const stage = require('mnf/core/stage')
const stage3d = require('mnf/core/stage3d')

const GlitchPass = require('./glitch/GlitchPass')
const CuttingPass = require('./cutting/CuttingPass')
const VjingPass = require('./vjing/VjingPass')
const gui = require('mnf/utils/gui')
const keyboard = require('mnf/utils/keyboard')
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
		keyboard.down.add(this.onKey)
		stage.onUpdate.add(this.onUpdate)
	}

	onKey = (e)=>{
		switch(e){
			case 49:{
				this.bloomPass.activate = !this.bloomPass.activate
				break
			}
			case 50:{//w
				this.bloomPass2.activate = !this.bloomPass2.activate
				break
			}
			case 51:{//e
				this.glitch.cubic()
				break
			}
			case 52:{//e
				this.glitch.kick()
				break
			}
			case 53:{//e
				this.glitch.big()
				break
			}
			case 54:{//e
				this.glitch.normal()
				break
			}
			case 55:{//e
				this.cutting.cut()
				break
			}
			case 56:{//e
				this.cutting.manual()
				break
			}
			case 57:{//e
				this.vjing.params.divide4 = this.vjing.params.divide4==0?1:0
				break
			}
			case 48:{//e
				this.vjing.params.bw = this.vjing.params.bw==1?0:1
				break
			}
		}
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
