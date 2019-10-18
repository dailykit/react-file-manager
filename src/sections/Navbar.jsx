import React from 'react'
import PropTypes from 'prop-types'

import { ChevronLeftIcon, ChevronRightIcon } from '../assets/Icon'

const Navbar = ({
	breadcrumbs,
	toggleView,
	togglePreview,
	setFolderPath,
	setSearchTerm,
}) => {
	const [search, setSearch] = React.useState('')
	const [route, setRoute] = React.useState('')
	React.useEffect(() => {
		if (breadcrumbs) {
			setRoute(breadcrumbs.split('./../')[1])
		}
	}, [breadcrumbs])
	const goToFolder = async folderName => {
		const path = await route.split('/')
		const index = await path.indexOf(folderName)
		const slicePath = await path.slice(0, index + 1)
		const fullPath = './../' + slicePath.join('/')
		setFolderPath(fullPath)
	}

	const goBack = () => {
		if (breadcrumbs.split('/').length > 2) {
			return setFolderPath(
				breadcrumbs
					.split('/')
					.slice(0, -1)
					.join('/')
			)
		}
	}

	const searchFolder = e => {
		setSearch(e.target.value)
		setSearchTerm(e.target.value)
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
					onClick={() => toggleView('list') || togglePreview(false)}
				>
					L
				</button>
				<button
					onClick={() => toggleView('grid') || togglePreview(false)}
				>
					G
				</button>
			</div>
		</div>
	)
}

Navbar.propTypes = {
	breadcrumbs: PropTypes.string.isRequired,
	toggleView: PropTypes.func.isRequired,
	togglePreview: PropTypes.func.isRequired,
	setFolderPath: PropTypes.func.isRequired,
}

export default Navbar
