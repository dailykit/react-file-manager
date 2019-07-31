import React from 'react'
import ReactDOM from 'react-dom'

import './styles/index.scss'

const Header = React.lazy(() => import('./sections/Header'))
const Sidebar = React.lazy(() => import('./sections/Sidebar'))
const Main = React.lazy(() => import('./sections/Main'))
const Footer = React.lazy(() => import('./sections/Footer'))

const App = () => {
	const [collapse, setCollapse] = React.useState(false)
	const isCollapsed = () => {
		setCollapse(!collapse)
	}
	return (
		<div className={`window ${collapse ? 'window-isCollapsed' : ''}`}>
			<React.Suspense fallback={<span>Loading...</span>}>
				<Header title={'File Manager'} />
				<Sidebar isCollapsed={isCollapsed} />
				<Main />
				<Footer />
			</React.Suspense>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
