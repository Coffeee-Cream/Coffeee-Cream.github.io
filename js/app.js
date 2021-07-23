import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

var cert

window.onload = async function() {
	//window.fs = new LightningFS('fs', { wipe: true })
	//window.pfs = window.fs.promises
	/*window.md = window.markdownit({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true
	})*/
	var blogHider = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) {document.querySelector('#blog').style.visibility="hidden";return} else {document.querySelector('#blog').style.visibility="visible";}
	});
	blogHider.observe(document.querySelector('#blog'));
	var homeHider = new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio <= 0) {document.querySelector('#home').style.visibility="hidden";return} else {document.querySelector('#home').style.visibility="visible";}
	});
	homeHider.observe(document.querySelector('#home'));
	
	const worker = new Worker("js/blogWorker.js", {type: 'module'});
	const getBlogs = Comlink.wrap(worker);

	worker.onmessage = (e => ViaReceiver.OnMessage(e.data));

	await getBlogs()

	console.log("finish")
}

setTimeout(() => {
	if (navigator.onLine == false) {
		document.querySelector("#blog-list > .vertical-center").innerHTML = "Your Offline"
		//TODO: OFfline Blogs Caching to localStorage
	}
}, 10000)