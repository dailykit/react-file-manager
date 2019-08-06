import React from 'react'
import PropTypes from 'prop-types'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'

const TableRow = ({ showHidePreview, name, type, size }) => {
	return (
		<div
			className="table__row"
			onClick={() =>
				showHidePreview({ name, type, size, showHidePreview })
			}
		>
			<div className="item__name">{name}</div>
			<div className="item__type">{type}</div>
			<div className="item__size">
				{size && `${convertFileSize(size)}`}
			</div>
		</div>
	)
}

TableRow.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	type: PropTypes.string,
	showHidePreview: PropTypes.func,
}

export default TableRow
