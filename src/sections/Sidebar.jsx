import React from 'react'
import PropTypes from 'prop-types'

// Components
import RenderTree from '../components/RenderTree'

import { ExpandIcon, CollapseIcon } from '../assets/Icon'

const Sidebar = ({ isCollapsed, setFolderPath, isSidebarVisible }) => {
	return (
		<aside className="window__sidebar">
			<div className="window__sidebar__actions">
				<button onClick={() => isCollapsed()}>
					{isSidebarVisible ? <CollapseIcon /> : <ExpandIcon />}
				</button>
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
