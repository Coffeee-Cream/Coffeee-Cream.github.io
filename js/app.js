import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

var blogNames
var blogDesc
var blogTags

window.onload = async function() {
	var blogHider = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) {document.querySelector('#blog').style.visibility="hidden";return} else {document.querySelector('#blog').style.visibility="visible";}
	});
	blogHider.observe(document.querySelector('#blog'));
	var homeHider = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) {document.querySelector('#home').style.visibility="hidden";return} else {document.querySelector('#home').style.visibility="visible";}
	});
	homeHider.observe(document.querySelector('#home'));
	var searchHider = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) {document.querySelector('#search-blogs').style.visibility="hidden";return} else {document.querySelector('#search-blogs').style.visibility="visible";}
	});
	searchHider.observe(document.querySelector('#search-blogs'));
	var readBlogsHider = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) {document.querySelector('#read-blog').style.visibility="hidden";return} else {document.querySelector('#read-blog').style.visibility="visible";}
	});
	readBlogsHider.observe(document.querySelector('#read-blog'));
	
	const worker = new Worker("js/blogWorker.min.js", {type: 'module'});
	const getBlogs = Comlink.wrap(worker);
	const getBlogNames = Comlink.wrap(worker);
	
	worker.addEventListener("message", function handleMessageFromWorker(msg) {
		let fn = msg.data
		try {
			fn = new Function (fn)
			fn()
		} catch(e) {console.log(fn, e)}
	});

	await getBlogs(window.location.href.indexOf('#read-blog'), window.location.search)

	await getBlogNames()

	if (localStorage.getItem('login') == 'true') {
		document.getElementById('edit').className = ''
		document.getElementById('new-blog').className = ''
	}
}
document.getElementById("search-blog-box").onkeyup = () => {
	blogSearch(document.getElementById("search-blog-box").value)
}
function blogSearch(filter) {
	document.getElementById("search-list").innerHTML = ""
	let cur = []
	for (let i=0;i < window.blogs.length;i++) {
		if (window.blogs[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
			cur.push(window.blogs[i])
		} else {
		}
	}
	for (let j=0;j < cur.length;j++) {
		let doc = document.createElement("div")
		doc.innerHTML = `<a href="/?blog=${cur[j].name}#read-blog">${cur[j].name}</a>`
		document.getElementById("search-list").append(doc)
	}
}
setTimeout(() => {
	if (navigator.onLine == false) {
		document.querySelector("#blog-list > .vertical-center").innerHTML = "Your Offline"
		//TODO: OFfline add to places where blogs are viwed
	}
}, 10000)
setInterval(()=>{
	if (document.activeElement.id == "search-blog-box" && window.location.href.indexOf("#search-blogs") < 0) {
		window.location.replace(window.location.href.replace(/(#home)|(#blog)|(#read-blog)/gm, "") + "#search-blogs")
		document.getElementById("search-blog-box").focus()
	} else if (document.activeElement.id != "search-list" && document.activeElement.id != "search-blog-box" && window.location.href.indexOf("#search-blogs") > -1) {
		window.location.replace(window.location.href.replace(/(#search-blogs)|(#home)|(#blog)|(#read-blog)/gm, "") + "#home")
	}
	if (document.activeElement.id == "search-blog-box" && window.location.href.indexOf("#search-blogs") > -1) {
		document.getElementById("search-blog-box").className = "search-now"
	} else {
		document.getElementById("search-blog-box").className = ""
	}
}, 500)
document.body.onkeydown = function(event) {
	if (event.keyCode === 75 && event.ctrlKey === true) {
		event.preventDefault()
		document.getElementById("search-blog-box").focus()
	}
}