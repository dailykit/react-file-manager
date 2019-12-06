import React from 'react'
import styled from 'styled-components'

import { ChevronLeftIcon, ChevronRightIcon, ListIcon, GridIcon } from '../assets/Icon'
import { Context } from '../state/context'

const Navbar = () => {
	const { state, dispatch } = React.useContext(Context)
	const [search, setSearch] = React.useState('')
	const [route, setRoute] = React.useState('')
	React.useEffect(() => {
		if (state.currentFolder) {
			setRoute(state.currentFolder.split('./../')[1])
		}
	}, [state.currentFolder])

	const goToFolder = async folderName => {
		const path = await route.split('/')
		const index = await path.indexOf(folderName)
		const slicePath = await path.slice(0, index + 1)
		const fullPath = './../' + slicePath.join('/')
		dispatch({
			type: 'SET_CURRENT_FOLDER',
			payload: fullPath,
		})
	}

	const searchFolder = e => {
		setSearch(e.target.value)
		dispatch({
			type: 'SET_SEARCH_TEXT',
			payload: e.target.value.toLowerCase(),
		})
	}

	return (
		<NavbarWrapper className="window__main__navbar">
			<Breadcrumbs className="window__main__breadcrumbs">
				{route &&
					route.split('/').map((breadcrumb, index) => (
						<React.Fragment key={index}>
							<li onClick={() => goToFolder(breadcrumb)}>{breadcrumb}</li>
							{index === route.split('/').length - 1 ? null : (
								<span>
									<ChevronRightIcon />
								</span>
							)}
						</React.Fragment>
					))}
			</Breadcrumbs>
			<Search className="window__main__search">
				<input
					type="text"
					placeholder="Search files or folders..."
					value={search}
					onChange={e => searchFolder(e)}
				/>
			</Search>
			<SwitchView className="window__main__view">
				<button
					onClick={() =>
						dispatch({ type: 'TOGGLE_VIEW', payload: 'list' }) ||
						dispatch({ type: 'TOGGLE_PREVIEW', payload: false })
					}
				>
					<ListIcon />
				</button>
				<button
					onClick={() =>
						dispatch({ type: 'TOGGLE_VIEW', payload: 'grid' }) ||
						dispatch({ type: 'TOGGLE_PREVIEW', payload: false })
					}
				>
					<GridIcon />
				</button>
			</SwitchView>
		</NavbarWrapper>
	)
}

export default Navbar

const NavbarWrapper = styled.div`
	width: calc(100vw - 240px);
	height: 40px;
	display: grid;
	grid-template-columns: 1fr 240px 80px;
	background: #fff;
	z-index: 1;
	grid-area: nav;
	border-bottom: 1px solid var(--border);
	@media (max-width: 567px) {
		width: calc(100vw - 40px) !important;
		margin-left: 40px;
		height: 80px !important;
		grid-template-columns: 1fr 80px !important;
		grid-auto-rows: 40px 40px;
	}
`

const Breadcrumbs = styled.div`
	padding: 0 var(--spacer-2);
	display: flex;
	align-items: center;
	border-right: 1px solid var(--border);
	li {
		list-style: none;
		height: 40px;
		line-height: 37px;
		cursor: pointer;
	}
	span {
		height: 40px;
		display: flex;
		align-items: center;
		margin: 0 var(--spacer-1);
	}
	@media (max-width: 567px) {
		grid-column: 1;
		grid-column-start: 1;
		grid-column-end: 4;
		grid-row: 2;
		grid-row-start: 2;
		border-bottom: 1px solid var(--border);
	}
`

const Search = styled.div`
	border-bottom: 1px solid var(--border);
	border-right: 1px solid var(--border);
	input {
		width: 100%;
		height: 39px;
		border: none;
		padding-left: var(--spacer-2);
	}
`

const SwitchView = styled.div`
	button {
		height: 40px;
		width: 40px;
		background: transparent;
		border: none;
		cursor: pointer;
		&:last-child {
			border-right: none;
		}
		&:hover {
			background: rgba(#000, 0.05);
		}
	}
	@media (max-width: 567px) {
		border-bottom: 1px solid var(--border);
	}
`
