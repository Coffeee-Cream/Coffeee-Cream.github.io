import "https://unpkg.com/comlink/dist/umd/comlink.js";
import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js';
import 'https://unpkg.com/isomorphic-git';
import 'https://unpkg.com/@isomorphic-git/lightning-fs'
import 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.1.0/markdown-it.min.js'

const dir = '/'

var fs = new LightningFS('fs')//, { wipe: true }
var pfs = fs.promises
var md = markdownit({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true
})

var blogList = []

const getBlogs = async function(yes, que, force) {
	//get repo
	try {
		await pfs.readFile(dir + "README.md", { encoding: 'utf8' })
		await pfs.readFile(dir + "registry/scratch-projects.json", { encoding: 'utf8' })
		await pfs.readFile(dir + "blogs/blogs.json", { encoding: 'utf8' })
	} catch {
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
	}
	console.log("geting...")
	//welcome blog
	//console.log(await pfs.readFile(dir + "README.md", { encoding: 'utf8' }))
	let read = await pfs.readFile(dir + "README.md", { encoding: 'utf8' })
	run(`document.querySelector("#blog > .vertical-center").innerHTML = \`<section>${md.render(read)}<br><div class="scroll">scroll ▼ down</div></section>\``)

	if (navigator.onLine == false) {
		run(`document.querySelector("#blog-list > .vertical-center").innerHTML = "Your Offline"`)
	}

	//proj list
	let projsList = await pfs.readFile(dir + "registry/scratch-projects.json", { encoding: 'utf8' })
	projsList = JSON.parse(projsList)
	projsList = projsList.data
	run(`document.querySelector("#scratch-proj > .vertical-center").style.display = "none"`)
	for(let i=0;i<projsList.length;i++) {
		if (i > 5) {
			run(`let doc = document.createElement("div")
			doc.innerHTML = \`<br>
			<span style="text-align: center">
			<a href="https://scratch.mit.edu/users/CoffeeeCream/projects/" target="_blank">More...</a>
			</span>
			\`
			document.getElementById("proj-holder").append(doc)`)
		} else {
			run(`let doc = document.createElement("div")
			doc.innerHTML = \`<img src="https://cdn2.scratch.mit.edu/get_image/project/${projsList[i].id}_144x108.png" width="90%"  loading="lazy">
			<br>
			<span style="text-align: center">
			<a href="https://scratch.mit.edu/projects/${projsList[i].id}" target="_blank">${projsList[i].name}</a>
			</span>
			\`
			document.getElementById("proj-holder").append(doc)`)
		}
	}

	blogList = await pfs.readFile(dir + "blogs/blogs.json", { encoding: 'utf8' })
	blogList = JSON.parse(blogList)

	run(`document.querySelector("#blog-list").innerHTML = ""`)
	for(let i=0;i<blogList.length;i++) {
		run(`
		let tags = '${JSON.stringify({d: blogList[i].tags})}'
		tags = JSON.parse(tags);tags = tags.d
		let classes = ""
		for(let i=0;i<tags.length;i++) {
			let tag = document.createElement('span')
			tag.innerHTML = "#"+tags[i]+" "
			tag.classList += tags[i]
			classes += tag.outerHTML+" "
		}
		let doc = document.createElement("span")
		doc.innerHTML = \`
		<a href="/?blog=${blogList[i].name}#read-blog">${blogList[i].name}</a><br><span class="desc">${blogList[i].description.slice(0, 67)+"..."}</span><br>\${classes}
		\`
		document.querySelector("#blog-list").append(doc)

		doc = document.createElement("br")
		document.querySelector("#blog-list").append(doc)`)
	}

	//if read blogs
	if (yes > -1) {
		const queryString = que
		const urlParams = new URLSearchParams(queryString)
		const wantedBlog = urlParams.get('blog')
		let req = await readBlogs(wantedBlog)
		if (req == "repeat") {
			let req = await readBlogs(wantedBlog)
			if (req == "repeat") {
				postMessage(`document.querySelector("#read-blog > .vertical-center").style.display = "none"
			document.getElementById("reader").innerHTML = \`<h1>Hmm, where is the blog?</h1>\n<p>Looks like the blog you are trying to accses is not avalible at the moment or does not exist.<br><br><a href="#blog">Go to blog page</a></p>\`
			document.getElementById("reader").style.display = "block"`)
			}
		}
	}
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
}

const readBlogs = async function(wantedBlog) {
	for(let i=0;i<blogList.length;i++) {
		if (wantedBlog == blogList[i].name) {
			postMessage(`
			let tags = '${JSON.stringify({d: blogList[i].tags})}'
			tags = JSON.parse(tags);tags = tags.d
			let classes = ""
			for(let i=0;i<tags.length;i++) {
				let tag = document.createElement('span')
				tag.innerHTML = "#"+tags[i]+" "
				tag.classList += tags[i]
				classes += tag.outerHTML+" "
			}
			document.querySelector("#read-blog > .vertical-center").style.display = "none"
			document.getElementById("reader").innerHTML = \`${md.render(await pfs.readFile(dir + "blogs/markup/" + blogList[i].file.location, { encoding: 'utf8' }))}\`
			document.getElementById("reader").style.display = "block"
			let t = document.createElement('div')
			t.innerHTML = "<br><br><br>"+classes
			document.getElementById("reader-edge").append(t)
			document.getElementById("reader-edge").style.display = "block"
			`)
			//TODO: description in reader edge and any extras
			return
		} else {
			if (i >= blogList.length-1) {
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
				return "repeat"
			}
		}
	}
}

function run(fn) {
	postMessage(fn)
} 

Comlink.expose(getBlogs)