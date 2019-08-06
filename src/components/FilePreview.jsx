import React from 'react'
import PropTypes from 'prop-types'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'

const FilePreview = ({ name, size, type, showHidePreview }) => {
	return (
		<div id="file__preview">
			<header className="preview__header">
				<span>{name}</span>
				<button onClick={() => showHidePreview({}, 'fromPreview')}>
					x
				</button>
			</header>
			<div className="preview__thumbnail">
				{type === 'file' ? (
					<span>File Preview</span>
				) : (
					<span>No preview</span>
				)}
			</div>
			<main className="preview__main">
				<div>
					<span>File type</span>
					<span>{type}</span>
				</div>
				{size && (
					<div>
						<span>File size</span>
						<span>{`${convertFileSize(size)}`}</span>
					</div>
				)}
			</main>
		</div>
	)
}

FilePreview.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	type: PropTypes.string,
	showHidePreview: PropTypes.func,
}

export default FilePreview
