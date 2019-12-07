import React from 'react'

// Components
import Head from './Head'
import Body from './Body'

// Styles
import { TableWrapper } from './styles'

const Table = ({ items }) => {
	return (
		<TableWrapper>
			<Head />
			<Body items={items} />
		</TableWrapper>
	)
}

export default Table
