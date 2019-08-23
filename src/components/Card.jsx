import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Menu, Item, MenuProvider } from 'react-contexify'

import Modal from '../components/Modal'

import GET_FOLDER from '../queries/getFolder'
import DELETE_FOLDER from '../queries/deleteFolder'
import DELETE_FILE from '../queries/deleteFile'
import RENAME_FILE from '../queries/renameFile'
import RENAME_FOLDER from '../queries/renameFolder'

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
	const CardMenu = () =>
		props.path.split('/').length > 3 && (
			<Menu id={generateId}>
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
			</Menu>
		)
	return (
		<React.Fragment>
			<MenuProvider id={generateId}>
				{isCreateModalVisible.folder && CreatePopup}
				{isCreateModalVisible.file && CreatePopup}
				<div
					className="item"
					onClick={() => props.showHidePreview(props)}
				>
					<div className="item__thumbnail">
						<div />
					</div>
					<span className="item__name">{props.name}</span>
				</div>
			</MenuProvider>
			<CardMenu />
		</React.Fragment>
	)
}

export default Card
