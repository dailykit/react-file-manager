import React from 'react'
import PropTypes from 'prop-types'

import { useMutation } from '@apollo/react-hooks'

// Queries
import GET_FOLDER from '../queries/getFolder'
import DELETE_FOLDER from '../queries/deleteFolder'
import DELETE_FILE from '../queries/deleteFile'

// Helper Functions
import convertFileSize from '../utils/convertFileSize'

const TableRow = ({ showHidePreview, name, type, size, path }) => {
	const [deleteFolder] = useMutation(DELETE_FOLDER, {
		refetchQueries: [
			{
				query: GET_FOLDER,
				variables: {
					path: path
						.split('/')
						.slice(0, -1)
						.join('/'),
				},
			},
		],
	})
	const [deleteFile] = useMutation(DELETE_FILE, {
		refetchQueries: [
			{
				query: GET_FOLDER,
				variables: {
					path: path
						.split('/')
						.slice(0, -1)
						.join('/'),
				},
			},
		],
	})
	const Delete = (
		<button
			onClick={() => {
				if (type === 'folder') {
					return deleteFolder({
						variables: {
							path,
						},
					})
				}
				return deleteFile({
					variables: {
						path,
					},
				})
			}}
		>
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
				<polyline points="3 6 5 6 21 6" />
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				<line x1="10" y1="11" x2="10" y2="17" />
				<line x1="14" y1="11" x2="14" y2="17" />
			</svg>
		</button>
	)
	const Preview = (
		<button
			onClick={() =>
				showHidePreview({ name, type, size, showHidePreview })
			}
		>
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
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="16" x2="12" y2="12" />
				<line x1="12" y1="8" x2="12" y2="8" />
			</svg>
		</button>
	)
	return (
		<div className="table__row">
			<div className="item__name">{name}</div>
			<div className="item__type">{type}</div>
			<div className="item__size">
				{size && `${convertFileSize(size)}`}
			</div>
			<div className="item__options">
				{Preview}
				{Delete}
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
