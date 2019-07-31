import React from 'react'

const Header = props => {
	const windowMinimize = () => console.log('Minimize window!')
	const windowMaximize = () => console.log('Maximize window!')
	const windowClose = () => console.log('Close window!')
	return (
		<header className="window__header">
			<span className="window__header__title">{props.title}</span>
			<div className="window__header__actions">
				<div onClick={() => windowMinimize()}>-</div>
				<div onClick={() => windowMaximize()}>[]</div>
				<div onClick={() => windowClose()}>x</div>
			</div>
		</header>
	)
}

export default Header
