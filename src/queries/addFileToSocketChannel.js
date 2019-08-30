import gql from 'graphql-tag'

const ADD_FILE_TO_SOCKET_CHANNEL = gql`
	mutation addFileToSocketChannel($path: String!) {
		addFileToSocketChannel(path: $path)
	}
`

export default ADD_FILE_TO_SOCKET_CHANNEL
