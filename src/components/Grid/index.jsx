import React from 'react'
import styled from 'styled-components'

// Components
import Card from './Card'

const Grid = ({ items }) => {
	console.log(items)
	return (
		<GridWrapper>
			{items.folder && items.folder.map(item => <Card item={item} />)}
			{items.file && items.file.map(item => <Card item={item} />)}
		</GridWrapper>
	)
}

export default Grid

const GridWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
`
