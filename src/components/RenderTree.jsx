import React from 'react'
import PropTypes from 'prop-types'
import { Treebeard } from 'react-treebeard'
import { useQuery } from '@apollo/react-hooks'

// Queries
import GET_FOLDERS from '../queries/getFolders'

const RenderTree = ({ setFolderPath, currentFolderPath }) => {
	const {
		loading: queryLoading,
		error: queryError,
		data: queryData,
	} = useQuery(GET_FOLDERS, {
		variables: { path: './filesystem' },
	})
	const [data, setData] = React.useState({})
	const [cursor, setCursor] = React.useState(false)
	React.useEffect(() => {
		if (queryData.contentWithFilesData) {
			setData({ ...queryData.contentWithFilesData, toggled: true })
			setFolderPath(queryData.contentWithFilesData.path)
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
			return props.toggled ? (
				<svg
					width="16"
					height="14"
					viewBox="0 0 16 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.7789 13.4655H0.431641C0.147504 13.4655 -0.0591161 13.1957 0.0150906 12.9212L2.8195 5.23271C2.87026 5.04458 3.04101 4.91382 3.23605 4.91382H15.5833C15.8675 4.91382 15.9999 5.18527 15.9999 5.45809L13.1955 13.1466C13.1447 13.3348 12.974 13.4655 12.7789 13.4655Z"
						fill="#6A91EE"
					/>
					<path
						d="M6.89653 2.43104H13.867C14.1307 2.43104 14.3448 2.64483 14.3448 2.90883V4.91379H3.23585C3.04082 4.91379 2.87006 5.04427 2.8193 5.23269L0.0565516 12.7676C0.0380689 12.7665 0.0190344 12.7654 0 12.7648L1.52025e-05 2.5C1.68384e-05 1.39543 0.895449 0.5 2.00002 0.500003L5.51723 0.500009L6.89653 2.43104Z"
						fill="#5479D2"
					/>
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="17"
					height="17"
					viewBox="0 0 24 24"
					fill="#6a91ee"
					stroke="#6a91ee"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
				</svg>
			)
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
