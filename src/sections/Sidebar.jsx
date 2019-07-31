import React from 'react'
import PropTypes from 'prop-types'

const Sidebar = props => {
	return (
		<aside className="window__sidebar">
			<div className="window__sidebar__actions">
				<span onClick={() => props.isCollapsed()}>
					<svg
						width="12"
						height="16"
						viewBox="0 0 12 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.5 8.00001L10.5 3.83334V12.1667L5.5 8.00001Z"
							fill="black"
						/>
						<path
							d="M1.5 15V1M5.5 8.00001L10.5 3.83334V12.1667L5.5 8.00001Z"
							stroke="black"
							strokeWidth="1.66667"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</div>
			<div className="window__sidebar__content">Sidebar Content</div>
		</aside>
	)
}

Sidebar.propTypes = {
	isCollapsed: PropTypes.func,
}

export default Sidebar
