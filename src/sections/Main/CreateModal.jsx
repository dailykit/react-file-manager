import React from 'react'

import Modal from '../../components/Modal'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'

const CreateModal = ({ onModalClose, onModalSubmit }) => {
	const [fileName, setFileName] = React.useState(null)
	const [folderName, setFolderName] = React.useState(null)
	const [image, setImage] = React.useState(null)
	const [type, setType] = React.useState('')
	const [tabIndex, setTabIndex] = React.useState(0)
	React.useEffect(() => {
		setFileName(null)
		setFolderName(null)
		setImage(null)
	}, [tabIndex])
	const args = {
		value:
			type === 'file' ? fileName : type === 'folder' ? folderName : image,
		type,
	}
	return (
		<Modal>
			<Tabs onChange={index => setTabIndex(index)}>
				<TabList>
					<Tab>File</Tab>
					<Tab>Folder</Tab>
					<Tab>Image</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<label htmlFor="modal__input">File Name</label>
						<input
							type="text"
							name="createFolder"
							id="modal__input"
							value={fileName || ''}
							placeholder="Enter a file name"
							onChange={e =>
								setFileName(e.target.value) || setType('file')
							}
						/>
					</TabPanel>
					<TabPanel>
						<label htmlFor="modal__input">Folder Name</label>
						<input
							type="text"
							name="createFolder"
							id="modal__input"
							value={folderName || ''}
							placeholder="Enter a folder name"
							onChange={e =>
								setFolderName(e.target.value) ||
								setType('folder')
							}
						/>
					</TabPanel>
					<TabPanel>
						<label htmlFor="modal__input">Select Image</label>
						<input
							type="file"
							name="image"
							id="modal__input"
							onChange={e =>
								setImage(e.target) || setType('image')
							}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>
			<Modal.Footer>
				<button onClick={() => onModalSubmit(args)}>Submit</button>
				<button onClick={() => onModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateModal
