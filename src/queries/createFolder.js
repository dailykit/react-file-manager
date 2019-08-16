import gql from 'graphql-tag'

const CREATE_FOLDER = gql`
	mutation createFolder($path: String!) {
		createFolder(path: $path)
	}
`

export default CREATE_FOLDER
