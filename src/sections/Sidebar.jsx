import React from 'react'
import PropTypes from 'prop-types'

const Sidebar = props => {
	return (
		<aside className="window__sidebar">
			<div className="window__sidebar__actions">
				<span onClick={() => props.isCollapsed()}>{'<'}</span>
			</div>
			<div className="window__sidebar__content">Sidebar Content</div>
		</aside>
	)
}

Sidebar.propTypes = {
	isCollapsed: PropTypes.func,
}

export default Sidebar
