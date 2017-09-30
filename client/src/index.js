
import '../graphic/style.sass'
import * as timeline from './timeline'
import fw from './fw'

let cloudStyleRotation = 0
timeline.cue.forEach(event => {
	let dom = fw.html(`<div class='container'></div>`)
	document.body.appendChild(dom)
	event.dom.container = dom
	if (event.content) {
		if (event.content.bg) {
			dom.style.backgroundImage = `url('${event.content.bg}')`
			dom.classList.add(`full`)
		}
		if (event.content.opacity) 
			dom.style.opacity = event.content.opacity
		if (event.content.projects) {
			dom.classList.add(`projects`)
			event.dom.graphics = []
			event.content.projects.forEach(project => {
				// fill infos
				let template = ''
				let full = ['title', 'tools', 'comments']
					.map(check => project[check]? 
						`<div class='${check}'>${project[check]}</div><br>`: ``)
					.join('')
				template += `<div class='full'>${full}</div>`
				// create cloud
				template += project.graphic
					.map((path, i) => `<div 
						class='graphic _${i}' 
						style='background-image : url("${path}")'></div>`)
					.join('')
				// compose into parent
				dom.appendChild(fw.html(
					`<div class='project _${cloudStyleRotation}'>${template}</div>`))
				// parallax
				// let grDom = dom.querySelectorAll('.graphic')
				// for (var i = 0; i < grDom.length; i ++) {
				// 	let rect  = grDom[i].getBoundingClientRect()
				// 	event.dom.graphics.push({
				// 		dom : grDom[i],
				// 		y   : rect.top  + rect.height/2,
				// 		h   : rect.height/2
				// 	})
				// }
				// template rotation
				cloudStyleRotation = (cloudStyleRotation + 1) % 2
			})
		}
	}
})

let updateOnScroll = () => {
	let h = window.innerHeight / 2
	let m = h + document.body.scrollTop
	timeline.cue.forEach(event => {
		let t = event.dom.container.offsetTop
		let b = event.dom.container.offsetHeight + t
		let f = window.innerHeight * .4
		event.t = fw.easeInOutQuint(
			fw.map(m, t-f, t+f, 0, 1, true) *
			fw.map(m, b-f, b+f, 1, 0, true))
		// background parallax
		// console.log(event.dom.container)
		// update cloud
		// if (event.dom.graphics) {
		// 	let offset = -window.innerHeight*.2
		// 	event.dom.graphics.forEach(img => {
		// 		img.dom.style.transform = 
		// 			`translateY(${fw.map(m, 
		// 				img.y-h-img.h, img.y+h+img.h, 
		// 				-offset, offset, true)}px)`
		// 	})
		// }
	})
	timeline.scroll()
}

window.addEventListener('load', updateOnScroll)
window.addEventListener('resize', updateOnScroll)
window.addEventListener('scroll', updateOnScroll)
