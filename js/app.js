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
	
	const worker = new Worker("js/blogWorker.min.js", {type: 'module'});
	const getBlogs = Comlink.wrap(worker);
	const getBlogNames = Comlink.wrap(worker);

	document.getElementById("search-blog-box").onmouseup = async () => {
		blogSearch(document.getElementById("search-blog-box").value)
	}
	
	worker.addEventListener("message", function handleMessageFromWorker(msg) {
		let fn = msg.data
		try {
			fn = new Function (fn)
			fn()
		} catch(e) {console.log(fn, e)}
	});

	await getBlogs(window.location.href.indexOf('#read-blog'), window.location.search)

	await getBlogNames()
}

setTimeout(() => {
	if (navigator.onLine == false) {
		document.querySelector("#blog-list > .vertical-center").innerHTML = "Your Offline"
		//TODO: OFfline Blogs Caching to localStorage
	}
}, 10000)
setInterval(()=>{
	if (document.activeElement.id == "search-blog-box" && window.location.href.indexOf("#search-blogs") < 0) {
		window.location.replace(window.location.href.replace(/(#home)|(#blog)|(#blog-reader)/gm, "") + "#search-blogs")
		document.getElementById("search-blog-box").focus()
	} else if (document.activeElement.id != "search-blog-box" && window.location.href.indexOf("#search-blogs") > -1) {
		window.location.replace(window.location.href.replace(/(#search-blogs)/gm, "") + "#home")
	}
	if (document.activeElement.id == "search-blog-box" && window.location.href.indexOf("#search-blogs") > -1) {
		document.getElementById("search-blog-box").className = "search-now"
	} else {
		document.getElementById("search-blog-box").className = ""
	}
}, 500)