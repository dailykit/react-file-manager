import React from 'react'

const Sidebar = React.lazy(() => import('./sections/Sidebar'))
const Main = React.lazy(() => import('./sections/Main'))
const Navbar = React.lazy(() => import('./sections/Navbar'))

const App = () => {
	const [isSidebarVisible, toggleSidebar] = React.useState(false)
	const [currentFolderPath, setCurrentFolderPath] = React.useState(
		'./../apps'
	)
	const [preview, togglePreview] = React.useState(false)
	const [view, toggleView] = React.useState('list')
	const [searchTerm, setSearchTerm] = React.useState('')

	const isCollapsed = () => {
		toggleSidebar(!isSidebarVisible)
	}
	const setFolderPath = value => setCurrentFolderPath(value)
	return (
		<div
			className={`window ${isSidebarVisible ? 'window-isCollapsed' : ''}`}
		>
			<React.Suspense fallback={<span>Loading...</span>}>
				<Sidebar
					isCollapsed={isCollapsed}
					setFolderPath={setFolderPath}
					isSidebarVisible={isSidebarVisible}
				/>
				<Navbar
					toggleView={toggleView}
					togglePreview={togglePreview}
					breadcrumbs={currentFolderPath}
					setFolderPath={setFolderPath}
					setSearchTerm={setSearchTerm}
				/>
				<Main
					currentFolderPath={currentFolderPath}
					searchTerm={searchTerm}
					view={view}
					preview={preview}
					setFolderPath={setFolderPath}
					togglePreview={togglePreview}
				/>
			</React.Suspense>
		</div>
	)
}

export default App
