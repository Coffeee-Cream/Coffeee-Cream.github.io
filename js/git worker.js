await pfs.writeFile(dir + "README.md", await pfs.readFile(dir + "README.md", { encoding: 'utf8' }) + "\n this has been changed through a online system", 'utf8')

await git.add({fs, dir, filepath: 'README.md'})

let sha = await git.commit({
	fs,
	dir,
	message: 'changed the readme from a online source',
	author: {
		name: 'Imagineee',
		email: 'imagineeeinc@users.noreply.github.com'
	}
})

console.log(sha)

let pushResult = await git.push({
	fs,
	http,
	dir: '/',
	remote: 'origin',
	ref: 'main',
	onAuth: () => ({ username: ' <...Github token...> ' }),
})
console.log(pushResult)     