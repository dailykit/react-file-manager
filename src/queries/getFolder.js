import gql from 'graphql-tag'

const GET_FOLDER = gql`
	query getFolderWithFiles($path: String!) {
		getFolderWithFiles(path: $path) {
			createdAt
			name
			path
			size
			type
			createdAt
			children {
				createdAt
				name
				path
				size
				type
				createdAt
			}
		}
	}
`

export default GET_FOLDER
