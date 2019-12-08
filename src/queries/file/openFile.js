import gql from 'graphql-tag'

const OPEN_FILE = gql`
	query openFile($path: String!) {
		openFile(path: $path) {
			path
		}
	}
`

export default OPEN_FILE
