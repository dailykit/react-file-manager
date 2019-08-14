import gql from 'graphql-tag'

const GET_FOLDER = gql`
	query getFolder($path: String!) {
		contentWithFilesData(path: $path) {
			name
			path
			children {
				name
				path
				type
			}
		}
	}
`

export default GET_FOLDER
