import React from 'react'

const NameStep = ({ updateName, name, setAllowNextStep }) => {
	React.useEffect(() => {
		setAllowNextStep(name && true)
	}, [name, setAllowNextStep])

	return (
		<div className="name-form">
			<label htmlFor="recorderName" className="name-form__label">
				Tên người nói
			</label>
			<input
				type="text"
				id="recorderName"
				className="name-form__input"
				placeholder="Nhập tên người nói"
				value={name}
				onChange={updateName}
			/>
		</div>
	)
}

export default NameStep
