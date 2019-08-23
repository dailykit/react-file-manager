import React from 'react'
import ReactDOM from 'react-dom'

const modalContainer = document.getElementById('modal__container')

const Header = ({ children }) => {
	return <div id="modal__card__header">{children}</div>
}
const Body = ({ children }) => {
	return <div id="modal__card__body">{children}</div>
}
const Footer = ({ children }) => {
	return <div id="modal__card__footer">{children}</div>
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
			<div id="modal">
				<div id="modal__card">{this.props.children}</div>
			</div>,
			this.el
		)
	}
}

export default Modal
