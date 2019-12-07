import React from 'react'
import _ from 'lodash'
import styled, { css } from 'styled-components'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Menu, Item, MenuProvider } from 'react-contexify'
import { useToasts } from 'react-toast-notifications'

// Context
import { Context } from '../../state/context'

// Components
import { FilePreview, Grid, Table } from '../../components'
import CreateModal from './CreateModal'

// Queries
import {
	GET_FOLDER,
	CREATE_FOLDER,
	CREATE_FILE,
	IMAGE_UPLOAD,
} from '../../queries'

// Styles
import 'react-contexify/dist/ReactContexify.min.css'

const Main = () => {
	const { state, dispatch } = React.useContext(Context)
	const [modal, setModal] = React.useState({
		isVisible: false,
		tabIndex: 0,
	})
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
			<MainWrapper isEmpty>
				{modal.isVisible && (
					<CreateModal
						tabIndex={modal.tabIndex}
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				<h3>
					This folder is empty. Start by creating a new folder or a
					file
				</h3>
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
			<MainWrapper isEmpty>
				No file or folder matched the search term: {state.searchText}
			</MainWrapper>
		)
	}
	return (
		<MainWrapper isSidebarVisible={state.isSidebarVisible}>
			<MenuProvider id="main__menu">
				{modal.isVisible && (
					<CreateModal
						tabIndex={modal.tabIndex}
						onModalSubmit={onModalSubmit}
						onModalClose={onModalClose}
					/>
				)}
				<ContentWrapper isPreviewVisible={state.isPreviewVisible}>
					{state.folderView === 'grid' ? (
						<Grid items={items} />
					) : (
						<Table items={items} />
					)}
					{state.isPreviewVisible ? (
						<FileDetails>
							<FilePreview {...state.previewData} />
						</FileDetails>
					) : null}
				</ContentWrapper>
			</MenuProvider>
			{state.currentFolder.split('/').length > 5 && (
				<MainMenu id="main__menu" />
			)}
		</MainWrapper>
	)
}

export default Main

const MainWrapper = styled.main(
	({ isSidebarVisible, isEmpty }) => css`
		grid-area: main;
		position: relative;
		width: calc(100vw - ${isSidebarVisible ? '240px' : '40px'});
		overflow-y: auto;
		${isEmpty &&
			css`
				height: 100%;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			`}
		@media (max-width: 567px) {
			width: calc(100vw - 40px) !important;
			margin-left: 40px;
		}
	`
)

const ContentWrapper = styled.div(
	({ isPreviewVisible }) => css`
		display: grid;
		grid-template-columns: ${isPreviewVisible ? '1fr 321px' : '1fr 0'};
		height: calc(100vh - 40px);
		@media (max-width: 567px) {
			height: calc(100vh - 41px);
		}
	`
)

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
	@media (max-width: 567px) {
		position: fixed;
		right: 0;
		top: 80px;
		bottom: 0;
		width: 321px;
		background: #fff;
	}
`
