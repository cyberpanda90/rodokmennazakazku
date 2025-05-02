function MimeConfig(path) {
	const map = MIMEPROJECTMAP // NEEDS TO BE DEFINED IN __isMimeProject.js

	const projectId = getShoptetDataLayer().projectId
	const key = map[projectId]
	const config = key ? MIMEVARS[key] : null

	if (!config) {
		return null
	}

	const pathParts = path.split('.')
	let result = config

	for (const part of pathParts) {
		result = result[part]
		if (result === undefined) {
			return null
		}
	}

	return result
}
