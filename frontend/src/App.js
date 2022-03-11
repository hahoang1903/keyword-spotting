import React from 'react'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import axios from 'axios'
import './style/App.scss'

function App() {
	const [state, setState] = React.useState({
		name: '',
		isRecording: false,
		recordState: null,
		audioSrc: null,
		audioBlob: null,
		formMsg: null,
		msgType: null,
		isLoading: false
	})

	const handleNameChange = e => {
		setState({ ...state, name: e.target.value })
	}

	const handleButtonClick = e => {
		if (state.isRecording) {
			setState({ ...state, isRecording: false, recordState: RecordState.STOP })
		} else {
			setState({ ...state, isRecording: true, recordState: RecordState.START })
		}
	}

	const handleRecordFinish = data => {
		setState({ ...state, audioSrc: data.url, audioBlob: data.blob })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setState({ ...state, isLoading: true })

		let formData = new FormData()
		formData.append('username', state.name)
		formData.append('content', state.audioBlob)

		try {
			const response = await axios.post('http://124.158.1.125:8907/save_file_kws', formData)

			setState({ ...state, formMsg: response.data.response, msgType: 'success', isLoading: false })
		} catch (error) {
			const msgType = 'error'

			if (error.response) {
				setState({ ...state, formMsg: error.response.data.message, msgType, isLoading: false })
			} else {
				console.log(error)
				setState({ ...state, formMsg: 'Có lỗi đã xảy ra. Vui lòng thử lại sau', msgType, isLoading: false })
			}
		}
	}

	const clearMsg = () => {
		setState({ ...state, formMsg: null })
	}

	return (
		<div className="app">
			<div className="app-container">
				{state.formMsg ? (
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
					<div className="app-spinner" animating={`${state.isLoading}`}>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
