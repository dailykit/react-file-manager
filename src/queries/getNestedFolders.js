import gql from 'graphql-tag'

const GET_NESTED_FOLDERS = gql`
	query getNestedFolders($path: String!) {
		getNestedFolders(path: $path) {
			name
			path
			children {
				name
				path
				children {
					name
					path
					children {
						name
						path
						children {
							name
							path
						}
					}
				}
			}
		}
	}
`

export default GET_NESTED_FOLDERS
