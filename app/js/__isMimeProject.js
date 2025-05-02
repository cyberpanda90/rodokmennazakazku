const MIMEPROJECTID = getShoptetDataLayer().projectId
const MIMEPROJECTMAP = {
	111222: 'DEV_CZ', // testovačka CZ
	222333: 'DEV_SK', // testovačka SK
	333444: 'PROD_CZ', // produkce CZ
	444555: 'PROD_SK', // produkce SK
}

function isMimeProject(name) {
	for (const [key, val] of Object.entries(MIMEPROJECTMAP)) {
		if (val === name) {
			return parseInt(key) === MIMEPROJECTID
		}
	}
	return false
}

function getMimeProject() {
	return MIMEPROJECTMAP[MIMEPROJECTID]
}
