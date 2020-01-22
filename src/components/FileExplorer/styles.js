import styled, { css } from 'styled-components'

export const FileExplorerWrapper = styled.div(
	({ isSidebarVisible }) => css`
		width: 100%;
		height: 100%;
		overflow: auto;
		display: ${isSidebarVisible ? 'block' : 'none'};
	`
)
