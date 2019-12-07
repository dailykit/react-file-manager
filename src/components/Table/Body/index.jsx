import React from 'react'

// Components
import TableRow from '../Row'

// Styles
import { BodyWrapper } from './styles'

const Body = ({ items }) => {
	return (
		<BodyWrapper>
			{items.folder &&
				items.folder.map((item, index) => (
					<TableRow {...item} key={index} />
				))}
			{items.file &&
				items.file.map((item, index) => (
					<TableRow {...item} key={index} />
				))}
		</BodyWrapper>
	)
}

export default Body
