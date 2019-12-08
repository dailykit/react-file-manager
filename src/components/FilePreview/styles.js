import styled from 'styled-components'

export const FilePreviewWrapper = styled.div`
	position: fixed;
	width: 288px;
`

export const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	button {
		background: transparent;
		border: none;
		cursor: pointer;
	}
`

export const Details = styled.main`
	div {
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
`

export const Thumbnail = styled.div`
	height: 200px;
	width: 100%;
	background: rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 16px 0;
`
