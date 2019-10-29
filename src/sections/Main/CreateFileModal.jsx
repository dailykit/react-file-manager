import React from 'react'

import Modal from '../../components/Modal'
import { Context } from '../../state/context'

const CreateFileModal = ({ onModalClose, onModalSubmit }) => {
	const { state, dispatch } = React.useContext(Context)
	return (
		<Modal>
			<Modal.Header>Create File</Modal.Header>
			<Modal.Body>
				<label htmlFor="modal__input">File Name</label>
				<input
					type="text"
					name="createFolder"
					id="modal__input"
					value={state.fileName}
					placeholder="Enter a file name"
					onChange={e =>
						dispatch({
							type: 'SET_FILE_NAME',
							payload: e.target.value,
						})
					}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button onClick={() => onModalSubmit()}>Create File</button>
				<button onClick={() => onModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateFileModal
