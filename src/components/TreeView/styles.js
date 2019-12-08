import styled, { css } from 'styled-components'

export const Parent = styled.ul`
	height: auto;
`

export const Node = styled.ul(
	({ isOpen }) => css`
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 32px;
		border-radius: 4px 0 0 4px;
		cursor: pointer;
		font-size: 14px;
		padding: 0 16px;
		background: transparent;
		color: ${isOpen ? '#000' : '#9ca2a7'};
		border-right: ${isOpen ? '3px solid #69A1F6' : '3px solid transparent'};
		&:hover {
			background: #f0f0f0;
		}
	`
)

export const Icon = styled.i(
	({ isOpen }) => css`
		cursor: pointer;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		&:hover {
			background: #dfdfdf;
		}
	`
)

export const Children = styled.li`
	list-style: none;
	padding-left: 16px;
`
