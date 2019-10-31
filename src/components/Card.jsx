import React from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import { Menu, Item, MenuProvider } from 'react-contexify'
import PropTypes from 'prop-types'

import { useToasts } from 'react-toast-notifications'

import Modal from '../components/Modal'

import GET_FOLDER from '../queries/getFolder'
import DELETE_FOLDER from '../queries/deleteFolder'
import DELETE_FILE from '../queries/deleteFile'
import RENAME_FILE from '../queries/renameFile'
import RENAME_FOLDER from '../queries/renameFolder'
import OPEN_FILE from '../queries/openFile'

import { FolderCloseIcon, FileText } from '../assets/Icon'
import { Context } from '../state/context'

const Card = props => {
	const { state, dispatch } = React.useContext(Context)
	const [isCreateModalVisible, setCreateModalVisibility] = React.useState({
		folder: false,
		file: false,
	})
	const [folderName, setFolderName] = React.useState('')
	const [fileName, setFileName] = React.useState('')
	const refetchOptions = {
		query: GET_FOLDER,
		variables: {
			path: props.path
				.split('/')
				.slice(0, -1)
				.join('/'),
		},
	}
	const { addToast } = useToasts()
	const [deleteFolder] = useMutation(DELETE_FOLDER, {
		onCompleted: ({ deleteFolder }) => {
			addToast(deleteFolder.message, {
				appearance: 'warning',
				autoDismiss: true,
			})
		},
		refetchQueries: [refetchOptions],
	})
	const [deleteFile] = useMutation(DELETE_FILE, {
		onCompleted: ({ deleteFile }) => {
			addToast(deleteFile.message, {
				appearance: 'warning',
				autoDismiss: true,
			})
		},
		refetchQueries: [refetchOptions],
	})
	const [renameFile] = useMutation(RENAME_FILE, {
		onCompleted: ({ renameFile }) => {
			addToast(renameFile.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [refetchOptions],
	})
	const [renameFolder] = useMutation(RENAME_FOLDER, {
		onCompleted: ({ renameFolder }) => {
			addToast(renameFolder.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [refetchOptions],
	})
	const [openFileQuery] = useLazyQuery(OPEN_FILE, {
		onCompleted: () => {
			addToast('Opened file in editor!', {
				appearance: 'success',
				autoDismiss: true,
			})
		},
	})

	const openFile = () => {
		openFileQuery({
			variables: {
				path: props.path,
			},
		})
	}

	const openFolder = () => dispatch({ type: 'SET_CURRENT_FOLDER', payload: props.path })

	let clickCount = 0
	let singleClickTimer
	const singleClick = () => {
		dispatch({
			type: 'SET_PREVIEW_DATA',
			payload: {
				name: props.name,
				type: props.type,
				size: props.size,
			},
		})
		dispatch({ type: 'TOGGLE_PREVIEW', payload: true })
	}
	const handleDoubleClick = () => (props.type === 'file' ? openFile() : openFolder())
	const handleClicks = () => {
		clickCount++
		if (clickCount === 1) {
			singleClickTimer = setTimeout(function() {
				clickCount = 0
				singleClick()
			}, 300)
		} else if (clickCount === 2) {
			clearTimeout(singleClickTimer)
			clickCount = 0
			handleDoubleClick()
		}
	}

	const CreatePopup = (
		<Modal>
			<Modal.Header>{isCreateModalVisible.file ? 'Rename File' : 'Rename Folder'}</Modal.Header>
			<Modal.Body>
				<label htmlFor="rename__folder__input">{isCreateModalVisible.file ? 'File Name' : 'Folder Name'}</label>
				<input
					type="text"
					name="createFolder"
					id="rename__folder__input"
					value={isCreateModalVisible.file ? fileName : folderName}
					placeholder={isCreateModalVisible.file ? 'Enter a file name' : 'Enter a folder name'}
					onChange={e =>
						isCreateModalVisible.file ? setFileName(e.target.value) : setFolderName(e.target.value)
					}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button
					onClick={() => {
						if (isCreateModalVisible.folder) {
							renameFolder({
								variables: {
									oldPath: props.path,
									newPath: `${props.path
										.split('/')
										.slice(0, -1)
										.join('/')}/${folderName}`,
								},
							})
						} else {
							renameFile({
								variables: {
									oldPath: props.path,
									newPath: `${props.path
										.split('/')
										.slice(0, -1)
										.join('/')}/${fileName}.json`,
								},
							})
						}
						setCreateModalVisibility({
							folder: false,
							file: false,
						})
					}}
				>
					{isCreateModalVisible.file ? 'Rename File' : 'Rename Folder'}
				</button>
				<button
					onClick={() =>
						setCreateModalVisibility({
							folder: false,
							file: false,
						})
					}
				>
					Cancel
				</button>
			</Modal.Footer>
		</Modal>
	)
	const generateId = `table__row__menu${Math.random()}`
	const CardMenu = () => (
		<Menu id={generateId}>
			{props.type === 'file' ? (
				<Item onClick={() => openFile()}>Open File</Item>
			) : (
				<Item onClick={() => openFolder()}>Open Folder</Item>
			)}
			{state.currentFolder.split('/').length > 5 && (
				<Item
					onClick={() => {
						if (props.type === 'file') {
							setCreateModalVisibility({
								file: !isCreateModalVisible.file,
							})
							return
						}
						setCreateModalVisibility({
							folder: !isCreateModalVisible.folder,
						})
					}}
				>
					Rename {props.type === 'file' ? 'file' : 'folder'}
				</Item>
			)}
			{state.currentFolder.split('/').length > 5 && (
				<Item
					onClick={() => {
						if (props.type === 'file') {
							deleteFile({
								variables: {
									path: props.path,
								},
							})
							return
						}
						return deleteFolder({
							variables: {
								path: props.path,
							},
						})
					}}
				>
					Delete {props.type === 'file' ? 'file' : 'folder'}
				</Item>
			)}
		</Menu>
	)

	return (
		<React.Fragment>
			<MenuProvider id={generateId}>
				{isCreateModalVisible.folder && CreatePopup}
				{isCreateModalVisible.file && CreatePopup}
				<div className="item" onClick={() => handleClicks()} title={props.name}>
					<div className="item__thumbnail">
						{props.type === 'folder' ? <FolderCloseIcon /> : <FileText size={35} color="#6A91EE" />}
					</div>
					<span className="item__name">
						{props.name.length > 12 ? props.name.slice(0, 12) + '...' : props.name}
					</span>
				</div>
			</MenuProvider>
			<CardMenu />
		</React.Fragment>
	)
}

Card.propTypes = {
	name: PropTypes.string,
	path: PropTypes.string,
	type: PropTypes.string,
}

export default Card
