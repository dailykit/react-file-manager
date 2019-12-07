import React from 'react'
import PropTypes from 'prop-types'

// State
import { Context } from '../../state/context'

// Styles
import { FilePreviewWrapper, Header, Details, Thumbnail } from './styles'

// Helper Functions
import convertFileSize from '../../utils/convertFileSize'

// Assets
import { CloseIcon } from '../../assets/Icon'

const FilePreview = ({ name, size, type }) => {
	const { dispatch } = React.useContext(Context)
	return (
		<FilePreviewWrapper id="file__preview">
			<Header className="preview__header">
				<span>{name}</span>
				<button
					onClick={() =>
						dispatch({ type: 'TOGGLE_PREVIEW', payload: false })
					}
				>
					<CloseIcon />
				</button>
			</Header>
			<Thumbnail className="preview__thumbnail">
				{type === 'file' ? (
					<span>File Preview</span>
				) : (
					<span>No preview</span>
				)}
			</Thumbnail>
			<Details className="preview__main">
				<div>
					<span>File type</span>
					<span>{type}</span>
				</div>
				<div>
					<span>File size</span>
					<span>{`${convertFileSize(size)}`}</span>
				</div>
			</Details>
		</FilePreviewWrapper>
	)
}

FilePreview.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	type: PropTypes.string,
}

export default FilePreview
