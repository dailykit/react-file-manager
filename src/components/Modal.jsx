import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const modalContainer = document.getElementById('modal__container')

const Header = ({ children }) => {
	return <HeaderWrapper id="modal__card__header">{children}</HeaderWrapper>
}
const Body = ({ children }) => {
	return <BodyWrapper id="modal__card__body">{children}</BodyWrapper>
}
const Footer = ({ children }) => {
	return <FooterWrapper id="modal__card__footer">{children}</FooterWrapper>
}

class Modal extends React.Component {
	constructor(props) {
		super(props)
		this.el = document.createElement('div')
	}
	static Header = Header
	static Body = Body
	static Footer = Footer
	componentDidMount() {
		modalContainer.appendChild(this.el)
	}
	componentWillUnmount() {
		modalContainer.removeChild(this.el)
	}
	render() {
		return ReactDOM.createPortal(
			<ModalWrapper id="modal">
				<ModalCard id="modal__card">{this.props.children}</ModalCard>
			</ModalWrapper>,
			this.el
		)
	}
}

export default Modal

const ModalWrapper = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	z-index: 100;
	background: rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
`

const ModalCard = styled.div`
	height: 200px;
	width: 480px;
	background: #fff;
	border-radius: 3px;
	@include flex(null, space-between);
	flex-direction: column;
	label {
		display: block;
		margin-bottom: 6px;
	}
	[data-reach-tab-list] {
		height: 32px;
		border-bottom: 1px solid var(--border);
	}
	[data-reach-tabs] {
		height: calc(100% - 40px);
	}
	[data-reach-tab] {
		background: transparent;
		border: none;
		padding: 0 16px;
		height: 31px;
	}
	[data-selected] {
		border-bottom: 2px solid var(--border);
	}
	[data-reach-tab-panel] {
		height: 100%;
	}
	[data-reach-tab-panels] {
		padding: 16px;
		height: calc(100% - 32px);
	}
	#dropzone {
		div {
			height: 40px;
			border: 2px dashed #d7d7d7;
			@include flex(center, center);
		}
	}
	#images {
		margin-top: 16px;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 16px;
		grid-template-columns: repeat(8, 40px);
		.image {
			position: relative;
			&:hover span {
				display: flex;
			}
			span {
				display: none;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 10;
				background: rgba(0, 0, 0, 0.2);
				height: 40px;
				width: 40px;
				align-items: center;
				justify-content: center;
				cursor: pointer;
			}
		}
		img {
			width: 40px;
			height: 40px;
			object-fit: cover;
		}
	}
`

const HeaderWrapper = styled.div`
	height: 32px;
	padding: 0 12px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid var(--border);
`

const BodyWrapper = styled.div`
	padding: 12px;
	flex: 1;
`

const FooterWrapper = styled.div`
	height: 40px;
	padding: 0 12px;
	display: flex;
	align-items: center;
	border-top: 1px solid var(--border);
`
