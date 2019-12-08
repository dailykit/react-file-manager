import styled, { css } from 'styled-components'

export const HeadWrapper = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr 1fr 1fr;
	line-height: 32px;
	border-bottom: 1px solid var(--border);
`

export const Column = styled.div(
	({ noHover }) => css`
		cursor: pointer;
		text-transform: uppercase;
		font-size: 14px;
		color: #a6a7aa;
		letter-spacing: 0.4px;
		padding: 0 var(--spacer-2);
		display: flex;
		justify-content: space-between;
		&:hover {
			background: rgba(0, 0, 0, 0.05);
		}
		${noHover &&
			css`
				pointer-events: none;
			`}
	`
)
