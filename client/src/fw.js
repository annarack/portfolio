
export default {
	map (value, aMin, aMax, bMin, bMax, clamp) {
		var x = clamp == true? (
			value < aMin? aMin:
			value > aMax? aMax: value
		):  value
		return (
			(x - aMin) / 
			(aMax - aMin) * 
			(bMax - bMin) + bMin
		)
	},
	html (string) {
		let a = document.createElement('div')
		a.innerHTML = string
		return a.firstChild
	},
	getScaleRatio (a, b) {
		let s = a.getBoundingClientRect()
		let e = b.getBoundingClientRect()
		return {
			x : s.width  / e.width,
			y : s.height / e.height
		}
	},
	easeInOutQuint : t => t < 0.5? 
		16 * Math.pow(t, 5): (--t) * 
		16 * Math.pow(t, 4) + 1,
}

window.addEventListener('keyup', e => {
	if (e.key == 'D') document.body.classList.toggle('dev')
})
