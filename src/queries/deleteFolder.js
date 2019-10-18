import gql from 'graphql-tag'

const DELETE_FOLDER = gql`
	mutation deleteFolder($path: String!) {
		deleteFolder(path: $path) {
			... on Error {
				success
				error
			}
			... on Success {
				success
				message
			}
		}
	}
`

export default DELETE_FOLDER
