import styled, { css } from 'styled-components'

export const SidebarWrapper = styled.aside(
	({ isSidebarVisible }) => css`
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
			${isSidebarVisible &&
				css`
					width: 240px !important;
					box-shadow: 1px 0 20px 2px rgba(0, 0, 0, 0.2);
				`}
		}
	`
)

export const SidebarActions = styled.div`
	display: flex;
	align-items: center;
	height: 40px;
	border-bottom: 1px solid var(--border);
	button {
		height: 40px;
		width: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		border-right: 1px solid var(--border);
	}
`
