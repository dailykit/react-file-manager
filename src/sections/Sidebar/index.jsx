import React from 'react'

// State
import { Context } from '../../state/context'

// Components
import { RenderTree } from '../../components'

// Styles
import { SidebarWrapper, SidebarActions, FileExplorer } from './styles'

// Assets
import { ExpandIcon, CollapseIcon } from '../../assets/Icon'

const Sidebar = () => {
	const { state, dispatch } = React.useContext(Context)
	return (
		<SidebarWrapper isSidebarVisible={state.isSidebarVisible}>
			<SidebarActions>
				<button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
					{state.isSidebarVisible ? <ExpandIcon /> : <CollapseIcon />}
				</button>
			</SidebarActions>
			<FileExplorer isSidebarVisible={state.isSidebarVisible}>
				{state.isSidebarVisible && <RenderTree />}
			</FileExplorer>
		</SidebarWrapper>
	)
}

export default Sidebar
