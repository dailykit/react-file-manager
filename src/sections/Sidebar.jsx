import React from 'react'
import PropTypes from 'prop-types'
import { Treebeard } from 'react-treebeard'

const folderData = {
	name: 'Folders',
	toggled: true,
	children: [
		{
			name: 'Dishes',
			id: './filesystem/Dishes',
			children: [
				{
					name: 'Vegetarian',
					id: './filesystem/Dishes/Vegetarian',
					children: [
						{
							name: 'Paneer',
							id: './filesystem/Dishes/Vegetarian/Paneer',
							children: [],
							type: 'folder',
						},
					],
					type: 'folder',
				},
			],
			type: 'folder',
		},
		{
			name: 'Ingredients',
			id: './filesystem/Ingredients',

			children: [],
			type: 'folder',
		},
		{
			name: 'Menu',
			id: './filesystem/Menu',

			children: [],
			type: 'folder',
		},
	],
}

const TreeExample = () => {
	const [data, setData] = React.useState(folderData)
	const [cursor, setCursor] = React.useState(false)

	const onToggle = (node, toggled) => {
		if (cursor) {
			cursor.active = false
		}
		node.active = true
		if (node.children) {
			node.toggled = toggled
		}
		setCursor(node)
		setData(Object.assign({}, data))
	}
	const decorators = {
		Toggle: props => {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="17"
					height="17"
					viewBox="0 0 24 24"
					fill={props.toggled ? '#6a91ee' : 'none'}
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
			return (
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

const Sidebar = props => {
	return (
		<aside className="window__sidebar">
			<div className="window__sidebar__actions">
				<span onClick={() => props.isCollapsed()}>{'<'}</span>
			</div>
			<div className="window__sidebar__content">
				<TreeExample />
			</div>
		</aside>
	)
}

Sidebar.propTypes = {
	isCollapsed: PropTypes.func,
}

export default Sidebar
