const isObject = obj => {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

const toggleNode = (data, nodeToFind) => {
	return JSON.parse(
		JSON.stringify(data, function(key, node) {
			if (isObject(node) && node.name === nodeToFind) {
				return {
					...node,
					isOpen: !node.isOpen,
				}
			}
			return node
		})
	)
}

export default toggleNode
