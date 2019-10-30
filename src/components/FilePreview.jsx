import React from 'react'
import PropTypes from 'prop-types'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'
import { Context } from '../state/context'
import { CloseIcon } from '../assets/Icon'

const FilePreview = ({ name, size, type }) => {
	const { dispatch } = React.useContext(Context)
	return (
		<div id="file__preview">
			<header className="preview__header">
				<span>{name}</span>
				<button
					onClick={() =>
						dispatch({ type: 'TOGGLE_PREVIEW', payload: false })
					}
				>
					<CloseIcon />
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
				<div>
					<span>File size</span>
					<span>{`${convertFileSize(size)}`}</span>
				</div>
			</main>
		</div>
	)
}

FilePreview.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	type: PropTypes.string,
}

export default FilePreview
