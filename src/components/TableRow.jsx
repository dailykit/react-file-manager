import React from 'react'
import PropTypes from 'prop-types'

import { useMutation } from '@apollo/react-hooks'
import { Menu, Item, MenuProvider } from 'react-contexify'

import Modal from '../components/Modal'

// Queries
import GET_FOLDER from '../queries/getFolder'
import DELETE_FOLDER from '../queries/deleteFolder'
import DELETE_FILE from '../queries/deleteFile'
import RENAME_FILE from '../queries/renameFile'
import RENAME_FOLDER from '../queries/renameFolder'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'

const TableRow = ({ showHidePreview, name, type, size, path }) => {
	const [isCreateModalVisible, setCreateModalVisibility] = React.useState({
		folder: false,
		file: false,
	})
	const [folderName, setFolderName] = React.useState('')
	const [fileName, setFileName] = React.useState('')
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
	const Delete = (
		<button
			onClick={() => {
				if (type === 'folder') {
					return deleteFolder({
						variables: {
							path,
						},
					})
				}
				return deleteFile({
					variables: {
						path,
					},
				})
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#000000"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polyline points="3 6 5 6 21 6" />
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				<line x1="10" y1="11" x2="10" y2="17" />
				<line x1="14" y1="11" x2="14" y2="17" />
			</svg>
		</button>
	)
	const Preview = (
		<button
			onClick={() =>
				showHidePreview({ name, type, size, showHidePreview })
			}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#000000"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="16" x2="12" y2="12" />
				<line x1="12" y1="8" x2="12" y2="8" />
			</svg>
		</button>
	)
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
	const TableRowMenu = () =>
		path.split('/').length > 3 && (
			<Menu id={generateId}>
				<Item
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
				</Item>
				<Item
					onClick={() => {
						if (type === 'file') {
							deleteFile({
								variables: {
									path,
								},
							})
							return
						}
						return deleteFolder({
							variables: {
								path,
							},
						})
					}}
				>
					Delete {type === 'file' ? 'file' : 'folder'}
				</Item>
			</Menu>
		)
	return (
		<React.Fragment>
			<MenuProvider id={generateId}>
				{isCreateModalVisible.folder && CreatePopup}
				{isCreateModalVisible.file && CreatePopup}
				<div className="table__row">
					<div
						className="item__name"
						onClick={() =>
							showHidePreview({
								name,
								type,
								size,
								showHidePreview,
							})
						}
					>
						{name}
					</div>
					<div className="item__type">{type}</div>
					<div className="item__size">
						{size && `${convertFileSize(size)}`}
					</div>
					<div className="item__options">
						{Preview}
						{path.split('/').length > 3 && Delete}
					</div>
				</div>
			</MenuProvider>
			<TableRowMenu />
		</React.Fragment>
	)
}

TableRow.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	type: PropTypes.string,
	showHidePreview: PropTypes.func,
}

export default TableRow
