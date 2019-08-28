import gql from 'graphql-tag'

const resolvers = {
	Query: {
		history: (_, args, { cache }) => {
			const query = gql`
				query history {
					history @client
				}
			`
			const previous = cache.readQuery({ query })
			return previous.data.history
		},
	},
	Mutation: {
		updateHistory: (_, { path }, { cache }) => {
			const query = gql`
				query history {
					history @client
				}
			`
			const previous = cache.readQuery({ query })
			let data = {}
			if (previous.history.length > 15) {
				data = {
					history: [path],
				}
			} else {
				data = {
					history: [...previous.history, path],
				}
			}
			cache.writeData({ data })
			return 'Updated History!'
		},
	},
}

export default resolvers
