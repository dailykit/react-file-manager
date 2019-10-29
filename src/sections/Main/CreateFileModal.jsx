import React from 'react'

import Modal from '../../components/Modal'

const CreateFileModal = ({ onModalClose, onModalSubmit }) => {
	const [value, setValue] = React.useState('')
	return (
		<Modal>
			<Modal.Header>Create File</Modal.Header>
			<Modal.Body>
				<label htmlFor="modal__input">File Name</label>
				<input
					type="text"
					name="createFolder"
					id="modal__input"
					value={value}
					placeholder="Enter a file name"
					onChange={e => setValue(e.target.value)}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button onClick={() => onModalSubmit(value)}>
					Create File
				</button>
				<button onClick={() => onModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateFileModal
