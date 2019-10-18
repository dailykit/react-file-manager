import React from 'react'

// Components
import RenderTree from '../components/RenderTree'

import { ExpandIcon, CollapseIcon } from '../assets/Icon'
import { Context } from '../state/context'

const Sidebar = () => {
	const { state, dispatch } = React.useContext(Context)
	return (
		<aside className="window__sidebar">
			<div className="window__sidebar__actions">
				<button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
					{state.isSidebarVisible ? <ExpandIcon /> : <CollapseIcon />}
				</button>
			</div>
			<div className="window__sidebar__content">
				<RenderTree />
			</div>
		</aside>
	)
}

export default Sidebar
