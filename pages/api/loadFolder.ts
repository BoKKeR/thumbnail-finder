import path from 'path'
const {
	promises: { readdir },
} = require('fs')

export default async function handler(req, res) {
	try {
		const folder = req?.query['folder']
		const filePath = path.join(folder)

		const folders = await getDirectoryContent(filePath)

		return res.status(200).json({ folders, filePath: filePath })
	} catch (error) {
		console.log(error)
	}

	res.status(200).json({})
}

const methods = [
	'isBlockDevice',
	'isCharacterDevice',
	'isDirectory',
	'isFIFO',
	'isFile',
	'isSocket',
	'isSymbolicLink',
]

const getDirectoryContent = async (source: string) =>
	(await readdir(source, { withFileTypes: true }))

		.map((dirent) => {
			let cur = { name: dirent.name }
			for (const method of methods) cur[method] = dirent[method]()
			return cur
		})
		.sort((a, b) => b.name - a.name)
		.sort((a, b) => b.isDirectory - a.isDirectory)
