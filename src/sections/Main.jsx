import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import { useMutation } from '@apollo/react-hooks'
import { Menu, Item, MenuProvider } from 'react-contexify'

// Components
import FilePreview from '../components/FilePreview'
import Card from '../components/Card'
import TableRow from '../components/TableRow'
import Modal from '../components/Modal'

// Queries
import GET_FOLDER from '../queries/getFolder'
import CREATE_FOLDER from '../queries/createFolder'
import CREATE_FILE from '../queries/createFile'

import 'react-contexify/dist/ReactContexify.min.css'

import { initialState, reducers } from '../state/main'

const Main = ({
	currentFolderPath,
	view,
	preview,
	togglePreview,
	searchTerm,
	setFolderPath,
}) => {
	const [state, dispatch] = React.useReducer(reducers, initialState)
	const {
		loading: queryLoading,
		error: queryError,
		data: queryData,
	} = useQuery(GET_FOLDER, {
		variables: {
			path: currentFolderPath,
		},
	})
	const [createFolder] = useMutation(CREATE_FOLDER, {
		refetchQueries: [
			{ query: GET_FOLDER, variables: { path: currentFolderPath } },
		],
	})
	const [createFile] = useMutation(CREATE_FILE, {
		refetchQueries: [
			{ query: GET_FOLDER, variables: { path: currentFolderPath } },
		],
	})

	React.useEffect(() => {
		if (queryData.getFolderWithFiles) {
			const childrens = queryData.getFolderWithFiles.children.filter(
				item => item.name.toLowerCase().includes(searchTerm)
			)
			dispatch({
				type: 'setFolderData',
				payload: {
					name: queryData.getFolderWithFiles.name,
					path: queryData.getFolderWithFiles.path,
					children: childrens,
				},
			})
		}
	}, [queryData, searchTerm])

	let items = _.mapValues(
		_.groupBy(state.folderData.children || [], 'type'),
		v => _.orderBy(v, [state.sortBy.column], [state.sortBy.order])
	)

	const showHidePreview = (data, from) => {
		if (from === 'fromPreview') {
			togglePreview(false)
		}
		if (!preview && from !== 'fromPreview') {
			togglePreview(!preview)
		}
		dispatch({ type: 'setPreviewData', payload: data })
	}

	const sortItems = by => {
		dispatch({
			type: 'sortBy',
			payload: {
				column: by,
				order: state.sortBy.order === 'asc' ? 'desc' : 'asc',
			},
		})
	}

	const onModalSubmit = () => {
		if (state.isModalVisible.folder) {
			createFolder({
				variables: {
					path: `${currentFolderPath}/${state.folderName}`,
				},
			})
		} else {
			createFile({
				variables: {
					path: `${currentFolderPath}/${state.fileName}.json`,
					type: currentFolderPath.split('/')[2].toLowerCase(),
				},
			})
		}
		dispatch({
			type: 'toggleModal',
			payload: {
				folder: false,
				file: false,
			},
		})
	}

	const onModalClose = () => {
		return dispatch({
			type: 'toggleModal',
			payload: {
				folder: false,
				file: false,
			},
		})
	}

	const CreatePopup = (
		<Modal>
			<Modal.Header>
				{state.isModalVisible.file ? 'Create File' : 'Create Folder'}
			</Modal.Header>
			<Modal.Body>
				<label htmlFor="modal__input">
					{state.isModalVisible.file ? 'File Name' : 'Folder Name'}
				</label>
				<input
					type="text"
					name="createFolder"
					id="modal__input"
					value={
						state.isModalVisible.file
							? state.fileName
							: state.folderName
					}
					placeholder={
						state.isModalVisible.file
							? 'Enter a file name'
							: 'Enter a folder name'
					}
					onChange={e =>
						state.isModalVisible.file
							? dispatch({
									type: 'setFileName',
									payload: e.target.value,
							  })
							: dispatch({
									type: 'setFolderName',
									payload: e.target.value,
							  })
					}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button onClick={() => onModalSubmit()}>
					{state.isModalVisible.file
						? 'Create File'
						: 'Create Folder'}
				</button>
				<button onClick={() => onModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
	const MainMenu = () =>
		currentFolderPath.split('/').length > 2 && (
			<Menu id="main__menu">
				<Item
					onClick={() =>
						dispatch({
							type: 'toggleModal',
							payload: {
								folder: false,
								file: !state.isModalVisible.file,
							},
						})
					}
				>
					Create File
				</Item>
				{currentFolderPath.split('/').length < 6 && (
					<Item
						onClick={() =>
							dispatch({
								type: 'toggleModal',
								payload: {
									folder: !state.isModalVisible.folder,
									file: false,
								},
							})
						}
					>
						Create Folder
					</Item>
				)}
			</Menu>
		)
	if (queryLoading) return <div>Loading...</div>
	if (queryError) return console.log(queryError) || <div>Error!</div>
	if (Object.keys(items).length === 0 && searchTerm === '') {
		return (
			<div className="window__main empty__state">
				{state.isModalVisible.folder && CreatePopup}
				{state.isModalVisible.file && CreatePopup}
				<h3>
					This folder is empty. Start by creating a new folder or a
					file
				</h3>
				<div>
					<button
						onClick={() =>
							dispatch({
								type: 'toggleModal',
								payload: {
									folder: false,
									file: !state.isModalVisible.file,
								},
							})
						}
					>
						Create File
					</button>
					{currentFolderPath.split('/').length > 2 &&
						currentFolderPath.split('/').length < 6 && (
							<button
								onClick={() =>
									dispatch({
										type: 'toggleModal',
										payload: {
											folder: !state.isModalVisible
												.folder,
											file: false,
										},
									})
								}
							>
								Create Folder
							</button>
						)}
				</div>
			</div>
		)
	}
	if (Object.keys(items).length === 0 && searchTerm !== '') {
		return (
			<div className="window__main empty__state">
				No file or folder matched the search term {searchTerm}
			</div>
		)
	}
	return (
		<main className="window__main">
			<MenuProvider id="main__menu">
				{state.isModalVisible.folder && CreatePopup}
				{state.isModalVisible.file && CreatePopup}
				<div
					className={`window__main__content ${
						preview ? 'with__preview' : ''
					}`}
				>
					<div className="window__main__content__left">
						{view === 'grid' ? (
							<div className="window__main__grid__view">
								{items.folder &&
									items.folder.map((item, index) => (
										<Card
											{...item}
											key={index}
											setFolderPath={setFolderPath}
											showHidePreview={showHidePreview}
										/>
									))}
								{items.file &&
									items.file.map((item, index) => (
										<Card
											{...item}
											key={index}
											showHidePreview={showHidePreview}
										/>
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
											<TableRow
												{...item}
												key={index}
												setFolderPath={setFolderPath}
												showHidePreview={
													showHidePreview
												}
											/>
										))}
									{items.file &&
										items.file.map((item, index) => (
											<TableRow
												{...item}
												key={index}
												showHidePreview={
													showHidePreview
												}
											/>
										))}
								</div>
							</div>
						)}
					</div>
					{preview ? (
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

Main.propTypes = {
	currentFolderPath: PropTypes.string,
	view: PropTypes.string,
	preview: PropTypes.bool,
	togglePreview: PropTypes.func,
}

export default Main
