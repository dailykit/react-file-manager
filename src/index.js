import React from 'react'
import ReactDOM from 'react-dom'

import './styles/index.scss'

const Header = React.lazy(() => import('./sections/Header'))
const Sidebar = React.lazy(() => import('./sections/Sidebar'))
const Main = React.lazy(() => import('./sections/Main'))
const Footer = React.lazy(() => import('./sections/Footer'))
const Navbar = React.lazy(() => import('./sections/Navbar'))

const App = () => {
	const [isSidebarVisible, toggleSidebar] = React.useState(false)
	const [folderData, setFolderData] = React.useState({})
	const [preview, togglePreview] = React.useState(false)
	const [view, toggleView] = React.useState('list')

	const breadcrumbs = ['Folders', 'Dishes', 'Vegetarians']
	const isCollapsed = () => {
		toggleSidebar(!isSidebarVisible)
	}
	const openFolder = value => setFolderData(value)
	return (
		<div
			className={`window ${isSidebarVisible ? 'window-isCollapsed' : ''}`}
		>
			<React.Suspense fallback={<span>Loading...</span>}>
				<Header title={'File Manager'} />
				<Sidebar isCollapsed={isCollapsed} openFolder={openFolder} />
				<Navbar
					toggleView={toggleView}
					togglePreview={togglePreview}
					breadcrumbs={breadcrumbs}
				/>
				<Main
					data={folderData}
					view={view}
					preview={preview}
					togglePreview={togglePreview}
				/>
				<Footer
					itemCount={
						folderData.children && folderData.children.length
					}
				/>
			</React.Suspense>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
