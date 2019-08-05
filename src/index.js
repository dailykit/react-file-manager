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
	const [preview, togglePreview] = React.useState(false)
	const [view, toggleView] = React.useState('list')

	const breadcrumbs = ['Folders', 'Dishes', 'Vegetarians']
	const isCollapsed = () => {
		toggleSidebar(!isSidebarVisible)
	}
	const selectedFolderData = [
		{ id: 1, name: 'folder2', type: 'folder' },
		{ id: 2, name: 'folder1', type: 'folder' },
		{ id: 3, name: 'file1', type: 'file', size: 1024 * 1024 * 1.5 },
		{ id: 4, name: 'file5', type: 'file', size: 1024 * 2 },
		{ id: 5, name: 'file3', type: 'file', size: 1024 * 3 },
		{ id: 6, name: 'file4', type: 'file', size: 1024 * 5 },
	]
	return (
		<div
			className={`window ${isSidebarVisible ? 'window-isCollapsed' : ''}`}
		>
			<React.Suspense fallback={<span>Loading...</span>}>
				<Header title={'File Manager'} />
				<Sidebar isCollapsed={isCollapsed} />
				<Navbar
					toggleView={toggleView}
					togglePreview={togglePreview}
					breadcrumbs={breadcrumbs}
				/>
				<Main
					data={selectedFolderData}
					view={view}
					preview={preview}
					togglePreview={togglePreview}
				/>
				<Footer itemCount={selectedFolderData.length} />
			</React.Suspense>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
