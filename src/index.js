import React from 'react'
import ReactDOM from 'react-dom'

import { ToastProvider } from 'react-toast-notifications'

// Apollo Client Imports
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'

// Components
import App from './App'
import ToastContainer from './components/ToastContainer'

// Styles
import './styles/index.scss'

const cache = new InMemoryCache()

const client = new ApolloClient({
	link: ApolloLink.from([
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) =>
					console.log(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
					)
				)
			if (networkError) console.log(`[Network error]: ${networkError}`)
		}),
		new createUploadLink({
			uri: process.env.REACT_APP_GRAPHQL_URI,
		}),
	]),
	cache,
})

const Main = () => {
	return (
		<ApolloProvider client={client}>
			<ToastProvider
				placement="bottom-right"
				components={{ ToastContainer }}
				autoDismissTimeout={2000}
			>
				<App />
			</ToastProvider>
		</ApolloProvider>
	)
}

ReactDOM.render(<Main />, document.getElementById('root'))
