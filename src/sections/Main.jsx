import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import { useMutation } from '@apollo/react-hooks'

// Components
import FilePreview from '../components/FilePreview'
import Card from '../components/Card'
import TableRow from '../components/TableRow'
import Modal from '../components/Modal'

// Queries
import GET_FOLDER from '../queries/getFolder'
import CREATE_FOLDER from '../queries/createFolder'
import CREATE_FILE from '../queries/createFile'

const Main = ({ currentFolderPath, view, preview, togglePreview }) => {
	const [isCreateModalVisible, setCreateModalVisibility] = React.useState({
		folder: false,
		file: false,
	})
	const [folderName, setFolderName] = React.useState('')
	const [fileName, setFileName] = React.useState('')
	const [previewData, setPreviewData] = React.useState({})
	const [folderData, setFolderData] = React.useState({
		name: '',
		path: '',
		children: {},
	})
	const [sort, sortBy] = React.useState({
		column: 'name',
		order: 'asc',
	})
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
			setFolderData({
				name: queryData.getFolderWithFiles.name,
				path: queryData.getFolderWithFiles.path,
				children: queryData.getFolderWithFiles.children,
			})
		}
	}, [queryData])

	let items = _.mapValues(_.groupBy(folderData.children || [], 'type'), v =>
		_.orderBy(v, [sort.column], [sort.order])
	)

	const showHidePreview = (data, from) => {
		if (from === 'fromPreview') {
			togglePreview(false)
		}
		if (!preview && from !== 'fromPreview') {
			togglePreview(!preview)
		}
		setPreviewData(data)
	}

	const sortItems = by => {
		sortBy({
			column: by,
			order: sort.order === 'asc' ? 'desc' : 'asc',
		})
	}
	const CreatePopup = (
		<Modal>
			<Modal.Header>
				{isCreateModalVisible.file ? 'Create File' : 'Create Folder'}
			</Modal.Header>
			<Modal.Body>
				<label htmlFor="create__folder__input">
					{isCreateModalVisible.file ? 'File Name' : 'Folder Name'}
				</label>
				<input
					type="text"
					name="createFolder"
					id="create__folder__input"
					value={isCreateModalVisible.file ? fileName : folderName}
					placeholder={
						isCreateModalVisible.file
							? 'File Name'
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
							createFolder({
								variables: {
									path: `${currentFolderPath}/${folderName}`,
								},
							})
						} else {
							createFile({
								variables: {
									path: `${currentFolderPath}/${fileName}.json`,
									type: currentFolderPath
										.match(/[^/]+$/g)[0]
										.toLowerCase(),
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
						? 'Create File'
						: 'Create Folder'}
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

	if (queryLoading) return <div>Loading...</div>
	if (queryError) return console.log(queryError) || <div>Error!</div>
	if (Object.keys(items).length === 0) {
		return (
			<div className="window__main empty__state">
				{isCreateModalVisible.folder && CreatePopup}
				{isCreateModalVisible.file && CreatePopup}
				<h3>
					This folder is empty. Start by creating a new folder or a
					file
				</h3>
				<div>
					<button
						onClick={() =>
							setCreateModalVisibility({
								file: !isCreateModalVisible.file,
							})
						}
					>
						Create File
					</button>
					<button
						onClick={() =>
							setCreateModalVisibility({
								folder: !isCreateModalVisible.folder,
							})
						}
					>
						Create Folder
					</button>
				</div>
			</div>
		)
	}
	return (
		<main className="window__main">
			{isCreateModalVisible.folder && CreatePopup}
			{isCreateModalVisible.file && CreatePopup}
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
									{sort.column === 'name' && (
										<span>{sort.order}</span>
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
									{sort.column === 'size' && (
										<span>{sort.order}</span>
									)}
								</div>
							</div>
							<div className="table__main">
								{items.folder &&
									items.folder.map((item, index) => (
										<TableRow
											{...item}
											key={index}
											showHidePreview={showHidePreview}
										/>
									))}
								{items.file &&
									items.file.map((item, index) => (
										<TableRow
											{...item}
											key={index}
											showHidePreview={showHidePreview}
										/>
									))}
							</div>
						</div>
					)}
				</div>
				{preview ? (
					<div className="window__main__content__right">
						<FilePreview {...previewData} />
					</div>
				) : null}
			</div>
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
