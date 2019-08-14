import React from 'react'
import PropTypes from 'prop-types'

const Header = ({ title }) => {
	const windowMinimize = () => console.log('Minimize window!')
	const windowMaximize = () => console.log('Maximize window!')
	const windowClose = () => console.log('Close window!')
	return (
		<header className="window__header">
			<span className="window__header__title">{title}</span>
			<div className="window__header__actions">
				<div onClick={() => windowMinimize()}>-</div>
				<div onClick={() => windowMaximize()}>[]</div>
				<div onClick={() => windowClose()}>x</div>
			</div>
		</header>
	)
}

Header.propTypes = {
	title: PropTypes.string.isRequired,
}

export default Header
