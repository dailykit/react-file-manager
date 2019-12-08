import React from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import PropTypes from 'prop-types'
import { useToasts } from 'react-toast-notifications'

// State
import { Context } from '../../../state/context'

// Components
import Modal from '../../Modal'

// Queries
import {
	GET_FOLDER,
	DELETE_FOLDER,
	DELETE_FILE,
	RENAME_FILE,
	RENAME_FOLDER,
	OPEN_FILE,
} from '../../../queries'

// Helpers
import useClick from '../../../utils/useClick'

// Assets
import { FolderCloseIcon, FileText } from '../../../assets/Icon'

// Styles
import { CardWrapper, Thumb } from './styles'

const Card = ({ item }) => {
	const { addToast } = useToasts()
	const { state, dispatch } = React.useContext(Context)
	const [folderName, setFolderName] = React.useState('')
	const [fileName, setFileName] = React.useState('')
	const [callSingleClick, callDoubleClick] = useClick()
	const [isCreateModalVisible, setCreateModalVisibility] = React.useState({
		folder: false,
		file: false,
	})

	const refetchOptions = {
		query: GET_FOLDER,
		variables: {
			path: item.path
				.split('/')
				.slice(0, -1)
				.join('/'),
		},
	}

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
				path: item.path,
			},
		})
	}

	const openFolder = () =>
		dispatch({ type: 'SET_CURRENT_FOLDER', payload: item.path })

	const singleClick = () => {
		dispatch({
			type: 'SET_PREVIEW_DATA',
			payload: {
				name: item.name,
				type: item.type,
				size: item.size,
			},
		})
		dispatch({ type: 'TOGGLE_PREVIEW', payload: true })
	}
	const doubleClick = () => (item.type === 'file' ? openFile() : openFolder())

	const CreatePopup = () => (
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
									oldPath: item.path,
									newPath: `${item.path
										.split('/')
										.slice(0, -1)
										.join('/')}/${folderName}`,
								},
							})
						} else {
							renameFile({
								variables: {
									oldPath: item.path,
									newPath: `${item.path
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
		<ContextMenu id={generateId}>
			{item.type === 'file' ? (
				<MenuItem onClick={() => openFile()}>Open File</MenuItem>
			) : (
				<MenuItem onClick={() => openFolder()}>Open Folder</MenuItem>
			)}
			{state.currentFolder.split('/').length > 5 && (
				<MenuItem
					onClick={() => {
						if (item.type === 'file') {
							return setCreateModalVisibility({
								file: !isCreateModalVisible.file,
							})
						}
						setCreateModalVisibility({
							folder: !isCreateModalVisible.folder,
						})
					}}
				>
					Rename {item.type === 'file' ? 'file' : 'folder'}
				</MenuItem>
			)}
			{state.currentFolder.split('/').length > 5 && (
				<MenuItem
					onClick={() => {
						const args = {
							variables: {
								path: item.path,
							},
						}
						return item.type === 'file'
							? deleteFile(args)
							: deleteFolder(args)
					}}
				>
					Delete {item.type === 'file' ? 'file' : 'folder'}
				</MenuItem>
			)}
		</ContextMenu>
	)

	return (
		<React.Fragment>
			<ContextMenuTrigger id={generateId}>
				{isCreateModalVisible.folder && CreatePopup}
				{isCreateModalVisible.file && CreatePopup}
				<CardWrapper
					onClick={() => callSingleClick(singleClick)}
					onDoubleClick={() => callDoubleClick(doubleClick)}
					title={item.name}
				>
					<Thumb>
						{item.type === 'folder' ? (
							<FolderCloseIcon />
						) : (
							<FileText size={35} color="#6A91EE" />
						)}
					</Thumb>
					<span>
						{item.name.length > 12
							? item.name.slice(0, 12) + '...'
							: item.name}
					</span>
				</CardWrapper>
			</ContextMenuTrigger>
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
