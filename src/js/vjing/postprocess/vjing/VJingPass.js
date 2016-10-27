const stage = require( "mnf/core/stage" )
const stage3d = require( "mnf/core/stage3d" )
const gui = require( "mnf/utils/gui" )
const midi = require( "mnf/midi/midi" )

class PostProcessPass extends WAGNER.Pass {

	constructor() {
		super()

		this.shader = WAGNER.processShader( WAGNER.basicVs, require( "./vjing.fs" ) )
		this.mapUniforms( this.shader.uniforms )

		this.params.gamma = 1
		this.params.contrast = 1
		this.params.brightness = 0
		this.params.mirrorX = 0;
		this.params.mirrorY = 0;
		this.params.divide4 = 0;
		this.params.vignetteFallOff = .05;
		this.params.vignetteAmount = .38;
		this.params.invertRatio = 0;
		this.params.boost = 1.
		this.boostTarget = 1.
		this.bw = 0;

		if(midi.xl){
			midi.xl.add(this.params,'mirrorX',41,true)
			midi.xl.add(this.params,'mirrorY',42,true)
			midi.xl.add(this.params,'divide4',43,true)
			midi.xl.add(this.params,'invertRatio',44,true)
			midi.xl.add(this.params,'vignetteFallOff',29).minMax(0,2)
			midi.xl.add(this.params,'vignetteAmount',30).minMax(0,2)
		}
		stage.onUpdate.add(this.onUpdate)
	}

	createGui(gui){
		const f = gui.addFolder('vj classic')
		f.add(this,'activate')
		f.add(this.params,'mirrorX',0,1).step(1)
		f.add(this.params,'mirrorY',0,1).step(1)
		f.add(this.params,'divide4',0,1).step(1)
		f.add(this.params,'invertRatio',0,1).step(1)
		f.add(this.params,'vignetteFallOff',0,2).step(0.001)
		f.add(this.params,'vignetteAmount',0,2).step(0.001)
		f.add(this.params,'bw',0,1).step(1)
		f.open()
	}

	onUpdate = (dt)=>{
		this.params.boost += (this.boostTarget-this.params.boost)*.1
		this.boostTarget += (1.-this.boostTarget)*.05
	}

	booster = (value=2.5)=>{
		this.boostTarget = value
	}

	run( c ) {
		this.shader.uniforms.gamma.value = this.params.gamma
		this.shader.uniforms.contrast.value = this.params.contrast
		this.shader.uniforms.brightness.value = this.params.brightness
		this.shader.uniforms.mirrorX.value = this.params.mirrorX
		this.shader.uniforms.mirrorY.value = this.params.mirrorY
		this.shader.uniforms.divide4.value = this.params.divide4
		this.shader.uniforms.vignetteFallOff.value = this.params.vignetteFallOff
		this.shader.uniforms.vignetteAmount.value = this.params.vignetteAmount
		this.shader.uniforms.invertRatio.value = this.params.invertRatio
		// this.shader.uniforms.mask.value = this.params.mask
		c.pass( this.shader )
	}

}

module.exports = PostProcessPass
