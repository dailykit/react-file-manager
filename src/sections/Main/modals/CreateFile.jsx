import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useToasts } from 'react-toast-notifications'

// Components
import { Modal } from '../../../components'

// Styles
import { Wrapper } from './styled'

// Queries
import { GET_FOLDER, CREATE_FILE } from '../../../queries'

const CreateModal = ({ folderPath, onModalClose }) => {
	const { addToast } = useToasts()
	const [name, setName] = React.useState(null)
	const [createFile] = useMutation(CREATE_FILE, {
		onCompleted: ({ createFile }) => {
			addToast(createFile.message, {
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
			<Modal.Header>Create File</Modal.Header>
			<Modal.Body>
				<Wrapper>
					<label htmlFor="modal__input">File Name</label>
					<input
						type="text"
						name="createFile"
						id="modal__input"
						value={name || ''}
						placeholder="Enter a file name"
						onChange={e => setName(e.target.value)}
					/>
				</Wrapper>
			</Modal.Body>
			<Modal.Footer>
				<button
					onClick={() => {
						createFile({
							variables: {
								path: `${folderPath}/${name}.json`,
								content: '',
							},
						})
						onModalClose('file')
					}}
				>
					Submit
				</button>
				<button onClick={() => onModalClose('file')}>Cancel</button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateModal
