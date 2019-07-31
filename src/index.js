import React from 'react'
import ReactDOM from 'react-dom'

import './styles/index.css'

const Header = React.lazy(() => import('./sections/Header'))
const Sidebar = React.lazy(() => import('./sections/Sidebar'))
const Main = React.lazy(() => import('./sections/Main'))
const Footer = React.lazy(() => import('./sections/Footer'))

const App = () => {
	return (
		<div id="window">
			<React.Suspense fallback={() => <span>Loading...</span>}>
				<Header />
				<Sidebar />
				<Main />
				<Footer />
			</React.Suspense>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
