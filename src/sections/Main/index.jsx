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

import CreateModal from './CreateModal'

const Main = () => {
	const { state, dispatch } = React.useContext(Context)
	const [isModalVisible, setIsModalVisible] = React.useState(false)
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

	const onModalSubmit = ({ value, type }) => {
		if (type === 'folder') {
			createFolder({
				variables: {
					path: `${state.currentFolder}/${value}`,
				},
			})
		} else if (type === 'file') {
			createFile({
				variables: {
					path: `${state.currentFolder}/${value}.json`,
					content: '',
				},
			})
		} else {
			const { files } = value
			imageUpload({
				variables: {
					files,
					path: state.currentFolder,
				},
			})
		}
		setIsModalVisible(!isModalVisible)
	}

	const onModalClose = () => {
		return setIsModalVisible(!isModalVisible)
	}

	const MainMenu = () => (
		<Menu id="main__menu">
			<Item onClick={() => setIsModalVisible(!isModalVisible)}>
				Create File
			</Item>
			<Item onClick={() => setIsModalVisible(!isModalVisible)}>
				Create Folder
			</Item>
			<Item onClick={() => setIsModalVisible(!isModalVisible)}>
				Upload Image
			</Item>
		</Menu>
	)
	if (queryLoading) return <div>Loading...</div>
	if (queryError) return console.log(queryError) || <div>Error!</div>
	if (Object.keys(items).length === 0 && state.searchText === '') {
		return (
			<div className="window__main empty__state">
				{isModalVisible && (
					<CreateModal
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				<h3>
					This folder is empty. Start by creating a new folder or a
					file
				</h3>
				<div>
					<button onClick={() => setIsModalVisible(!isModalVisible)}>
						Create File
					</button>
					<button onClick={() => setIsModalVisible(!isModalVisible)}>
						Upload Image
					</button>
					<button onClick={() => setIsModalVisible(!isModalVisible)}>
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
				{isModalVisible && (
					<CreateModal
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
			{state.currentFolder.split('/').length > 5 && (
				<MainMenu id="main__menu" />
			)}
		</main>
	)
}

export default Main
