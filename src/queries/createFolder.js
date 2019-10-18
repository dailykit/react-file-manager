import gql from 'graphql-tag'

const CREATE_FOLDER = gql`
	mutation createFolder($path: String) {
		createFolder(path: $path) {
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

export default CREATE_FOLDER
