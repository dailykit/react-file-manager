import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

// Components
import { Modal } from '../../../components'

// Styles
import { Wrapper } from './styled'

// Queries
import { GET_FOLDER, CREATE_FOLDER } from '../../../queries'

const CreateModal = ({ folderPath, onModalClose }) => {
	const { addToast } = useToasts()
	const [name, setName] = React.useState(null)
	const [createFolder] = useMutation(CREATE_FOLDER, {
		onCompleted: ({ createFolder }) => {
			addToast(createFolder.message, {
				appearance: 'success',
				autoDismiss: true,
			})
		},
		refetchQueries: [
			{ query: GET_FOLDER, variables: { path: folderPath } },
		],
	})
	return (
		<Modal>
			<Modal.Header>Create Folder</Modal.Header>
			<Modal.Body>
				<Wrapper>
					<label htmlFor="modal__input">Folder Name</label>
					<input
						type="text"
						name="createFolder"
						id="modal__input"
						value={name || ''}
						placeholder="Enter a folder name"
						onChange={e => setName(e.target.value)}
					/>
				</Wrapper>
			</Modal.Body>
			<Modal.Footer>
				<button
					onClick={() => {
						createFolder({
							variables: {
								path: `${folderPath}/${name}`,
								content: '',
							},
						})
						onModalClose('folder')
					}}
				>
					Submit
				</button>
				<button onClick={() => onModalClose('folder')}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateModal
