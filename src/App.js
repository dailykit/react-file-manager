import React from 'react'

import { Context, initialState, reducers } from './state/context'

const Sidebar = React.lazy(() => import('./sections/Sidebar'))
const Main = React.lazy(() => import('./sections/Main/index'))
const Navbar = React.lazy(() => import('./sections/Navbar'))

const App = () => {
	const [state, dispatch] = React.useReducer(reducers, initialState)

	return (
		<Context.Provider value={{ state, dispatch }}>
			<div
				className={`window ${
					state.isSidebarVisible ? '' : 'window-isCollapsed'
				}`}
			>
				<React.Suspense fallback={<span>Loading...</span>}>
					<Sidebar />
					<Navbar />
					<Main />
				</React.Suspense>
			</div>
		</Context.Provider>
	)
}

export default App
