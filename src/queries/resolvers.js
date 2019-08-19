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
			const data = {
				history: [...previous.history, path],
			}
			return cache.writeData({ data })
		},
	},
}

export default resolvers
