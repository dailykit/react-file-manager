import React from 'react'

// State
import { Context } from '../../state/context'

// Components
import { FileExplorer } from '../../components'

// Styles
import { SidebarWrapper, SidebarActions } from './styles'

// Assets
import { ExpandIcon, CollapseIcon } from '../../assets/Icon'

const Sidebar = () => {
	const { state, dispatch } = React.useContext(Context)
	return (
		<SidebarWrapper isSidebarVisible={state.isSidebarVisible}>
			<SidebarActions>
				<button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
					{state.isSidebarVisible ? (
						<ExpandIcon color="#ababab" />
					) : (
						<CollapseIcon color="#ababab" />
					)}
				</button>
			</SidebarActions>
			<FileExplorer />
		</SidebarWrapper>
	)
}

export default Sidebar
