import gql from 'graphql-tag'

const GET_FOLDER = gql`
	query getFolderWithFiles($path: String!) {
		getFolderWithFiles(path: $path) {
			createdAt
			name
			path
			size
			type
			children {
				content
				createdAt
				name
				path
				size
				type
			}
		}
	}
`

export default GET_FOLDER
