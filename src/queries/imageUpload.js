import gql from 'graphql-tag'

const IMAGE_UPLOAD = gql`
	mutation imageUpload($files: [Upload!]!, $path: String!) {
		imageUpload(files: $files, path: $path) {
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

export default IMAGE_UPLOAD
