import React from 'react'
import PropTypes from 'prop-types'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'

const FilePreview = props => {
	return (
		<div id="file__preview">
			<header>
				<span>{props.name}</span>
				<button onClick={() => props.togglePreview({}, 'fromPreview')}>
					x
				</button>
			</header>
			<main>
				<span>{props.size && `${convertFileSize(props.size)}`}</span>
			</main>
		</div>
	)
}

FilePreview.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
}

export default FilePreview
