import gql from 'graphql-tag'

const RENAME_FOLDER = gql`
	mutation renameFolder($oldPath: String!, $newPath: String!) {
		renameFolder(oldPath: $oldPath, newPath: $newPath) {
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

export default RENAME_FOLDER
