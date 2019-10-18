import React from 'react'
import PropTypes from 'prop-types'
import { Treebeard } from 'react-treebeard'
import { useQuery } from '@apollo/react-hooks'

// Queries
import GET_NESTED_FOLDERS from '../queries/getNestedFolders'

import { FolderCloseIcon, FolderOpenIcon } from '../assets/Icon'

const RenderTree = ({ setFolderPath, currentFolderPath }) => {
	const {
		loading: queryLoading,
		error: queryError,
		data: queryData,
	} = useQuery(GET_NESTED_FOLDERS, {
		variables: { path: './../apps' },
	})
	const [data, setData] = React.useState({})
	const [cursor, setCursor] = React.useState(false)
	React.useEffect(() => {
		if (queryData && queryData.getNestedFolders) {
			setData({ ...queryData.getNestedFolders, toggled: true })
			setFolderPath(queryData.getNestedFolders.path)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryData])
	const onToggle = (node, toggled) => {
		if (cursor) {
			cursor.active = false
		}
		node.active = true
		if (node.children) {
			node.toggled = toggled
		}
		setCursor(node)
		setFolderPath(node.path)
		setData(Object.assign({}, data))
	}
	const decorators = {
		Toggle: props => {
			return props.toggled ? <FolderOpenIcon /> : <FolderCloseIcon />
		},
		Header: props => {
			return <span style={{ marginLeft: '8px' }}>{props.node.name}</span>
		},
		Container: props => {
			return props.node.type === 'file' ? null : (
				<div
					onClick={props.onClick}
					style={{
						height: '32px',
						display: 'flex',
						alignItems: 'center',
						cursor: 'pointer',
					}}
				>
					<props.decorators.Toggle toggled={props.node.toggled} />
					<props.decorators.Header {...props} />
				</div>
			)
		},
	}
	if (queryLoading) {
		return <div>Loading...</div>
	}
	if (queryError) {
		return <div>Error</div>
	}
	return (
		<Treebeard
			style={{
				tree: {
					base: {
						backgroundColor: 'white',
					},
					node: {
						activeLink: {
							background: 'transparent',
						},
					},
				},
			}}
			data={data}
			onToggle={onToggle}
			decorators={decorators}
		/>
	)
}

RenderTree.propTypes = {
	setFolderPath: PropTypes.func.isRequired,
}

export default RenderTree
