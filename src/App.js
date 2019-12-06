import React from 'react'
import styled, { css, createGlobalStyle } from 'styled-components'

import { Context, initialState, reducers } from './state/context'

const Sidebar = React.lazy(() => import('./sections/Sidebar'))
const Main = React.lazy(() => import('./sections/Main/index'))
const Navbar = React.lazy(() => import('./sections/Navbar'))

const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}

	html {
		overflow: hidden;
	}

	body {
		height: 100vh;
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
			<FileManager className={`window ${state.isSidebarVisible ? '' : 'window-isCollapsed'}`}>
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
	() => css`
		display: grid;
		height: 100vh;
		position: relative;
		grid-template-columns: 240px 1fr;
		grid-template-rows: 40px 1fr;
		grid-template-areas: 'aside nav' 'aside main';
		&.window-isCollapsed {
			grid-template-columns: 40px 1fr;
			.window__main,
			.window__main__navbar {
				width: calc(100vw - 40px);
			}
			.window__sidebar__content {
				display: none;
			}
		}
		@media (max-width: 567px) {
			grid-template-columns: 1fr;
			grid-template-rows: 80px 1fr;
			grid-template-areas: 'nav' 'main';
			&.window-isCollapsed {
				.window__sidebar {
					width: 240px;
					-webkit-box-shadow: 1px 0 20px 2px rgba(0, 0, 0, 0.2);
					box-shadow: 1px 0 20px 2px rgba(0, 0, 0, 0.2);
					.window__sidebar__content {
						display: block;
					}
				}
				.window__main,
				.window__main__navbar {
					width: calc(100vw - 40px);
				}
			}
			.window__main {
				width: calc(100vw - 40px) !important;
				margin-left: 40px;
			}
		}
	`
)
