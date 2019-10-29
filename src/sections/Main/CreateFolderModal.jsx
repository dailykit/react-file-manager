import React from 'react'

import Modal from '../../components/Modal'
import { Context } from '../../state/context'

const CreateFolderModal = ({ onModalClose, onModalSubmit }) => {
	const { state, dispatch } = React.useContext(Context)
	return (
		<Modal>
			<Modal.Header>Create Folder</Modal.Header>
			<Modal.Body>
				<label htmlFor="modal__input">Folder Name</label>
				<input
					type="text"
					name="createFolder"
					id="modal__input"
					value={state.folderName}
					placeholder="Enter a folder name"
					onChange={e =>
						dispatch({
							type: 'SET_FOLDER_NAME',
							payload: e.target.value,
						})
					}
				/>
			</Modal.Body>
			<Modal.Footer>
				<button onClick={() => onModalSubmit()}>Create Folder</button>
				<button onClick={() => onModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateFolderModal
