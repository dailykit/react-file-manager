import styled from 'styled-components'

export const CardWrapper = styled.div`
	max-width: 130px;
	cursor: pointer;
	height: 150px;
	border-top: none;
	margin: -1px 0 0 -1px;
	text-align: center;
	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}
`

export const Thumb = styled.div`
	width: 100%;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
`
