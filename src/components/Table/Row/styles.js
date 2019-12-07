import styled, { css } from 'styled-components'

export const Row = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr 1fr 1fr;
	height: 40px;
	line-height: 40px;
	position: relative;
	border-top: 1px solid transparent;
	border-bottom: 1px solid transparent;
	&:hover {
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		.item__options {
			visibility: visible;
		}
	}
`

export const RowCell = styled.div(
	({ withOptions }) => css`
		padding: 0 var(--spacer-2);
		${withOptions &&
			css`
				position: absolute;
				right: 0;
				background: #fff;
				width: auto;
				height: 38px;
				visibility: hidden;
				display: flex;
				align-items: center;
				button {
					background: transparent;
					border: none;
					height: 32px;
					width: 32px;
					cursor: pointer;
					border-radius: 2px;
					display: flex;
					align-items: center;
					justify-content: center;
					&:hover {
						border: 1px solid var(--border);
					}
				}
			`}
	`
)
