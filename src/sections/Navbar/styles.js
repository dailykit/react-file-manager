import styled, { css } from 'styled-components'

export const NavbarWrapper = styled.div(
	({ isSidebarVisible }) => css`
		width: calc(100vw - ${isSidebarVisible ? '240px' : '40px'});
		height: 40px;
		display: grid;
		grid-template-columns: 1fr 240px 80px;
		background: #fff;
		z-index: 1;
		grid-area: nav;
		border-bottom: 1px solid var(--border);
		@media (max-width: 567px) {
			width: calc(100vw - 40px);
			margin-left: 40px;
			height: 80px !important;
			grid-template-columns: 1fr 80px;
			grid-auto-rows: 40px 40px;
		}
	`
)

export const Breadcrumbs = styled.div`
	padding: 0 var(--spacer-2);
	display: flex;
	align-items: center;
	border-right: 1px solid var(--border);
	li {
		list-style: none;
		height: 40px;
		line-height: 37px;
		cursor: pointer;
	}
	span {
		height: 40px;
		display: flex;
		align-items: center;
		margin: 0 var(--spacer-1);
	}
	@media (max-width: 567px) {
		grid-column: 1;
		grid-column-start: 1;
		grid-column-end: 4;
		grid-row: 2;
		grid-row-start: 2;
		border-bottom: 1px solid var(--border);
	}
`

export const Search = styled.div`
	border-bottom: 1px solid var(--border);
	border-right: 1px solid var(--border);
	input {
		width: 100%;
		height: 39px;
		border: none;
		padding-left: var(--spacer-2);
	}
`

export const SwitchView = styled.div`
	button {
		height: 40px;
		width: 40px;
		background: transparent;
		border: none;
		cursor: pointer;
		&:last-child {
			border-right: none;
		}
		&:hover {
			background: rgba(#000, 0.05);
		}
	}
	@media (max-width: 567px) {
		border-bottom: 1px solid var(--border);
	}
`
