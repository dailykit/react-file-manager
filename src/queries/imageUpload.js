import gql from 'graphql-tag'

const IMAGE_UPLOAD = gql`
	mutation imageUpload($file: Upload!, $path: String!) {
		imageUpload(file: $file, path: $path) {
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
