
import fw from './fw'

let events = data

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
	return {body, short, full, center}
}

let translateEvent = (event, t) => {
	let tBeg = .4
	// opacity
	let opacity = event.minor? .2: .5
	event.dom.short.style.opacity = fw.map(t, tBeg, .7, opacity, 0, true)
	event.dom.full.style.opacity  = fw.map(t, tBeg, .7, 0, 1, true)
	event.dom.full.style.textShadow = 
		`0vw 0vw 3vw rgba(0,0,0,${fw.map(t, tBeg, 1, 0, 1, true)})`
	// vertical line
	event.dom.body.style.background = 
		`rgba(255,255,255, ${fw.map(t, tBeg, 1, opacity, 1, true)})`
	// scale
	let fs = {
		x: fw.map(t, tBeg, 1, 1/event.scale.x, 1, true),
		y: fw.map(t, tBeg, 1, 1/event.scale.y, 1, true)}
	let ss = {
		x: fw.map(t, tBeg, 1, 1, event.scale.x, true),
		y: fw.map(t, tBeg, 1, 1, event.scale.y, true)}
	// set
	event.dom.full.style.transform   = `scale(${fs.x}, ${fs.y})`
	event.dom.short.style.transform  = `scale(${ss.x}, ${ss.y})`
	// center
	event.dom.center.style.top  = `${fw.map(t, tBeg, 1, 50.0, 0.0, true)}%`
	event.dom.center.style.left = `${fw.map(t, tBeg, 1,  0.7, 1.5, true)}vw`
	event.dom.center.style.transform = 
		`translateY(${fw.map(t, tBeg, 1, -event.dom.center.offsetHeight/2, 0, true)}px)`
}

let getEventTrack = event => {
	let track = 0
	let collision = track => {
		for (let i = 1; i < event.marks.length; i ++)
			for (var n = 0; n < events.length; n ++)
				if (events[n].track == track && 
					events[n].marks.indexOf(event.marks[i]) > -1) return true
		return false
	}
	while (collision(track)) track ++
	return track
}

let findLeftOffset = event => {
	let l = []
	event.contains.forEach(c => {
		if (!l[c.track]) l[c.track] = 0
		l[c.track] = Math.max(c.wMap, l[c.track])
	})
	let x = 0
	l.forEach(left => x += left)
	return x
}

let timeline = fw.html(`<div class='timeline'></div>`)
document.body.appendChild(timeline)
let marks = getUniqueDates(events.map(event => event.date))
export let cue = []

events.forEach(event => {
	// template
	let dom = eventTemplate(event)
	timeline.appendChild(dom.body)
	// compliment object
	Object.assign(event, {
		marks    : [],
		contains : [],
	 	height   : dom.body.offsetHeight,
		width    : dom.body.offsetWidth,
		wMap     : dom.body.offsetWidth,
		scale    : fw.getScaleRatio(dom.full, dom.short),
		dom
	})
	dom.body.classList.add('init')
	// find according marks
	let start = false
	for (let i = 0; i < marks.length; i ++) {
		let date = event.date.split(' - ')
		if (date[1] == marks[i].date) start = true
		if (start) event.marks.push(i)
		if (date[0] == marks[i].date) break
	}
})

let top = 0
for (let i = 0; i < marks.length; i ++) {
	// create template
	let dom = dateTemplate(marks[i].date)
	timeline.appendChild(dom)
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
			.sort((a, b) => a.marks.length - b.marks.length)
			.forEach(event => {
				marks[i].events.push(event)
				// cue.push(event)
				event.track = getEventTrack(event)
				if (event.date.split(' - ')[0] == marks[i+1].date) 
					firstLevelHeight = event.height
			})
		events
			.filter(event => event.date.split(' - ')[1] == marks[i].date)
			.sort((a, b) => b.marks.length - a.marks.length)
			.forEach(event => cue.push(event))
		// set mark height
		top += firstLevelHeight? firstLevelHeight: marks[i].height
	}
}

events.forEach(event => {
	events.forEach(other => {
		let marks = other.marks.slice(0, other.marks.length - 1)
		for (let i = 0; i < event.marks.length - 1; i ++)
			if (event != other &&
				marks.indexOf(event.marks[i]) > -1 &&
				other.track < event.track) {
					event.contains.push(other)
					break
				}
	})
	event.x = findLeftOffset(event)
})

let update = () => {
	let width  = 0
	marks.forEach(mark => {
		// rescale dates
		mark.dom.style.transform = `translateY(${mark.yMap}px)`
		// rescale events
		mark.events.forEach(event => {
			event.dom.body.style.height = 
				marks[event.marks[event.marks.length-1]].yMap - mark.yMap - mark.height
			// width
			let x = findLeftOffset(event) + mark.width
			width = Math.max(x + event.wMap, width)
			event.dom.body.style.transform = 
				`translate(${x}px, ${mark.yMap + mark.height}px)`
		})
	})
	timeline.style.width  = width
}

export let scroll = i => {
	let markMap = {
		aMin: 0, aMax: 0, 
		bMin: 0, bMax: 0}
	cue.forEach((event, i) => {
		// translate event
		translateEvent(event, event.t)
		// width
		event.wMap = fw.map(event.t, 0, 1, event.width, 
			window.innerWidth - event.x - marks[0].width * 2)
		// height
		let top = marks[event.marks[0]]
		let bot = marks[event.marks[event.marks.length - 1]]
		let hOri = bot.yOri - top.yOri
		let hMap = window.innerHeight * .5
		let dif  = (hMap - hOri) / 2
		markMap.aMin += event.t * top.yOri
		markMap.aMax += event.t * bot.yOri
		markMap.bMin += event.t * (top.yOri - dif)
		markMap.bMax += event.t * (bot.yOri + dif)
	})
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
	// timeline.style.transform = `translateY(${window.innerHeight / 2 - y}px)`
	update()
}

// document.body.addEventListener('mousemove', e => {
// 	scroll(e.pageX / window.innerWidth)
// })



