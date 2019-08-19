import gql from 'graphql-tag'

const CREATE_FILE = gql`
	mutation createFile($path: String!, $type: String!) {
		createFile(path: $path, type: $type)
	}
`

export default CREATE_FILE
