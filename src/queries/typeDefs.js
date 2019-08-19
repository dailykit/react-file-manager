import gql from 'graphql-tag'

const typeDefs = gql`
	extend type Query {
		history: [String]
	}
	extend type Mutation {
		updateHistory(path: String!): [String]
	}
`

export default typeDefs
