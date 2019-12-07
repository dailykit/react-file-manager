import React from 'react'

// Context
import { Context } from '../../../state/context'

// Styles
import { HeadWrapper, Column } from './styles'

const Head = () => {
	const { state, dispatch } = React.useContext(Context)
	const sortItems = by => {
		dispatch({
			type: 'SORT_BY',
			payload: {
				column: by,
				order: state.sortBy.order === 'asc' ? 'desc' : 'asc',
			},
		})
	}
	return (
		<HeadWrapper>
			<Column className="item__name" onClick={() => sortItems('name')}>
				<span>Name</span>
				{state.sortBy.column === 'name' && (
					<span>{state.sortBy.order}</span>
				)}
			</Column>
			<Column
				className="item__date"
				onClick={() => sortItems('createdAt')}
			>
				<span>Date</span>
				{state.sortBy.column === 'createdAt' && (
					<span>{state.sortBy.order}</span>
				)}
			</Column>
			<Column noHover className="item__type">
				<span>Type</span>
			</Column>
			<Column className="item__size" onClick={() => sortItems('size')}>
				<span>Size</span>
				{state.sortBy.column === 'size' && (
					<span>{state.sortBy.order}</span>
				)}
			</Column>
		</HeadWrapper>
	)
}

export default Head
