import gql from 'graphql-tag'

const RENAME_FILE = gql`
	mutation renameFile($oldPath: String!, $newPath: String!) {
		renameFile(oldPath: $oldPath, newPath: $newPath) {
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

export default RENAME_FILE
