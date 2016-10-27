const Scene = require( "mnf/core/Scene" )
const HeadScene = require('./scenes/head/HeadScene')
const LineScene = require('./scenes/lines/LineScene')

const o = {}

module.exports = o

module.exports.init = ()=>{
	o.head = new HeadScene(),
	o.line = new LineScene()
}
