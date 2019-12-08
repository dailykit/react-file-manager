import gql from 'graphql-tag'

const CREATE_FILE = gql`
	mutation createFile($path: String, $content: String) {
		createFile(path: $path, content: $content) {
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

export default CREATE_FILE
