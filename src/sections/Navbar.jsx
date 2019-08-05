import React from 'react'

const Navbar = props => {
	const [search, setSearch] = React.useState('')
	return (
		<div className="window__main__navbar">
			<div className="window__main__nav">
				<button>
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
				<button>
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
				</button>
			</div>
			<ul className="window__main__breadcrumbs">
				{props.breadcrumbs.map((breadcrumb, index) => (
					<React.Fragment key={index}>
						<li>{breadcrumb}</li>
						{index === props.breadcrumbs.length - 1 ? null : (
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
					onClick={() =>
						props.toggleView('list') || props.togglePreview(false)
					}
				>
					L
				</button>
				<button
					onClick={() =>
						props.toggleView('grid') || props.togglePreview(false)
					}
				>
					G
				</button>
			</div>
		</div>
	)
}

export default Navbar
