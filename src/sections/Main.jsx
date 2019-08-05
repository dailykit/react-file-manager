import React from 'react'
import _ from 'lodash'

// Components
import FilePreview from '../components/FilePreview'
import Card from '../components/Card'
import TableRow from '../components/TableRow'

const Main = props => {
	const [view, setView] = React.useState('list')
	const [preview, setPreview] = React.useState(false)
	const [previewData, setPreviewData] = React.useState({})
	const [search, setSearch] = React.useState('')
	const [sort, sortBy] = React.useState({
		name: 'asc',
	})

	const breadcrumbs = ['Folders', 'Dishes', 'Vegetarians']
	const itemData = props.data.filter(i =>
		i.name.toLowerCase().includes(search.toLowerCase())
	)
	const items = _.mapValues(_.groupBy(itemData, 'type'), v =>
		_.orderBy(v, ['name'], [sort.name])
	)

	const togglePreview = (data, from) => {
		if (from === 'fromPreview') {
			setPreview(false)
		}
		if (!preview && from !== 'fromPreview') {
			setPreview(!preview)
		}
		setPreviewData(data)
	}
	return (
		<main className="window__main">
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
					{breadcrumbs.map((breadcrumb, index) => (
						<React.Fragment key={index}>
							<li>{breadcrumb}</li>
							{index === breadcrumbs.length - 1 ? null : (
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
						onClick={() => setView('list') || setPreview(false)}
					>
						L
					</button>
					<button
						onClick={() => setView('grid') || setPreview(false)}
					>
						G
					</button>
				</div>
			</div>
			<div
				className={`window__main__content ${
					preview ? 'with__preview' : ''
				}`}
			>
				{props.data.length === 0 ? (
					<div className="empty__state">
						<h3>
							This folder is empty. Start by creating a new folder
							or a file
						</h3>
						<div>
							<button>Create File</button>
							<button>Create Folder</button>
						</div>
					</div>
				) : (
					<>
						<div className="window__main__content__left">
							{view === 'grid' ? (
								<div className="window__main__grid__view">
									{items.folder &&
										items.folder.map(item => (
											<Card
												{...item}
												key={item.id}
												togglePreview={togglePreview}
											/>
										))}
									{items.file &&
										items.file.map(item => (
											<Card
												{...item}
												key={item.id}
												togglePreview={togglePreview}
											/>
										))}
								</div>
							) : (
								<div className="window__main__list__view">
									<div className="table__header">
										<div
											className="item__name"
											onClick={() =>
												sortBy({
													name:
														sort.name === 'asc'
															? 'desc'
															: sort.name ===
															  'desc'
															? 'asc'
															: null,
												})
											}
										>
											<span>Name</span>
											<span>{sort.name}</span>
										</div>
										<div className="item__type">Type</div>
										<div className="item__size">Size</div>
									</div>
									<div className="table__main">
										{items.folder &&
											items.folder.map(item => (
												<TableRow
													{...item}
													key={item.id}
													togglePreview={
														togglePreview
													}
												/>
											))}
										{items.file &&
											items.file.map(item => (
												<TableRow
													{...item}
													key={item.id}
													togglePreview={
														togglePreview
													}
												/>
											))}
									</div>
								</div>
							)}
						</div>
						{preview ? (
							<div className="window__main__content__right">
								<FilePreview {...previewData} />
							</div>
						) : null}
					</>
				)}
			</div>
		</main>
	)
}

export default Main
