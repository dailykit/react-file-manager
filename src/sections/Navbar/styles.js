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
		height: 26px;
		line-height: 26px;
		padding: 0 8px;
		border-radius: 4px;
		list-style: none;
		cursor: pointer;
		font-size: 14px;
		text-transform: capitalize;
		color: #9ca2a7;
		&:nth-last-of-type(1) {
			color: #000;
		}
		&:hover {
			color: #000;
			background: #eeeeee;
		}
	}
	span {
		height: 24px;
		width: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
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
