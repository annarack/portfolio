
import fw from './fw'
import scrollTo from 'scroll-into-view-if-needed'

let getUniqueDates = dates => {
	let timeline = []
	let chapters = []
	dates.forEach(date => date.split(' - ').forEach(date => {
		if (isNaN(parseInt(date))) {
			if (chapters.indexOf(date) == -1) chapters.push(date)
		} else {
			if (timeline.indexOf(date) == -1) timeline.push(date)
		}
	}))
	timeline = timeline.sort((a, b) => b - a)
	chapters = chapters.reverse()
	return chapters
		.concat(timeline)
		.map(date => {return {date}})
}

let monthes = [
	'Jan', 'Feb', 'Mar',
	'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep',
	'Oct', 'Nov', 'Dec']

let dateTemplate = date => {
	let yearMonth = date.split('.')
	let month = monthes[yearMonth[1] - 1]
	let str = yearMonth[0] + (month?`<br>${month}`:``)
	return fw.html(`<div class='date'>${str}</div>`)
}

let eventTemplate = event => {
	let data = ['title', 'location', 'text', 'comments']
		.map(i => event[i]? 
			`<div class='${i}'>${event[i]}</div><br>`: ``)
		.join('')
	if (event.clients) {
		let clients = event.clients
			.split(', ')
			.map(i => `<img 
				class='client' 
				src='./graphic/clients/${i}.png' 
				title='${i}'>`)
			.join('')
		data += `<div class='clients'>${clients}</div>`
	}
	let body = fw.html(`<div class='event'>
		<div class='center'>
			<div class='short'>${event.title}</div>
			<div class='full'>${data}</div>
		</div>
	</div>`)
	let short  = body.querySelector('.short')
	let full   = body.querySelector('.full')
	let center = body.querySelector('.center')
	short.addEventListener('click', e => {
		scrollTo(event.__cn.dom.container, false, {
			duration : 1000
		})
	})
	return {body, short, full, center}
}

let translateEvent = (event, t) => {
	let tBeg = .4
	// opacity
	let opacity = event.minor? .3: .6
	event.__tm.dom.short.style.opacity = fw.map(t, tBeg, .7, opacity, 0, true)
	event.__tm.dom.full.style.opacity  = fw.map(t, tBeg, .7, 0, 1, true)
	// event.__tm.dom.full.style.textShadow = 
	// 	`0vw 0vw 3vw rgba(0,0,0,${fw.map(t, tBeg, 1, 0, 1, true)})`
	// vertical line
	event.__tm.dom.body.style.background = 
		`rgba(255,255,255, ${fw.map(t, tBeg, 1, opacity, 1, true)})`
	// scale
	let fs = {
		x: fw.map(t, tBeg, 1, 1/event.__tm.scale.x, 1, true),
		y: fw.map(t, tBeg, 1, 1/event.__tm.scale.y, 1, true)}
	let ss = {
		x: fw.map(t, tBeg, 1, 1, event.__tm.scale.x, true),
		y: fw.map(t, tBeg, 1, 1, event.__tm.scale.y, true)}
	// set
	event.__tm.dom.full.style.transform   = `scale(${fs.x}, ${fs.y})`
	event.__tm.dom.short.style.transform  = `scale(${ss.x}, ${ss.y})`
	// center
	event.__tm.dom.center.style.top  = `${fw.map(t, tBeg, 1, 50.0, 0.0, true)}%`
	event.__tm.dom.center.style.left = `${fw.map(t, tBeg, 1,  0.7, 1.5, true)}vw`
	event.__tm.dom.center.style.transform = 
		`translateY(${fw.map(t, tBeg, 1, -event.__tm.dom.center.offsetHeight/2, 0, true)}px)`
}

let getEventTrack = event => {
	let track = 0
	let collision = track => {
		for (let i = 1; i < event.__tm.marks.length; i ++)
			for (var n = 0; n < events.length; n ++)
				if (events[n].__tm.track == track && 
					events[n].__tm.marks.indexOf(event.__tm.marks[i]) > -1) return true
		return false
	}
	while (collision(track)) track ++
	return track
}

let findLeftOffset = event => {
	let l = []
	event.__tm.contains.forEach(c => {
		if (!l[c.__tm.track]) l[c.__tm.track] = 0
		l[c.__tm.track] = Math.max(c.__tm.wMap, l[c.__tm.track])
	})
	let x = 0
	l.forEach(left => x += left)
	return x
}

let events = data
export let container = fw.html(`<div class='timeline'></div>`)
document.body.appendChild(container)
let marks = getUniqueDates(events.map(event => event.date))
export let cue = []

let init = (() => {
	// init events
	// find mark indexes
	events.forEach(event => {
		// template
		let dom = eventTemplate(event)
		container.appendChild(dom.body)
		// compliment object
		event.__tm = {
			marks    : [],
			contains : [],
		 	height   : dom.body.offsetHeight,
			width    : dom.body.offsetWidth,
			wMap     : dom.body.offsetWidth,
			scale    : fw.getScaleRatio(dom.full, dom.short),
			dom
		}
		dom.body.classList.add('init')
		// find according marks
		let start = false
		for (let i = 0; i < marks.length; i ++) {
			let date = event.date.split(' - ')
			if (date[1] == marks[i].date) start = true
			if (start) event.__tm.marks.push(i)
			if (date[0] == marks[i].date) break
		}
	})
	// init marks and set y, 
	// set track of events 
	// and create cue
	let top = 0
	for (let i = 0; i < marks.length; i ++) {
		// create template
		let dom = dateTemplate(marks[i].date)
		container.appendChild(dom)
		// create object
		Object.assign(marks[i], {
			yOri   : top,
			yMap   : top,
			height : dom.offsetHeight,
			width  : dom.offsetWidth,
			events : [],
			dom
		})
		// template
		top += marks[i].height
		// make first row and get y
		if (i < marks.length - 1) {
			let firstLevelHeight = 0
			events
				.filter(event => event.date.split(' - ')[1] == marks[i].date)
				.sort((a, b) => a.__tm.marks.length - b.__tm.marks.length)
				.forEach(event => {
					marks[i].events.push(event)
					// cue.push(event)
					event.__tm.track = getEventTrack(event)
					if (event.date.split(' - ')[0] == marks[i+1].date) 
						firstLevelHeight = event.__tm.height
				})
			events
				.filter(event => event.date.split(' - ')[1] == marks[i].date)
				.sort((a, b) => b.__tm.marks.length - a.__tm.marks.length)
				.forEach(event => cue.push(event))
			// set mark height
			top += firstLevelHeight? firstLevelHeight: marks[i].height
		}
	}
	// find event children and set left offset
	events.forEach(event => {
		events.forEach(other => {
			let marks = other.__tm.marks.slice(0, other.__tm.marks.length - 1)
			for (let i = 0; i < event.__tm.marks.length - 1; i ++)
				if (event != other &&
					marks.indexOf(event.__tm.marks[i]) > -1 &&
					other.__tm.track < event.__tm.track) {
						event.__tm.contains.push(other)
						break
					}
		})
		event.__tm.x = findLeftOffset(event)
	})
})()

let updateLayout = () => {
	let width  = 0
	marks.forEach(mark => {
		// rescale dates
		mark.dom.style.transform = `translateY(${mark.yMap}px)`
		// rescale events
		mark.events.forEach(event => {
			event.__tm.dom.body.style.height = 
				marks[event.__tm.marks[event.__tm.marks.length-1]].yMap - mark.yMap - mark.height
			// width
			let x = findLeftOffset(event) + mark.width
			width = Math.max(x + event.__tm.wMap, width)
			event.__tm.dom.body.style.transform = 
				`translate(${x}px, ${mark.yMap + mark.height}px)`
		})
	})
	container.style.width  = width
}

export let onScroll = () => {
	let markMap = {
		aMin: 0, aMax: 0, 
		bMin: 0, bMax: 0}
	// update event width
	cue.forEach((event, i) => {
		// translate event
		translateEvent(event, event.__cn.t)
		// width
		event.__tm.wMap = fw.map(event.__cn.t, 0, 1, event.__tm.width, 
			window.innerWidth - event.__tm.x - marks[0].width * 2)
		// calculate mark position
		let top  = marks[event.__tm.marks[0]]
		let bot  = marks[event.__tm.marks[event.__tm.marks.length - 1]]
		let hOri = bot.yOri - top.yOri
		let hMap = window.innerHeight * .5
		let dif  = (hMap - hOri) / 2
		markMap.aMin += event.__cn.t * top.yOri
		markMap.aMax += event.__cn.t * bot.yOri
		markMap.bMin += event.__cn.t * (top.yOri - dif)
		markMap.bMax += event.__cn.t * (bot.yOri + dif)
	})
	// update mark positions
	let centeration = 
		window.innerHeight / 2 - 
		(markMap.bMin + (markMap.bMax - markMap.bMin) / 2)
	// beg -> markMap.aMin
	// markMap.aMin -> markMap.bMin
	// markMap.bMin -> end
	let top = markMap.aMin - markMap.bMin
	let bot = markMap.bMax - markMap.aMax
	let beg = marks[0].yOri
	let end = marks[marks.length - 1].yOri
	marks.forEach(mark => {
		mark.yMap = centeration + (
			mark.yOri < markMap.aMin? mark.yOri - top:
			mark.yOri < markMap.aMax? 
				fw.map(mark.yOri, 
					markMap.aMin, markMap.aMax,
					markMap.bMin, markMap.bMax, true):
			mark.yOri + bot)
	})
	updateLayout()
}
