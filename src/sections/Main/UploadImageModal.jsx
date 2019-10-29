import React from 'react'

import Modal from '../../components/Modal'

const UploadImageModal = ({ onModalClose, onModalSubmit }) => {
	const [file, setFile] = React.useState(null)
	return (
		<Modal>
			<Modal.Header>Upload Image</Modal.Header>
			<Modal.Body>
				<label htmlFor="modal__input">Select Image</label>
				<input
					type="file"
					name="image"
					id="modal__input"
					onChange={e => setFile(e.target)}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button onClick={() => onModalSubmit(file)}>
					Upload Image
				</button>
				<button onClick={() => onModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default UploadImageModal
