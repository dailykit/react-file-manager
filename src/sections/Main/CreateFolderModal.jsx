import React from 'react'

import Modal from '../../components/Modal'

const CreateFolderModal = ({ onModalClose, onModalSubmit }) => {
	const [value, setValue] = React.useState('')
	return (
		<Modal>
			<Modal.Header>Create Folder</Modal.Header>
			<Modal.Body>
				<label htmlFor="modal__input">Folder Name</label>
				<input
					type="text"
					name="createFolder"
					id="modal__input"
					value={value}
					placeholder="Enter a folder name"
					onChange={e => setValue(e.target.value)}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button onClick={() => onModalSubmit(value)}>
					Create Folder
				</button>
				<button onClick={() => onModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateFolderModal
