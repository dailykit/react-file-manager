import gql from 'graphql-tag'

const DELETE_FILE = gql`
	mutation deleteFile($path: String!) {
		deleteFile(path: $path)
	}
`

export default DELETE_FILE
