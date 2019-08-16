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

const Main = ({ currentFolderPath, view, preview, togglePreview }) => {
	const [isCreateModalVisible, setCreateModalVisibility] = React.useState(
		false
	)
	const [folderName, setFolderName] = React.useState('')
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
	const [createFolder, { data: mutationData }] = useMutation(CREATE_FOLDER, {
		refetchQueries: [
			{ query: GET_FOLDER, variables: { path: currentFolderPath } },
		],
	})

	React.useEffect(() => {
		if (queryData.contentWithFilesData) {
			setFolderData({
				name: queryData.contentWithFilesData.name,
				path: queryData.contentWithFilesData.path,
				children: queryData.contentWithFilesData.children,
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
	if (queryLoading) return <div>Loading...</div>
	if (queryError) return console.log(queryError) || <div>Error!</div>
	if (Object.keys(items).length === 0) {
		return (
			<div className="window__main empty__state">
				{isCreateModalVisible && (
					<Modal>
						<Modal.Header>Create Folder</Modal.Header>
						<Modal.Body>
							<label htmlFor="create__folder__input">
								Folder Name
							</label>
							<input
								type="text"
								name="createFolder"
								id="create__folder__input"
								value={folderName}
								placeholder="Enter a folder name"
								onChange={e => setFolderName(e.target.value)}
							/>
						</Modal.Body>
						<Modal.Footer>
							<button
								onClick={() => {
									createFolder({
										variables: {
											path: `${currentFolderPath}/${folderName}`,
										},
									})
									setCreateModalVisibility(
										!isCreateModalVisible
									)
								}}
							>
								Create Folder
							</button>
							<button
								onClick={() =>
									setCreateModalVisibility(
										!isCreateModalVisible
									)
								}
							>
								Cancel
							</button>
						</Modal.Footer>
					</Modal>
				)}
				<h3>
					This folder is empty. Start by creating a new folder or a
					file
				</h3>
				<div>
					<button>Create File</button>
					<button
						onClick={() =>
							setCreateModalVisibility(!isCreateModalVisible)
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
			{isCreateModalVisible && (
				<Modal>
					<Modal.Header>Create Folder</Modal.Header>
					<Modal.Body>
						<label htmlFor="create__folder__input">
							Folder Name
						</label>
						<input
							type="text"
							name="createFolder"
							id="create__folder__input"
							value={folderName}
							placeholder="Enter a folder name"
							onChange={e => setFolderName(e.target.value)}
						/>
					</Modal.Body>
					<Modal.Footer>
						<button
							onClick={() => {
								createFolder({
									variables: {
										path: `${currentFolderPath}/${folderName}`,
									},
								})
								setCreateModalVisibility(!isCreateModalVisible)
							}}
						>
							Create Folder
						</button>
						<button
							onClick={() =>
								setCreateModalVisibility(!isCreateModalVisible)
							}
						>
							Cancel
						</button>
					</Modal.Footer>
				</Modal>
			)}
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
