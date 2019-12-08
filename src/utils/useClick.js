const useClick = (singelClick, doubleClick) => {
	let timer = 0
	let delay = 500
	let prevent = false

	const callSingleClick = singelClick => {
		timer = setTimeout(() => {
			if (!prevent) {
				singelClick()
			}
		}, delay)
	}

	const callDoubleClick = doubleClick => {
		clearTimeout(timer)
		prevent = true
		doubleClick()
		setTimeout(() => {
			prevent = false
		}, delay)
	}

	return [callSingleClick, callDoubleClick]
}

export default useClick
