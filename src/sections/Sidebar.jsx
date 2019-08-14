import React from 'react'
import PropTypes from 'prop-types'

// Components
import RenderTree from '../components/RenderTree'

const Sidebar = ({ isCollapsed, setFolderPath }) => {
	return (
		<aside className="window__sidebar">
			<div className="window__sidebar__actions">
				<span onClick={() => isCollapsed()}>{'<'}</span>
			</div>
			<div className="window__sidebar__content">
				<RenderTree setFolderPath={setFolderPath} />
			</div>
		</aside>
	)
}

Sidebar.propTypes = {
	isCollapsed: PropTypes.func.isRequired,
	setFolderPath: PropTypes.func.isRequired,
}

export default Sidebar
