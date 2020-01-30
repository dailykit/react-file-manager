import React from 'react'
import _ from 'lodash'
import styled, { css } from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

// State
import { Context } from '../../state/context'

// Components
import { FilePreview, Grid, Table } from '../../components'
import { CreateFile, CreateFolder } from './modals'

// Queries
import { GET_FOLDER } from '../../queries'

const Main = () => {
	const { state, dispatch } = React.useContext(Context)
	const [modal, setModal] = React.useState({
		file: false,
		folder: false,
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
					children: childrens.map(children => ({
						...children,
						path: children.path.replace(
							process.env.REACT_APP_ROOT_FOLDER,
							''
						),
					})),
				},
			})
		}
	}, [dispatch, queryData, state.searchText])

	let items = _.mapValues(
		_.groupBy(state.folderData.children || [], 'type'),
		v => _.orderBy(v, [state.sortBy.column], [state.sortBy.order])
	)

	const onModalClose = type => {
		return setModal(modal => ({
			...modal,
			[type]: false,
		}))
	}

	const MainMenu = () => (
		<ContextMenu id="main__menu">
			<MenuItem
				onClick={() =>
					setModal(modal => ({
						...modal,
						file: true,
					}))
				}
			>
				Create File
			</MenuItem>
			<MenuItem
				onClick={() =>
					setModal(modal => ({
						...modal,
						folder: true,
					}))
				}
			>
				Create Folder
			</MenuItem>
		</ContextMenu>
	)
	if (queryLoading) return <div>Loading...</div>
	if (queryError) return <div>Error!</div>
	if (Object.keys(items).length === 0 && state.searchText === '') {
		return (
			<MainWrapper isEmpty>
				{modal.file && (
					<CreateFile
						folderPath={state.currentFolder}
						onModalClose={onModalClose}
					/>
				)}
				{modal.folder && (
					<CreateFolder
						folderPath={state.currentFolder}
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
							setModal(modal => ({
								...modal,
								file: true,
							}))
						}
					>
						Create File
					</button>
					<button
						onClick={() =>
							setModal(modal => ({
								...modal,
								folder: true,
							}))
						}
					>
						Create Folder
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
			<ContextMenuTrigger id="main__menu">
				{modal.file && (
					<CreateFile
						folderPath={state.currentFolder}
						onModalClose={onModalClose}
					/>
				)}
				{modal.folder && (
					<CreateFolder
						folderPath={state.currentFolder}
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
			</ContextMenuTrigger>
			<MainMenu id="main__menu" />
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
		.react-contextmenu {
			border: 1px solid rgba(0, 0, 0, 0.2);
			padding: 4px 0;
			border-radius: 4px;
			width: 160px;
			background: #fff;
			z-index: 1000;
		}
		.react-contextmenu-item {
			height: 28px;
			line-height: 28px;
			padding: 0 12px;
			cursor: pointer;
			&:hover {
				background: rgba(0, 0, 0, 0.1);
			}
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
	@media (max-width: 567px) {
		position: fixed;
		right: 0;
		top: 80px;
		bottom: 0;
		width: 321px;
		background: #fff;
	}
`
