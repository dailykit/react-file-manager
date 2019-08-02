import React from 'react'

const Card = props => {
	return (
		<div className="item" onClick={() => props.togglePreview(props)}>
			<div className="item__thumbnail">
				<div />
			</div>
			<span className="item__name">{props.name}</span>
		</div>
	)
}

export default Card
