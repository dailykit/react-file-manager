const deepSearch = (obj, key, value) => {
	if (obj[key] === value) {
		return obj
	}
	var result, p
	for (p in obj) {
		if (obj.hasOwnProperty(p) && typeof obj[p] === 'object') {
			result = deepSearch(obj[p], key, value)
			if (result) {
				return result
			}
		}
	}
	return result
}

export default deepSearch
