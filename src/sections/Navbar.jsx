import React from 'react'

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ListIcon,
	GridIcon,
} from '../assets/Icon'
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

	const goBack = () => {
		return dispatch({
			type: 'SET_CURRENT_FOLDER',
			payload: state.currentFolder
				.split('/')
				.slice(0, -1)
				.join('/'),
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
		<div className="window__main__navbar">
			<div className="window__main__nav">
				<button onClick={() => goBack()}>
					<ChevronLeftIcon />
				</button>
			</div>
			<ul className="window__main__breadcrumbs">
				{route &&
					route.split('/').map((breadcrumb, index) => (
						<React.Fragment key={index}>
							<li onClick={() => goToFolder(breadcrumb)}>
								{breadcrumb}
							</li>
							{index === route.split('/').length - 1 ? null : (
								<span>
									<ChevronRightIcon />
								</span>
							)}
						</React.Fragment>
					))}
			</ul>
			<div className="window__main__search">
				<input
					type="text"
					placeholder="Search files or folders..."
					value={search}
					onChange={e => searchFolder(e)}
				/>
			</div>
			<div className="window__main__view">
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
			</div>
		</div>
	)
}

export default Navbar
