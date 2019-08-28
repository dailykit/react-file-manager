import React from 'react'
import PropTypes from 'prop-types'

const Navbar = ({ breadcrumbs, toggleView, togglePreview, setFolderPath }) => {
	const [search, setSearch] = React.useState('')
	const [route, setRoute] = React.useState('')
	React.useEffect(() => {
		if (breadcrumbs) {
			setRoute(breadcrumbs.split('./')[1])
		}
	}, [breadcrumbs])

	const goToFolder = async folderName => {
		const path = await route.split('/')
		const index = await path.indexOf(folderName)
		const slicePath = await path.slice(0, index + 1)
		const fullPath = './' + slicePath.join('/')
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

	return (
		<div className="window__main__navbar">
			<div className="window__main__nav">
				<button onClick={() => goBack()}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#000000"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M15 18l-6-6 6-6" />
					</svg>
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
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#000000"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M9 18l6-6-6-6" />
									</svg>
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
					onChange={e => setSearch(e.target.value)}
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
