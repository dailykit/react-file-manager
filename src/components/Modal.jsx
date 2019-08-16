import React from 'react'

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
	static Header = Header
	static Body = Body
	static Footer = Footer
	render() {
		return (
			<div id="modal">
				<div id="modal__card">{this.props.children}</div>
			</div>
		)
	}
}

export default Modal
