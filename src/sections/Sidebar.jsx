import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Treebeard } from 'react-treebeard'

const data = {
	name: 'root',
	toggled: true,
	children: [
		{
			name: 'Dishes',
			id: './filesystem/Dishes',
			children: [
				{
					name: 'Dishes',
					id: './filesystem/Dishes',
					children: [
						{
							name: 'Dishes',
							id: './filesystem/Dishes',
							children: [{}],
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

			children: [{}],
			type: 'folder',
		},
		{
			name: 'Menu',
			id: './filesystem/Menu',

			children: [{}],
			type: 'folder',
		},
	],
}

class TreeExample extends Component {
	constructor(props) {
		super(props)
		this.state = { data }
	}

	onToggle = (node, toggled) => {
		const { cursor, data } = this.state
		if (cursor) {
			this.setState(() => ({ cursor, active: false }))
		}
		node.active = true
		if (node.children) {
			node.toggled = toggled
		}
		this.setState(() => ({ cursor: node, data: Object.assign({}, data) }))
	}
	render() {
		const { data } = this.state
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
				onToggle={this.onToggle}
			/>
		)
	}
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
