const Signals = require( 'mnf/events/Signals');

const special = {
	metaKey : false, // apple/command
	shiftKey : false,
	altKey : false,
	ctrlKey : false
}

const down = new Signals()
const up = new Signals()

window.addEventListener('keydown', (e)=>{
	special.metaKey = e.metaKey
	special.shiftKey = e.shiftKey
	special.altKey = e.altKey
	special.ctrlKey = e.ctrlKey
	down.dispatch(e.which, e)
})

window.addEventListener('keyup', (e)=>{
	special.metaKey = e.metaKey
	special.shiftKey = e.shiftKey
	special.altKey = e.altKey
	special.ctrlKey = e.ctrlKey
	up.dispatch(e.which, e)
})

module.exports.special = special
module.exports.up = up
module.exports.down = down
