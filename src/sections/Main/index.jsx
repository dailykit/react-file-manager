import React from 'react'
import _ from 'lodash'
import styled from 'styled-components'

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
	const [modal, setModal] = React.useState({
		isVisible: false,
		tabIndex: 0,
	})
	const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_FOLDER, {
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
		refetchQueries: [{ query: GET_FOLDER, variables: { path: state.currentFolder } }],
	})
	const [createFile] = useMutation(CREATE_FILE, {
		onCompleted: ({ createFile }) => {
			addToast(createFile.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [{ query: GET_FOLDER, variables: { path: state.currentFolder } }],
	})
	const [imageUpload] = useMutation(IMAGE_UPLOAD, {
		onCompleted: ({ imageUpload }) => {
			addToast(imageUpload.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [{ query: GET_FOLDER, variables: { path: state.currentFolder } }],
	})

	React.useEffect(() => {
		if (queryData && queryData.getFolderWithFiles) {
			const childrens = queryData.getFolderWithFiles.children.filter(item =>
				item.name.toLowerCase().includes(state.searchText)
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

	let items = _.mapValues(_.groupBy(state.folderData.children || [], 'type'), v =>
		_.orderBy(v, [state.sortBy.column], [state.sortBy.order])
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
			imageUpload({
				variables: {
					files: value,
					path: state.currentFolder,
				},
			})
		}
		setModal({
			isVisible: false,
			tabIndex: 0,
		})
	}

	const onModalClose = () => {
		return setModal({
			isVisible: false,
			tabIndex: 0,
		})
	}

	const MainMenu = () => (
		<Menu id="main__menu">
			<Item
				onClick={() =>
					setModal({
						isVisible: true,
						tabIndex: 0,
					})
				}
			>
				Create File
			</Item>
			<Item
				onClick={() =>
					setModal({
						isVisible: true,
						tabIndex: 1,
					})
				}
			>
				Create Folder
			</Item>
			<Item
				onClick={() =>
					setModal({
						isVisible: true,
						tabIndex: 2,
					})
				}
			>
				Upload Image
			</Item>
		</Menu>
	)
	if (queryLoading) return <div>Loading...</div>
	if (queryError) return console.log(queryError) || <div>Error!</div>
	if (Object.keys(items).length === 0 && state.searchText === '') {
		return (
			<MainWrapper className="window__main empty__state">
				{modal.isVisible && (
					<CreateModal tabIndex={modal.tabIndex} onModalSubmit={onModalSubmit} onModalClose={onModalClose} />
				)}
				<h3>This folder is empty. Start by creating a new folder or a file</h3>
				<div>
					<button
						onClick={() =>
							setModal({
								isVisible: true,
								tabIndex: 0,
							})
						}
					>
						Create File
					</button>
					<button
						onClick={() =>
							setModal({
								isVisible: true,
								tabIndex: 1,
							})
						}
					>
						Create Folder
					</button>
					<button
						onClick={() =>
							setModal({
								isVisible: true,
								tabIndex: 2,
							})
						}
					>
						Upload Image
					</button>
				</div>
			</MainWrapper>
		)
	}
	if (Object.keys(items).length === 0 && state.searchText !== '') {
		return (
			<MainWrapper className="window__main empty__state">
				No file or folder matched the search term {state.searchText}
			</MainWrapper>
		)
	}
	return (
		<MainWrapper className="window__main">
			<MenuProvider id="main__menu">
				{modal.isVisible && (
					<CreateModal tabIndex={modal.tabIndex} onModalSubmit={onModalSubmit} onModalClose={onModalClose} />
				)}
				<ContentWrapper className={`window__main__content ${state.isPreviewVisible ? 'with__preview' : ''}`}>
					<div className="window__main__content__left">
						{state.folderView === 'grid' ? (
							<GridView className="window__main__grid__view">
								{items.folder && items.folder.map((item, index) => <Card {...item} key={index} />)}
								{items.file && items.file.map((item, index) => <Card {...item} key={index} />)}
							</GridView>
						) : (
							<ListView className="window__main__list__view">
								<div className="table__header">
									<div className="item__name" onClick={() => sortItems('name')}>
										<span>Name</span>
										{state.sortBy.column === 'name' && <span>{state.sortBy.order}</span>}
									</div>
									<div className="item__date" onClick={() => sortItems('createdAt')}>
										<span>Date</span>
										{state.sortBy.column === 'createdAt' && <span>{state.sortBy.order}</span>}
									</div>
									<div className="item__type">
										<span>Type</span>
									</div>
									<div className="item__size" onClick={() => sortItems('size')}>
										<span>Size</span>
										{state.sortBy.column === 'size' && <span>{state.sortBy.order}</span>}
									</div>
								</div>
								<div className="table__main">
									{items.folder &&
										items.folder.map((item, index) => <TableRow {...item} key={index} />)}
									{items.file && items.file.map((item, index) => <TableRow {...item} key={index} />)}
								</div>
							</ListView>
						)}
					</div>
					{state.isPreviewVisible ? (
						<FileDetails className="window__main__content__right">
							<FilePreview {...state.previewData} />
						</FileDetails>
					) : null}
				</ContentWrapper>
			</MenuProvider>
			{state.currentFolder.split('/').length > 5 && <MainMenu id="main__menu" />}
		</MainWrapper>
	)
}

export default Main

const MainWrapper = styled.main`
	grid-area: main;
	position: relative;
	width: calc(100vw - 240px);
	overflow-y: auto;
	&.empty__state {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	@media (max-width: 567px) {
		width: calc(100vw - 40px) !important;
		margin-left: 40px;
	}
`

const ContentWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 0;
	height: calc(100vh - 40px);
	&.with__preview {
		grid-template-columns: 1fr 321px;
	}
	@media (max-width: 980px) {
		position: fixed;
		right: 0;
		top: 40px;
		bottom: 0;
		width: 321px;
		background: #fff;
		&.with__preview {
			grid-template-columns: 1fr 0;
			height: calc(100vh - 40px);
		}
	}
	@media (max-width: 567px) {
		height: calc(100vh - 144px);
	}
`

const GridView = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	.item {
		max-width: 130px;
		cursor: pointer;
		height: 150px;
		border-top: none;
		margin: -1px 0 0 -1px;
		text-align: center;
		&:hover {
			background: rgba(#000, 0.05);
		}
	}
	.item__thumbnail {
		width: 100%;
		height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`

const ListView = styled.div`
	display: grid;
	grid-template-rows: 32px 1fr;
	.table__header,
	.table__row {
		display: grid;
		grid-template-columns: 3fr 1fr 1fr 1fr;
	}
	.table__header {
		line-height: 32px;
		border-bottom: 1px solid var(--border);
		div {
			cursor: pointer;
			padding: 0 var(--spacer-2);
			display: flex;
			justify-content: space-between;
			&:hover {
				background: rgba(#000, 0.05);
			}
		}
		div.item__type {
			pointer-events: none;
		}
	}
	.table__main {
		margin-top: -1px;
	}
	.table__row {
		height: 40px;
		line-height: 40px;
		position: relative;
		border-top: 1px solid transparent;
		border-bottom: 1px solid transparent;
		div {
			padding: 0 var(--spacer-2);
		}
		div.item__options {
			position: absolute;
			right: 0;
			background: #fff;
			width: auto;
			height: 38px;
			visibility: hidden;
			display: flex;
			align-items: center;
			button {
				background: transparent;
				border: none;
				height: 32px;
				width: 32px;
				cursor: pointer;
				border-radius: 2px;
				display: flex;
				align-items: center;
				justify-content: center;
				&:hover {
					border: 1px solid var(--border);
				}
			}
		}
		div.item__name {
			cursor: pointer;
		}
		&:hover {
			border-top: 1px solid var(--border);
			border-bottom: 1px solid var(--border);
			div.item__options {
				visibility: visible;
			}
		}
	}
`

const FileDetails = styled.div`
	border-left: 1px solid var(--border);
	padding: var(--spacer-2);
	.preview__main {
		div {
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
	#file__preview {
		position: fixed;
		width: 288px;
	}

	.preview__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		button {
			background: transparent;
			border: none;
			cursor: pointer;
		}
	}

	.preview__thumbnail {
		height: 200px;
		width: 100%;
		background: rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 16px 0;
	}
	@media (max-width: 980px) {
		position: fixed;
		right: 0;
		top: 40px;
		bottom: 0;
		width: 321px;
		background: #fff;
	}
	@media (max-width: 567px) {
		position: fixed;
		right: 0;
		top: 80px;
		bottom: 0;
		width: 321px;
		background: #fff;
	}
`
