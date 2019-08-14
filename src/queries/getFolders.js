import gql from 'graphql-tag'

const GET_FOLDERS = gql`
	query getFolders($path: String!) {
		contentWithFilesData(path: $path) {
			name
			path
			children {
				name
				path
				type
				children {
					name
					path
					type
				}
			}
		}
	}
`

export default GET_FOLDERS
