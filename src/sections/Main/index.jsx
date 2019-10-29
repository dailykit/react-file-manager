import React from 'react'
import _ from 'lodash'

import { useQuery } from '@apollo/react-hooks'
import { useMutation } from '@apollo/react-hooks'
import { Menu, Item, MenuProvider } from 'react-contexify'

import { useToasts } from 'react-toast-notifications'

// Components
import FilePreview from '../../components/FilePreview'
import Card from '../../components/Card'
import TableRow from '../../components/TableRow'

// Queries
import GET_FOLDER from '../../queries/getFolder'
import CREATE_FOLDER from '../../queries/createFolder'
import CREATE_FILE from '../../queries/createFile'
import IMAGE_UPLOAD from '../../queries/imageUpload'

import 'react-contexify/dist/ReactContexify.min.css'

import { Context } from '../../state/context'

import CreateFileModal from './CreateFileModal'
import CreateFolderModal from './CreateFolderModal'
import UploadImageModal from './UploadImageModal'

const Main = () => {
	const { state, dispatch } = React.useContext(Context)
	const {
		loading: queryLoading,
		error: queryError,
		data: queryData,
	} = useQuery(GET_FOLDER, {
		variables: {
			path: state.currentFolder,
		},
	})

	const { addToast } = useToasts()
	const [createFolder] = useMutation(CREATE_FOLDER, {
		onCompleted: ({ createFolder }) => {
			addToast(createFolder.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [
			{ query: GET_FOLDER, variables: { path: state.currentFolder } },
		],
	})
	const [createFile] = useMutation(CREATE_FILE, {
		onCompleted: ({ createFile }) => {
			addToast(createFile.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [
			{ query: GET_FOLDER, variables: { path: state.currentFolder } },
		],
	})
	const [imageUpload] = useMutation(IMAGE_UPLOAD, {
		onCompleted: ({ imageUpload }) => {
			addToast(imageUpload.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [
			{ query: GET_FOLDER, variables: { path: state.currentFolder } },
		],
	})

	React.useEffect(() => {
		if (queryData && queryData.getFolderWithFiles) {
			const childrens = queryData.getFolderWithFiles.children.filter(
				item => item.name.toLowerCase().includes(state.searchText)
			)
			dispatch({
				type: 'SET_FOLDER_DATA',
				payload: {
					name: queryData.getFolderWithFiles.name,
					path: queryData.getFolderWithFiles.path,
					children: childrens,
				},
			})
		}
	}, [queryData, state.searchText])

	let items = _.mapValues(
		_.groupBy(state.folderData.children || [], 'type'),
		v => _.orderBy(v, [state.sortBy.column], [state.sortBy.order])
	)

	const sortItems = by => {
		dispatch({
			type: 'SORT_BY',
			payload: {
				column: by,
				order: state.sortBy.order === 'asc' ? 'desc' : 'asc',
			},
		})
	}

	const onModalSubmit = value => {
		if (state.isModalVisible.folder) {
			createFolder({
				variables: {
					path: `${state.currentFolder}/${state.folderName}`,
				},
			})
		} else if (state.isModalVisible.file) {
			createFile({
				variables: {
					path: `${state.currentFolder}/${state.fileName}.json`,
					type: state.currentFolder.split('/')[2].toLowerCase(),
				},
			})
		} else {
			const {
				files: [file],
			} = value
			imageUpload({
				variables: {
					file,
					path: state.currentFolder,
				},
			})
		}
		dispatch({
			type: 'TOGGLE_MODAL',
			payload: {
				folder: false,
				file: false,
			},
		})
	}

	const onModalClose = () => {
		return dispatch({
			type: 'TOGGLE_MODAL',
			payload: {
				folder: false,
				file: false,
			},
		})
	}

	const MainMenu = () => (
		<Menu id="main__menu">
			<Item
				onClick={() =>
					dispatch({
						type: 'TOGGLE_MODAL',
						payload: {
							folder: false,
							file: !state.isModalVisible.file,
						},
					})
				}
			>
				Create File
			</Item>
			<Item
				onClick={() =>
					dispatch({
						type: 'TOGGLE_MODAL',
						payload: {
							folder: !state.isModalVisible.folder,
							file: false,
						},
					})
				}
			>
				Create Folder
			</Item>
		</Menu>
	)
	if (queryLoading) return <div>Loading...</div>
	if (queryError) return console.log(queryError) || <div>Error!</div>
	if (Object.keys(items).length === 0 && state.searchText === '') {
		return (
			<div className="window__main empty__state">
				{state.isModalVisible.folder && (
					<CreateFolderModal
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				{state.isModalVisible.file && (
					<CreateFileModal
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				{state.isModalVisible.image && (
					<UploadImageModal
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				<h3>
					This folder is empty. Start by creating a new folder or a
					file
				</h3>
				<div>
					<button
						onClick={() =>
							dispatch({
								type: 'TOGGLE_MODAL',
								payload: {
									image: false,
									folder: false,
									file: !state.isModalVisible.file,
								},
							})
						}
					>
						Create File
					</button>
					<button
						onClick={() =>
							dispatch({
								type: 'TOGGLE_MODAL',
								payload: {
									file: false,
									folder: false,
									image: !state.isModalVisible.image,
								},
							})
						}
					>
						Upload Image
					</button>
					<button
						onClick={() =>
							dispatch({
								type: 'TOGGLE_MODAL',
								payload: {
									folder: !state.isModalVisible.folder,
									file: false,
									image: false,
								},
							})
						}
					>
						Create Folder
					</button>
				</div>
			</div>
		)
	}
	if (Object.keys(items).length === 0 && state.searchText !== '') {
		return (
			<div className="window__main empty__state">
				No file or folder matched the search term {state.searchText}
			</div>
		)
	}
	return (
		<main className="window__main">
			<MenuProvider id="main__menu">
				{state.isModalVisible.folder && (
					<CreateFolderModal
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				{state.isModalVisible.file && (
					<CreateFileModal
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				{state.isModalVisible.image && (
					<UploadImageModal
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				<div
					className={`window__main__content ${
						state.isPreviewVisible ? 'with__preview' : ''
					}`}
				>
					<div className="window__main__content__left">
						{state.folderView === 'grid' ? (
							<div className="window__main__grid__view">
								{items.folder &&
									items.folder.map((item, index) => (
										<Card {...item} key={index} />
									))}
								{items.file &&
									items.file.map((item, index) => (
										<Card {...item} key={index} />
									))}
							</div>
						) : (
							<div className="window__main__list__view">
								<div className="table__header">
									<div
										className="item__name"
										onClick={() => sortItems('name')}
									>
										<span>Name</span>
										{state.sortBy.column === 'name' && (
											<span>{state.sortBy.order}</span>
										)}
									</div>
									<div
										className="item__date"
										onClick={() => sortItems('createdAt')}
									>
										<span>Date</span>
										{state.sortBy.column ===
											'createdAt' && (
											<span>{state.sortBy.order}</span>
										)}
									</div>
									<div className="item__type">
										<span>Type</span>
									</div>
									<div
										className="item__size"
										onClick={() => sortItems('size')}
									>
										<span>Size</span>
										{state.sortBy.column === 'size' && (
											<span>{state.sortBy.order}</span>
										)}
									</div>
								</div>
								<div className="table__main">
									{items.folder &&
										items.folder.map((item, index) => (
											<TableRow {...item} key={index} />
										))}
									{items.file &&
										items.file.map((item, index) => (
											<TableRow {...item} key={index} />
										))}
								</div>
							</div>
						)}
					</div>
					{state.isPreviewVisible ? (
						<div className="window__main__content__right">
							<FilePreview {...state.previewData} />
						</div>
					) : null}
				</div>
			</MenuProvider>
			<MainMenu id="main__menu" />
		</main>
	)
}

export default Main
