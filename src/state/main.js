export const initialState = {
	isModalVisible: {
		folder: false,
		file: false,
	},
	folderName: '',
	fileName: '',
	previewData: {},
	folderData: {
		name: '',
		path: '',
		children: [],
	},
	sortBy: {
		column: 'name',
		order: 'asc',
	},
}

export const reducers = (state, action) => {
	switch (action.type) {
		case 'setFolderData':
			return {
				...state,
				folderData: {
					name: action.payload.name,
					path: action.payload.path,
					children: action.payload.children,
				},
			}
		case 'setPreviewData':
			return {
				...state,
				previewData: action.payload,
			}
		case 'sortBy':
			return {
				...state,
				sortBy: {
					column: action.payload.column,
					order: action.payload.order,
				},
			}
		case 'toggleModal':
			return {
				...state,
				isModalVisible: {
					folder: action.payload.folder,
					file: action.payload.file,
				},
			}
		case 'setFolderName':
			return {
				...state,
				folderName: action.payload,
			}
		case 'setFileName':
			return {
				...state,
				fileName: action.payload,
			}
		default:
			return state
	}
}
