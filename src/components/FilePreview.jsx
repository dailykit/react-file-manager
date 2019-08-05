import React from 'react'
import PropTypes from 'prop-types'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'

const FilePreview = props => {
	return (
		<div id="file__preview">
			<header className="preview__header">
				<span>{props.name}</span>
				<button onClick={() => props.togglePreview({}, 'fromPreview')}>
					x
				</button>
			</header>
			<div className="preview__thumbnail">
				{props.type === 'file' ? (
					<span>File Preview</span>
				) : (
					<span>No preview</span>
				)}
			</div>
			<main className="preview__main">
				<div>
					<span>File type</span>
					<span>{props.type}</span>
				</div>
				{props.size && (
					<div>
						<span>File size</span>
						<span>{`${convertFileSize(props.size)}`}</span>
					</div>
				)}
			</main>
		</div>
	)
}

FilePreview.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
}

export default FilePreview
