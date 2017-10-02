
import * as timeline from './timeline'
import fw from './fw'

// let bgShift = event => {
// 	return () => {
// 		let con = event.__cn.dom.container
// 		let top = con.offsetTop
// 		let bot = con.offsetHeight + top
// 		let t = fw.map(document.body.scrollTop, 
// 			top - window.innerHeight, bot + window.innerHeight, 0, 200, true)
// 		con.style.backgroundPosition = `center ${t}%`
// 	}
// }

let pcDepth = [70, 30, 50, 40, 80, 20]
let cloudParallax = event => m => {
	// calculate only in viewport
	let cn   = event.__cn.dom.container
	let rect = cn.getBoundingClientRect()
	if (rect.bottom > 0 && rect.top < window.innerHeight) {
		// get project vector
		let pr = cn.querySelectorAll('.project')
		for (let i = 0; i < pr.length; i ++) {
			let mCn  = pr[i].offsetTop + pr[i].offsetHeight / 2
			let vec  = (mCn - m) / (window.innerHeight / 2)
			// graphic
			let gr = pr[i].querySelectorAll('.graphic')
			for (let n = 0; n < gr.length; n ++)
				for (let m = 0; m < pcDepth.length; m ++)
					if (gr[n].classList.contains(`_${m}`))
						gr[n].style.transform = 
							`translateY(${vec * pcDepth[m]}px)`
		}
	}
}

let cloudStyleRotation = 0
timeline.cue.forEach(event => {
	let dom = fw.html(`<div class='content'></div>`)
	document.body.appendChild(dom)
	event.__cn = {dom : {container : dom}}
	if (event.content) {
		if (event.content.bg) {
			dom.style.backgroundImage = `url('${event.content.bg}')`
			dom.classList.add(`full`)
			// event.__cn.parallax = bgShift(event)
		}
		if (event.content.opacity) 
			dom.style.opacity = event.content.opacity
		if (event.content.projects) {
			dom.classList.add(`projects`)
			event.__cn.dom.graphics = []
			event.__cn.onScroll = cloudParallax(event)
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
				// template rotation
				cloudStyleRotation = (cloudStyleRotation + 1) % 2
			})
		}
		if (event.content.interview) {
			dom.classList.add(`interview`)
			let tmp = `<div 
				class='full'
				style='
					height : 100%;
					margin : 0 0 4vw;
					background-size       : cover;
					background-repeat     : no-repeat;
					background-position   : center;
					background-image      : url("${event.content.graphic}");'>
			</div>`
			tmp += event.content.interview
				.split('.')
				.slice(0, -1)
				.map(qnas => {
					let qna = qnas.split('?')
					return`<div class='q'>${qna[0]}?</div><br>
						<div class='a'>${qna[1]}.</div>`
				}).join('<br>')
			dom.appendChild(fw.html(`<div>${tmp}</div>`))
		}
	}
})

let dimmTimeline = (() => {
	let timer = null
	let set = (opacity, translate) => {
		timeline.container.style.opacity   = opacity
		timeline.container.style.transform = `translateX(${translate}vw)`}
	document.addEventListener('mousemove', e => {
		if (e.clientX < window.innerWidth * .3) set(1,0)
	})
	return (bool, velocity) => {
		if (bool) {
			if (velocity > 40) set(1, 0)
		} else set(1, 0)
		if (timer) clearTimeout(timer)
		timer = setTimeout(bool => {if (bool) set(0, -5)}, 1000, bool)
	}
})()


let velocity = 0
let oldTop   = 0
let onScroll = () => {
	velocity = Math.abs(document.body.scrollTop - oldTop)
	oldTop   = document.body.scrollTop
	let h = window.innerHeight / 2
	let m = h + document.body.scrollTop
	let dimm = false
	timeline.cue.forEach(event => {
		// set mapping
		let t = event.__cn.dom.container.offsetTop
		let b = event.__cn.dom.container.offsetHeight + t
		let f = window.innerHeight * .4
		event.__cn.t = fw.easeInOutQuint(
			fw.map(m, t-f, t+f, 0, 1, true) *
			fw.map(m, b-f, b+f, 1, 0, true))
		// dimm
		dimm = !dimm? 
			event.content && 
			event.content.projects && 
			event.__cn.t == 1: dimm
		event.__cn.onScroll && event.__cn.onScroll(m)
	})
	dimmTimeline(dimm, velocity)
	timeline.onScroll()
}

window.addEventListener('load', onScroll)
window.addEventListener('resize', onScroll)
window.addEventListener('scroll', onScroll)
