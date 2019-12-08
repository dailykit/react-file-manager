import React from 'react'
import PropTypes from 'prop-types'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { useToasts } from 'react-toast-notifications'

// Context
import { Context } from '../../../state/context'

// Components
import Modal from '../../Modal'

// Styles
import { Row, RowCell } from './styles'

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
import convertFileSize from '../../../utils/convertFileSize'
import useClick from '../../../utils/useClick'

// Assets
import { TrashIcon, InfoIcon } from '../../../assets/Icon'

const TableRow = ({ name, type, size, path, createdAt }) => {
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
			path: path
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
				path: path,
			},
		})
	}
	const openFolder = () =>
		dispatch({ type: 'SET_CURRENT_FOLDER', payload: path })

	const showPreview = () => {
		dispatch({
			type: 'SET_PREVIEW_DATA',
			payload: {
				name,
				type,
				size,
			},
		})
		dispatch({ type: 'TOGGLE_PREVIEW', payload: true })
	}

	const doubleClick = () => (type === 'file' ? openFile() : openFolder())

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
									oldPath: path,
									newPath: `${path
										.split('/')
										.slice(0, -1)
										.join('/')}/${folderName}`,
								},
							})
						} else {
							renameFile({
								variables: {
									oldPath: path,
									newPath: `${path
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

	return (
		<React.Fragment>
			<ContextMenuTrigger id={generateId}>
				{isCreateModalVisible.folder && <CreatePopup />}
				{isCreateModalVisible.file && <CreatePopup />}
				<Row>
					<RowCell
						onClick={() => callSingleClick(showPreview)}
						onDoubleClick={() => callDoubleClick(doubleClick)}
						title={name}
					>
						{name.length > 20 ? name.slice(0, 20) + '...' : name}
					</RowCell>
					<RowCell>
						{new Intl.DateTimeFormat('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						}).format(createdAt)}
					</RowCell>
					<RowCell>{type}</RowCell>
					<RowCell>{size && `${convertFileSize(size)}`}</RowCell>
					<RowCell withOptions className="item__options">
						<button onClick={() => showPreview()}>
							<InfoIcon color="#fff" />
						</button>
						{state.currentFolder.split('/').length > 5 && (
							<button
								onClick={() => {
									const args = {
										variables: {
											path,
										},
									}
									return type === 'folder'
										? deleteFolder(args)
										: deleteFile(args)
								}}
							>
								<TrashIcon color="#fff" />
							</button>
						)}
					</RowCell>
				</Row>
			</ContextMenuTrigger>
			<ContextMenu id={generateId}>
				{type === 'file' ? (
					<MenuItem onClick={() => openFile()}>Open File</MenuItem>
				) : (
					<MenuItem onClick={() => openFolder()}>
						Open Folder
					</MenuItem>
				)}
				{state.currentFolder.split('/').length > 5 && (
					<MenuItem
						onClick={() => {
							if (type === 'file') {
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
						Rename {type === 'file' ? 'file' : 'folder'}
					</MenuItem>
				)}

				{state.currentFolder.split('/').length > 5 && (
					<MenuItem
						onClick={() => {
							const args = {
								variables: {
									path,
								},
							}
							return type === 'file'
								? deleteFile(args)
								: deleteFolder(args)
						}}
					>
						Delete {type === 'file' ? 'file' : 'folder'}
					</MenuItem>
				)}
			</ContextMenu>
		</React.Fragment>
	)
}

TableRow.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	type: PropTypes.string,
	path: PropTypes.string,
}

export default TableRow
