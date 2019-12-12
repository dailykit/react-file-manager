import React from 'react'
import styled, { css, createGlobalStyle } from 'styled-components'

// State
import { Context, initialState, reducers } from './state/context'

// Components
const Sidebar = React.lazy(() => import('./sections/Sidebar'))
const Main = React.lazy(() => import('./sections/Main'))
const Navbar = React.lazy(() => import('./sections/Navbar'))

// Styles
const GlobalStyle = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:200,300,400,500,600,700&display=swap');
	* {
		box-sizing: border-box;
		font-family: 'IBM Plex Sans', sans-serif;
	}

	html {
		overflow: hidden;
	}

	body {
		height: 100vh;
		font-family: 'IBM Plex Sans', sans-serif;
	}
	:root {
		--border: #E0C9C9;

		--base-pt: 8;
		--spacer-1: calc(var(--base-pt) * 1px);
		--spacer-2: calc(var(--base-pt) * 2px);
		--spacer-3: calc(var(--base-pt) * 3px);
		--spacer-4: calc(var(--base-pt) * 4px);
	}
`

const App = () => {
	const [state, dispatch] = React.useReducer(reducers, initialState)

	return (
		<Context.Provider value={{ state, dispatch }}>
			<GlobalStyle />
			<FileManager isSidebarVisible={state.isSidebarVisible}>
				<React.Suspense fallback={<span>Loading...</span>}>
					<Sidebar />
					<Navbar />
					<Main />
				</React.Suspense>
			</FileManager>
		</Context.Provider>
	)
}

export default App

const FileManager = styled.div(
	({ isSidebarVisible }) => css`
		display: grid;
		height: 100vh;
		position: relative;
		grid-template-columns: ${isSidebarVisible ? '240px 1fr' : '40px 1fr'};
		grid-template-rows: 40px 1fr;
		grid-template-areas: 'aside nav' 'aside main';
		@media (max-width: 567px) {
			grid-template-columns: 1fr;
			grid-template-rows: 80px 1fr;
			grid-template-areas: 'nav' 'main';
		}
	`
)
