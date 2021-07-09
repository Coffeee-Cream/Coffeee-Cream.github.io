import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
window.fs = new LightningFS('fs', { wipe: true })
window.pfs = window.fs.promises

const dir = '/'
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

console.log(await pfs.readFile(dir + "README.md", { encoding: 'utf8' }))