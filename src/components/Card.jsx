import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Menu, Item, MenuProvider } from 'react-contexify'
import PropTypes from 'prop-types'

import Modal from '../components/Modal'

import GET_FOLDER from '../queries/getFolder'
import DELETE_FOLDER from '../queries/deleteFolder'
import DELETE_FILE from '../queries/deleteFile'
import RENAME_FILE from '../queries/renameFile'
import RENAME_FOLDER from '../queries/renameFolder'
import ADD_FILE_TO_SOCKET_CHANNEL from '../queries/addFileToSocketChannel'

import { FolderIcon, FileText } from '../assets/Icon'

const Card = props => {
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
	const [deleteFolder] = useMutation(DELETE_FOLDER, {
		refetchQueries: [refetchOptions],
	})
	const [deleteFile] = useMutation(DELETE_FILE, {
		refetchQueries: [refetchOptions],
	})
	const [renameFile] = useMutation(RENAME_FILE, {
		refetchQueries: [refetchOptions],
	})
	const [renameFolder] = useMutation(RENAME_FOLDER, {
		refetchQueries: [refetchOptions],
	})
	const [addFileToSocketChannel] = useMutation(ADD_FILE_TO_SOCKET_CHANNEL)
	const openFile = () =>
		addFileToSocketChannel({ variables: { path: props.path } })
	const openFolder = () => props.setFolderPath(props.path)

	let clickCount = 0
	let singleClickTimer
	const singleClick = () => {
		props.showHidePreview({
			props,
		})
	}
	const handleDoubleClick = () =>
		props.type === 'file' ? openFile() : openFolder()
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
			<Modal.Header>
				{isCreateModalVisible.file ? 'Rename File' : 'Rename Folder'}
			</Modal.Header>
			<Modal.Body>
				<label htmlFor="rename__folder__input">
					{isCreateModalVisible.file ? 'File Name' : 'Folder Name'}
				</label>
				<input
					type="text"
					name="createFolder"
					id="rename__folder__input"
					value={isCreateModalVisible.file ? fileName : folderName}
					placeholder={
						isCreateModalVisible.file
							? 'Enter a file name'
							: 'Enter a folder name'
					}
					onChange={e =>
						isCreateModalVisible.file
							? setFileName(e.target.value)
							: setFolderName(e.target.value)
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
					{isCreateModalVisible.file
						? 'Rename File'
						: 'Rename Folder'}
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
			{props.path.split('/').length > 3 && (
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
			{props.path.split('/').length > 3 && (
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
				<div
					className="item"
					onClick={() => handleClicks()}
					title={props.name}
				>
					<div className="item__thumbnail">
						{props.type === 'folder' ? (
							FolderIcon
						) : (
							<FileText size={35} color="#6A91EE" />
						)}
					</div>
					<span className="item__name">
						{props.name.slice(0, 12) + '...'}
					</span>
				</div>
			</MenuProvider>
			<CardMenu />
		</React.Fragment>
	)
}

Card.propTypes = {
	name: PropTypes.string,
	showHidePreview: PropTypes.func,
	path: PropTypes.string,
	type: PropTypes.string,
}

export default Card
