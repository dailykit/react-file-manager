import gql from 'graphql-tag'

const DELETE_FOLDER = gql`
	mutation deleteFolder($path: String!) {
		deleteFolder(path: $path)
	}
`

export default DELETE_FOLDER
