import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
window.fs = new LightningFS('fs', { wipe: true })
window.pfs = window.fs.promises

var cert

window.onload = function() {
	window.md = window.markdownit({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true
	})
	getBlogs()
}
const dir = '/'

async function getBlogs() {
	//get repo
	await git.clone({
		fs,
		http,
		dir,
		corsProxy: 'https://cors.isomorphic-git.org',
		url: 'https://github.com/Coffeee-Cream/blog',
		ref: 'main',
		singleBranch: true,
		depth: 10
	})
	//welcome blog
	//console.log(await pfs.readFile(dir + "README.md", { encoding: 'utf8' }))
	document.querySelector("#blog > .vertical-center").innerHTML = `<section>${md.render(await pfs.readFile(dir + "README.md", { encoding: 'utf8' }))}<br><div class="scroll">scroll ▼ down</div></section>`

	if (navigator.onLine == false) {
		document.querySelector("#blog-list > .vertical-center").innerHTML = "Your Offline"
	}

	//proj list
	let projsList = await pfs.readFile(dir + "registry/scratch-projects.json", { encoding: 'utf8' })
	projsList = JSON.parse(projsList)
	projsList = projsList.data
	document.querySelector("#scratch-proj > .vertical-center").style.display = "none"
	for(let i=0;i<projsList.length;i++) {
		if (i > 5) {
			let doc = document.createElement("div")
			doc.innerHTML = `<br>
			<span style="text-align: center">
			<a href="https://scratch.mit.edu/users/CoffeeeCream/projects/" target="_blank">More...</a>
			</span>
			`
			document.getElementById("proj-holder").append(doc)
		} else {
			let doc = document.createElement("div")
			doc.innerHTML = `<img src="https://cdn2.scratch.mit.edu/get_image/project/${projsList[i].id}_444x408.png" width="90%">
			<br>
			<span style="text-align: center">
			<a href="https://scratch.mit.edu/projects/${projsList[i].id}" target="_blank">${projsList[i].name}</a>
			</span>
			`
			document.getElementById("proj-holder").append(doc)
		}
	}

	//blog list
	//blogs/blogs.json
	let blogList = await pfs.readFile(dir + "blogs/blogs.json", { encoding: 'utf8' })
	blogList = JSON.parse(blogList)

	document.querySelector("#blog-list").innerHTML = ""
	for(let i=0;i<blogList.length;i++) {
		let doc = document.createElement("span")
		doc.innerHTML = `
		<a href="/?blog=${blogList[i].name}#read-blog">${blogList[i].name}</a>
		`
		document.querySelector("#blog-list").append(doc)
	}

	//if read blogs
	if (window.location.href.indexOf('#read-blog') > -1) {
		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)
		const wantedBlog = urlParams.get('blog')
		for(let i=0;i<blogList.length;i++) {
			if (wantedBlog == blogList[i].name) {
				document.querySelector("#read-blog > .vertical-center").style.display = "none"
				document.getElementById("reader").innerHTML = md.render(await pfs.readFile(dir + "blogs/markup/" + blogList[i].file.location, { encoding: 'utf8' }))
				document.getElementById("reader").style.display = "block"
			}
		}
	}
}

setTimeout(() => {
	if (navigator.onLine == false) {
		document.querySelector("#blog-list > .vertical-center").innerHTML = "Your Offline"
		//TODO: OFfline Blogs Caching to localStorage
	}
}, 10000)