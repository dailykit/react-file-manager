import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

// Components
import FilePreview from '../components/FilePreview'
import Card from '../components/Card'
import TableRow from '../components/TableRow'

const Main = ({ data, view, preview, togglePreview }) => {
	const [previewData, setPreviewData] = React.useState({})
	const [sort, sortBy] = React.useState({
		column: 'name',
		order: 'asc',
	})
	const items = _.mapValues(_.groupBy(data.children, 'type'), v =>
		_.orderBy(v, [sort.column], [sort.order])
	)
	const showHidePreview = (data, from) => {
		if (from === 'fromPreview') {
			togglePreview(false)
		}
		if (!preview && from !== 'fromPreview') {
			togglePreview(!preview)
		}
		setPreviewData(data)
	}

	const sortItems = by => {
		sortBy({
			column: by,
			order: sort.order === 'asc' ? 'desc' : 'asc',
		})
	}
	return (
		<main className="window__main">
			<div
				className={`window__main__content ${
					preview ? 'with__preview' : ''
				}`}
			>
				{data.length === 0 ? (
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
												showHidePreview={
													showHidePreview
												}
											/>
										))}
									{items.file &&
										items.file.map(item => (
											<Card
												{...item}
												key={item.id}
												showHidePreview={
													showHidePreview
												}
											/>
										))}
								</div>
							) : (
								<div className="window__main__list__view">
									<div className="table__header">
										<div
											className="item__name"
											onClick={() => sortItems('name')}
										>
											<span>Name</span>
											{sort.column === 'name' && (
												<span>{sort.order}</span>
											)}
										</div>
										<div className="item__type">
											<span>Type</span>
										</div>
										<div
											className="item__size"
											onClick={() => sortItems('size')}
										>
											<span>Size</span>
											{sort.column === 'size' && (
												<span>{sort.order}</span>
											)}
										</div>
									</div>
									<div className="table__main">
										{items.folder &&
											items.folder.map(item => (
												<TableRow
													{...item}
													key={item.id}
													showHidePreview={
														showHidePreview
													}
												/>
											))}
										{items.file &&
											items.file.map(item => (
												<TableRow
													{...item}
													key={item.id}
													showHidePreview={
														showHidePreview
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

Main.propTypes = {
	data: PropTypes.object,
	view: PropTypes.string,
	preview: PropTypes.bool,
	togglePreview: PropTypes.func,
}

export default Main
