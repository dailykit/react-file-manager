import React from 'react'

import { BodyWrapper } from './styles'

import TableRow from '../Row'

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
