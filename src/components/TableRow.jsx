import React from 'react'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'

const TableRow = props => {
	return (
		<div
			className="table__row"
			key={props.id}
			onClick={() => props.togglePreview(props)}
		>
			<div className="item__name">{props.name}</div>
			<div className="item__type">{props.type}</div>
			<div className="item__size">
				{props.size && `${convertFileSize(props.size)}`}
			</div>
		</div>
	)
}

export default TableRow
