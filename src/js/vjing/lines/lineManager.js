const replaceIncludes = require( "mnf/utils/shaders" ).replaceIncludes
const ColorMeshLineGPUGroupGeometry = require("./ColorMeshLineGPUGroupGeometry")
const MeshLineGPUMaterial = require("mnf/3d/lines/MeshLineGPUMaterial")

function createLines(linesCount, lineDivision, shader="./material"){
	const width = linesCount
	const height = lineDivision
	const size = width*height
	const positions = new Float32Array(size * 4)
	const texture = new THREE.DataTexture(positions, width, height, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter, 0)
				texture.needsUpdate = true
				texture.generateMipmaps = false
	const geometry = new ColorMeshLineGPUGroupGeometry(linesCount,lineDivision,width,height)
	const material = new MeshLineGPUMaterial({
			vertexShader: replaceIncludes(require(shader+'.vs')),
			fragmentShader: replaceIncludes(require(shader+'.fs')),
			texture:texture, width:width, height:height, lineWidth:2,
			depthTest:true, depthWrite:true, transparent:true, color:0, alphaTest:0.1
	})
	material.clipping = true

	const depthMaterial = new THREE.ShaderMaterial({
			vertexShader: replaceIncludes(require(shader+'_depth.vs')),
			fragmentShader: "#define DEPTH_PACKING 0\n"+replaceIncludes(THREE.ShaderLib.depth.fragmentShader),
			uniforms: THREE.UniformsUtils.clone(material.uniforms),
	});
	depthMaterial.clipping = true
	depthMaterial.uniforms.positions.value = material.uniforms.positions.value

	const mesh = new THREE.Mesh(geometry, material)
	mesh.castShadow = true
	mesh.receiveShadow = true
	mesh.frustumCulled = false
	mesh.customDepthMaterial = depthMaterial
	return {count:linesCount, division:lineDivision, mesh:mesh, texture:texture, material:material, geometry:geometry}
}

// module.exports =
module.exports = {
	createLines : createLines
	// simpleLines : createLines(512,2),
	// longLines : createLines(256,8)
}
