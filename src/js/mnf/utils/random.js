module.exports.between = function(min,max){
	return min+Math.random()*(max-min)
}

module.exports.choice = function(choice1,choice2){
	return Math.random()<.5?choice1:choice2
}

module.exports.shuffleArrayBy3 = function(array){
	const l = array.length/3
	for( let k = 0; k < l; k++){
		let i = k*3
		let j = Math.floor(Math.random() * l)*3

		let temp = array[i]
		array[i] = array[j]
		array[j] = temp

		temp = array[i+1]
		array[i+1] = array[j+1]
		array[j+1] = temp

		temp = array[i+2]
		array[i+2] = array[j+2]
		array[j+2] = temp
	}
	return array
}
