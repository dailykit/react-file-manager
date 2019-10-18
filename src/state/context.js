import React from 'react'

const Context = React.createContext()

const initialState = {
	isSidebarVisible: true,
	currentFolder: './../apps',
	folderView: 'list',
	isPreviewVisible: false,
	searchText: '',
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

const reducers = (state, action) => {
	switch (action.type) {
		case 'SET_CURRENT_FOLDER':
			return {
				...state,
				currentFolder:
					action.payload === './..'
						? state.currentFolder
						: action.payload,
			}
		case 'SET_FOLDER_DATA':
			return {
				...state,
				folderData: {
					name: action.payload.name,
					path: action.payload.path,
					children: action.payload.children,
				},
			}
		case 'TOGGLE_SIDEBAR':
			return {
				...state,
				isSidebarVisible: !state.isSidebarVisible,
			}
		case 'TOGGLE_VIEW':
			return {
				...state,
				folderView: action.payload,
			}
		case 'TOGGLE_PREVIEW':
			return {
				...state,
				isPreviewVisible: action.payload,
			}
		case 'SET_PREVIEW_DATA':
			return {
				...state,
				previewData: action.payload,
			}
		case 'SET_SEARCH_TEXT':
			return {
				...state,
				searchText: action.payload,
			}
		case 'SORT_BY':
			return {
				...state,
				sortBy: {
					column: action.payload.column,
					order: action.payload.order,
				},
			}
		case 'TOGGLE_MODAL':
			return {
				...state,
				isModalVisible: {
					folder: action.payload.folder,
					file: action.payload.file,
				},
			}
		case 'SET_FOLDER_NAME':
			return {
				...state,
				folderName: action.payload,
			}
		case 'SET_FILE_NAME':
			return {
				...state,
				fileName: action.payload,
			}
		default:
			return state
	}
}

export { Context, initialState, reducers }
