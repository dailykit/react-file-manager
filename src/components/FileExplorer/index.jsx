import React from 'react'
import { useQuery } from '@apollo/react-hooks'

// State
import { Context } from '../../state/context'

// Components
import TreeView from '../TreeView'

// Styles
import { FileExplorerWrapper } from './styles'

// Queries
import { GET_NESTED_FOLDER } from '../../queries'

// Helpers
import toggleNode from '../../utils/toggleNode'

const FileExplorer = () => {
	const { state, dispatch } = React.useContext(Context)
	const [data, setData] = React.useState([])

	const {
		loading: queryLoading,
		error: queryError,
		data: queryData,
	} = useQuery(GET_NESTED_FOLDER, {
		variables: { path: '' },
	})

	React.useEffect(() => {
		if (queryData && queryData.getNestedFolders) {
			setData(queryData.getNestedFolders.children)
			dispatch({
				type: 'SET_CURRENT_FOLDER',
				payload: queryData.getNestedFolders.path.replace(
					process.env.REACT_APP_ROOT_FOLDER,
					''
				),
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryData])

	const onToggle = node => {
		const mutated = toggleNode(data, node)
		setData(mutated)
	}

	const onSelection = node => {
		if (node.type === 'folder') onToggle(node.name)
		dispatch({
			type: 'SET_CURRENT_FOLDER',
			payload: node.path.replace(process.env.REACT_APP_ROOT_FOLDER, ''),
		})
	}

	if (queryLoading) {
		return <div>Loading...</div>
	}
	if (queryError) {
		return <div>Error</div>
	}
	return (
		<FileExplorerWrapper isSidebarVisible={state.isSidebarVisible}>
			<TreeView
				data={data}
				onSelection={onSelection}
				onToggle={onToggle}
			/>
		</FileExplorerWrapper>
	)
}

export default FileExplorer
