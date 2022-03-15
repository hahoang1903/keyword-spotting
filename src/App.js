/* eslint-disable eqeqeq */
import React from 'react'
import axios from 'axios'
import { Steps, Button, Modal } from 'antd'
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import NameStep from './components/name-step'
import AudioStep from './components/audio-step'
import Loader from './components/loader'

function App() {
	const [state, setState] = React.useState({
		name: '',
		audios: [],
		currentStep: 0
	})
	const [allowNextStep, setAllowNextStep] = React.useState(false)

	const updateName = ({ target: { value } }) => {
		setState({ ...state, name: value })
	}

	const getUpdateAudioFunc = i => data => {
		var newAudios = [...state.audios]
		newAudios[i] = {
			src: data.url,
			blob: data.blob
		}
		setState({ ...state, audios: newAudios })
	}

	const handleSubmit = async () => {
		const modal = Modal.info({
			content: <Loader fontSize="4.8rem" />,
			icon: null,
			bodyStyle: { textAlign: 'center' },
			okButtonProps: { style: { display: 'none' } },
			maskClosable: false
		})

		var formData = new FormData()
		formData.append('username', state.name)

		state.audios.forEach((audio, i) => formData.append(`content${i}`, audio.blob))

		try {
			const response = await axios.post('...', formData)
			modal.update({
				content: response.data.response,
				icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
				bodyStyle: { textAlign: 'left' },
				okButtonProps: { style: { display: 'block' } }
			})
		} catch (error) {
			if (error.response) {
				modal.update({
					content: error.response.data.message,
					icon: <CloseCircleTwoTone twoToneColor="#ec2e5e" />,
					bodyStyle: { textAlign: 'left' },
					okButtonProps: { style: { display: 'block' } }
				})
			} else {
				console.log(error)
				modal.update({
					content: 'Có lỗi đã xảy ra. Vui lòng thử lại sau',
					icon: <CloseCircleTwoTone twoToneColor="#ec2e5e" />,
					bodyStyle: { textAlign: 'left' },
					okButtonProps: { style: { display: 'block' } }
				})
			}
		}
	}

	const keywords = ['Hey CiCi', 'Hey CMC']

	const numberOfSteps = 4
	const steps = [
		{
			description: 'Tên người nói',
			content: <NameStep updateName={updateName} name={state.name} setAllowNextStep={setAllowNextStep} />
		}
	].concat(
		(() => {
			var audioSteps = []
			for (let i = 0; i < numberOfSteps; i++) {
				audioSteps.push({
					description: `File audio ${i + 1}`,
					content: (
						<AudioStep
							updateAudioData={getUpdateAudioFunc(i)}
							audioSrc={state.audios[i]?.src}
							setAllowNextStep={setAllowNextStep}
							keyword={keywords[Math.floor(i / 2)]}
							distance={i % 2 == 0 ? 'xa' : 'gần'}
						/>
					)
				})
			}
			return audioSteps
		})()
	)

	const nextStep = () => {
		setState(state => ({ ...state, currentStep: state.currentStep + 1 }))
	}

	const prevStep = () => {
		setState(state => ({ ...state, currentStep: state.currentStep - 1 }))
	}

	const getStepTitle = stepIndex => {
		return state.currentStep > stepIndex
			? 'Hoàn thành'
			: state.currentStep < stepIndex
			? 'Chưa thực hiện'
			: 'Đang thực hiện'
	}

	return (
		<div className="app">
			<Steps className="app-steps-section" current={state.currentStep}>
				{steps.map((step, i) => (
					<Steps.Step key={step.description} title={getStepTitle(i)} description={step.description} />
				))}
			</Steps>
			<div className="app-steps-section app-steps-section--center">{steps[state.currentStep].content}</div>
			<div className="app-steps-section app-steps-section--right">
				{state.currentStep > 0 && (
					<Button style={{ margin: '0 8px' }} onClick={prevStep}>
						Quay lại
					</Button>
				)}
				{state.currentStep < steps.length - 1 && (
					<Button type="primary" onClick={nextStep} disabled={!allowNextStep}>
						Tiếp theo
					</Button>
				)}
				{state.currentStep == steps.length - 1 && (
					<Button type="primary" onClick={handleSubmit} disabled={!allowNextStep}>
						Gửi
					</Button>
				)}
			</div>
			{/* {state.formMsg ? (
					<div className="app-section">
						<div className={`app-recorder-form__msg app-recorder-form__msg--${state.msgType}`}>
							{state.formMsg}
							<span onClick={clearMsg}>&times;</span>
						</div>
					</div>
				) : null}

				<div className="app-section">
					<AudioReactRecorder
						state={state.recordState}
						onStop={handleRecordFinish}
						canvasWidth={1200}
						canvasHeight={300}
					/>
				</div>

				<div className="app-section">
					<button className="app-btn" onClick={handleButtonClick}>
						{state.isRecording ? 'Dừng' : 'Bắt đầu'}&nbsp;
					</button>
				</div>

				<div className="app-section">
					<audio controls src={state.audioSrc}></audio>
				</div>

				<div className="app-section">
					<form className="app-recorder-form" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="recorderName" className="app-recorder-form__label">
								Tên người nói<span>*</span>
							</label>
							<input
								type="text"
								id="recorderName"
								className="app-recorder-form__input"
								placeholder="Nhập tên người nói"
								value={state.name}
								onChange={handleNameChange}
							/>
						</div>
						<div>
							<button
								disabled={state.isLoading || state.isRecording || !state.audioBlob || !state.name}
								type="submit"
								className="app-btn app-btn--submit"
							>
								Gửi dữ liệu ghi âm
							</button>
						</div>
					</form>
				</div>

				<div className="app-section">
				</div> */}
		</div>
	)
}

export default App
