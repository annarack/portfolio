
let data = [{
	date    : `now - about`,
	title   : `Hi`,
	comments : `My name is Anton, and i'm a highly devoted multidisciplinary developer with a yearning for coding  or building in the logical, visual or even acoustical realm.`,
	content : {
		interview : `Lorem ipsum dolor sit amet? Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam? Et justo duo dolores et ea rebum. Stet clita kasd gubergren? No sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet?  Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et? Accusam et justo duo dolores et ea rebum. Stet clita kasd? Gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`,
		graphic : `./graphic/portrait.jpg`
	}
},{
	date     : `2017.04 - now`,
	title    : `Human Computer Interaction Master of Science`,
	comments : `1 / 4 Semester`,
	location : `Bauhaus University<br>Weimar, Germany`,
	url      : `http://www.uni-weimar.de/en/media/studies/computer-science-for-digital-media-hci/human-computer-interaction-msc/`,
	content  : {
		projects : [{
			title    : `YanFeng`,
			comments : `Concept car interior design`,
			tools    : `JavaScript, NodeJs, vvvv`,
			graphic  : `1, 2, 3, 4, 5, 6`
				.split(`, `)
				.map(a => `./graphic/projects/yanfeng/${a}.jpg`)
		},{
			title    : `KUKA`,
			comments : `Showroom`,
			tools    : `vvvv, multitouch`,
			graphic  : `1, 2, 3, 4, 5, 6`
				.split(`, `)
				.map(a => `./graphic/projects/kuka/${a}.jpg`)
		}]
	}
},{
	date     : `2015.12 - 2017.04`,
	title    : `Meso Digital Interiors Fulltime Position`,
	comments : `Interface Developer <br> Coding, Wireframe, UI Design, Frontend, Backend, Graphic, Motion`,
	clients  : `hyundai, kuka, basf, fraport, circ boehringer ingelheim, friedland, dvag icm, designreisen, yanfeng`,
	location : `Frankfurt, Germany`,
	url      : `http://www.meso.net`
},{
	date     : `2014.11 - 2015.04`,
	title    : `Dreiform Intership`,
	comments : `Interface, Industrial, Communicational and Generative Deisign, Coding, CAD, Animation, Sketching`,
	clients  : `telekom, bayer, 3m, slv, victrex, avery, rhein energie, lohmann`,
	location : `Cologne, Germany`,
	url      : `http://www.dreiform.de`
},{
	date     : `2015.04 - 2015.09`,
	title    : `Universal Interaction Freelance & Bachelor`,
	comments : `Generative Design, Coding Graphics`,
	clients  : `vbo`,
	location : `Cologne, Germany`,
	url      : `http://flux.neoanalog.io`
},{
	date     : `2011.06 - 2014.11`,
	title    : `Self-Taught Development`, 
	comments : `Interaction Designs & different tools`,
	location : `Essen, Germany`,
	url      : `https://en.wikipedia.org/wiki/Essen`
},{
	date     : `2011.06 - 2015.09`,
	title    : `Industrial Design<br>Bachelor of Arts`,
	comments : `8 / 8 Semester`,
	location : `Folkwang University of Arts<br>Essen, Germany`,
	url      : `http://www.folkwang-uni.de`
},{
	date     : `2011.03 - 2011.06`,
	title    : `Photostudio "Ihr-Foto-Profi" Internship`,
	comments : `Graphic Design, Photography`,
	location : `Oberhausen, Germany`,
	url      : `http://www.ihr-foto-profi.de`,
	content  : {
		bg      : `https://static.myposter.de/medialib/complete-teaser/myposter-bilder-app/myposter-bilder-app-xl.jpg`,
		opacity : .2
	}
},{
	date     : `2010.01 - 2011.03`,
	title    : `Urbanatix Show`,
	comments : `Dancing, Acting, Beatboxing`,
	location : `Bochum, Germany`,
	url      : `http://Urbanatix.de`,
	minor    : true,
	content  : {
		bg      : `http://www.ruhrnachrichten.de/storage/pic/mdhl/fotostrecken/lokales/bochum/lokales/2010/12-2010/urbanatix2010/2171264_1_URBABATIX_FOTO_URSULA_KAUF.jpg?version=1387431996`,
		opacity : .2
	}
},{
	date     : `2007.08 - 2011.06`,
	title    : `Level A / Abitur`,
	comments : `11-13 Class`,
	location : `Bertha von Suttner Gymnasium<br>Oberhausen, Germany`,
	url      : `http://www.bertha-ob.de`,
	content  : {
		bg      : `https://img.waz.de/img/archiv-daten/crop211201567/0442226020-w940-cv23_11-q85/picture-92376361.jpg`,
		opacity : .2
	}
},{
	date     : `2005.08 - 2007.08`,
	title    : `Secondary School`,
	comments : `9-10 Class`,
	location : `Bertha von Suttner Gymnasium<br>Oberhausen, Deutschland`,
	url      : `http://www.bertha-ob.de`,
	minor    : true,
	content  : {
		bg      : `https://img.waz.de/img/archiv-daten/crop211201567/0442226020-w940-cv23_11-q85/picture-92376361.jpg`,
		opacity : .2
	}
},{
	date     : `2000.09 - 2005.08`,
	title    : `Secondary School`,
	comments : `5-9 Class`,
	location : `Schule Nr. 31<br>Vitebsk, Belarus`,
	url      : `http://www.school31.vitebsk.by`,
	minor    : true,
	content  : {
		bg      : `http://www.school31.vitebsk.by/album/images/123.jpg`,
		opacity : .2
	}
},{
	date     : `1996.09 - 2000.09`,
	title    : `Primary School`,
	comments : `1-5 Class`,
	location : `Schule Nr. 31<br>Vitebsk, Belarus`,
	url      : `http://www.school31.vitebsk.by`,
	minor    : true,
	content  : {
		bg      : `http://www.school31.vitebsk.by/album/images/123.jpg`,
		opacity : .2
	}
},{
	date     : `1996.09 - 2005.08`,
	title    : `Tennis School`,
	location : `School of Tennis nr. 7<br>Vitebsk, Belarus`,
	url      : `https://vitebsk.biz/stadium/court/`,
	minor    : true,
	content  : {
		bg      : `http://gorodvitebsk.by/data/textimages/ruslan/ruslan2/fok-sdyshor/c628b238a11bbbcef5c587dbd435418b.jpg`,
		opacity : .2
	},
},{
	date     : `1989.06 - 1996.09`,
	title    : `Born`,
	location : `Vitebsk, Belarus`,
	url      : `https://en.wikipedia.org/wiki/Vitebsk`,
	minor    : true,
	content  : {
		bg      : `https://i0.wp.com/visit-belarus.com/wp-content/uploads/2016/07/vitebsk_pahomenko-1.jpg?resize =1165%2C771`,
		opacity : .2
	}
}]
