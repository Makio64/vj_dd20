module.exports.extractRGB = function( color ) {
	const r = ( color >> 16 ) & 0xff
	const g = ( color >> 8 ) & 0xff
	const b = ( color ) & 0xff

	return { r: r, g: g, b: b }
}

module.exports.toStringRGB = function( rgb ) {
	return "rgb( " + rgb.r + ", " + rgb.g + ", " + rgb.b + ")"
}

module.exports.toStringRGBA = function( rgb, a ) {
	return "rgba( " + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + a + ")"
}

module.exports.getRandomHSL = function({hue=Math.random() * 255, sat = Math.random()*255,lum = Math.random()*255} = {}) {
	return { h: hue, s: sat, l: lum, string: "hsl( " + hue + ", " + sat + "%, " + lum + "% )" }
}

const hue2rgb = module.exports.hue2rgb = function(p, q, t){
		if(t < 0) t += 1;
		if(t > 1) t -= 1;
		if(t < 1/6) return p + (q - p) * 6 * t;
		if(t < 1/2) return q;
		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
}

module.exports.hslToRgb = function(h, s, l){
		let r, g, b
		if(s == 0){
				r = g = b = l
		}else{
				let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				let p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
		}
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports.rgbToHsl = function(r, g, b){
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min){
				h = s = 0; // achromatic
		}else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
						case r: h = (g - b) / d + (g < b ? 6 : 0); break;
						case g: h = (b - r) / d + 2; break;
						case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
		}

		return [h, s, l];
}
