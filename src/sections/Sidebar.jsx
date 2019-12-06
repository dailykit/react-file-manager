import React from 'react'
import styled, { css } from 'styled-components'

// Components
import RenderTree from '../components/RenderTree'

import { ExpandIcon, CollapseIcon } from '../assets/Icon'
import { Context } from '../state/context'

const Sidebar = () => {
	const { state, dispatch } = React.useContext(Context)
	return (
		<SidebarWrapper className="window__sidebar">
			<SidebarActions className="window__sidebar__actions">
				<button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
					{state.isSidebarVisible ? <ExpandIcon /> : <CollapseIcon />}
				</button>
			</SidebarActions>
			<FileExplorer className="window__sidebar__content">
				<RenderTree />
			</FileExplorer>
		</SidebarWrapper>
	)
}

export default Sidebar

const SidebarWrapper = styled.aside`
	grid-row: 2;
	grid-column: 1;
	border-right: 1px solid var(--border);
	grid-area: aside;
	background: #fff;
	@media (max-width: 567px) {
		width: 40px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 10;
	}
`

const SidebarActions = styled.div`
	display: flex;
	align-items: center;
	height: 40px;
	border-bottom: 1px solid var(--border);
	button {
		height: 40px;
		width: 40px;
		background: transparent;
		border: none;
		cursor: pointer;
		border-right: 1px solid var(--border);
	}
`

const FileExplorer = styled.div`
	padding: var(--spacer-2);
	height: 100%;
	overflow: auto;
	@media (max-width: 567px) {
		display: none;
	}
`
