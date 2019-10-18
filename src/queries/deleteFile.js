import gql from 'graphql-tag'

const DELETE_FILE = gql`
	mutation deleteFile($path: String) {
		deleteFile(path: $path) {
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

export default DELETE_FILE
