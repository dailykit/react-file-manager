import React from 'react'

// State
import { Context } from '../../state/context'

// Styles
import { NavbarWrapper, Breadcrumbs, Search, SwitchView } from './styles'

// Assets
import { ChevronRightIcon, ListIcon, GridIcon } from '../../assets/Icon'

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
		<NavbarWrapper isSidebarVisible={state.isSidebarVisible}>
			<Breadcrumbs>
				{route &&
					route.split('/').map((breadcrumb, index) => (
						<React.Fragment key={index}>
							<li onClick={() => goToFolder(breadcrumb)}>
								{breadcrumb}
							</li>
							{index === route.split('/').length - 1 ? null : (
								<span>
									<ChevronRightIcon color="#CECECE" />
								</span>
							)}
						</React.Fragment>
					))}
			</Breadcrumbs>
			<Search>
				<input
					type="text"
					placeholder="Search files or folders..."
					value={search}
					onChange={e => searchFolder(e)}
				/>
			</Search>
			<SwitchView>
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
