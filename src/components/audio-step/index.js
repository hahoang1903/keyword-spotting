import React from 'react'
import { Button } from 'antd'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'

const AudioStep = props => {
	const { audioSrc, updateAudioData, setAllowNextStep, keyword, distance } = props
	const [recordState, setRecordState] = React.useState(RecordState.STOP)
	const audioRef = React.useRef(null)

	React.useEffect(() => {
		audioRef.current.src = audioSrc
		audioRef.current.load()
	}, [audioSrc])

	React.useEffect(() => {
		setAllowNextStep(audioSrc && recordState === RecordState.STOP)
	}, [audioSrc, recordState, setAllowNextStep])

	const handleButtonClick = () => {
		if (recordState === RecordState.START) {
			setRecordState(RecordState.STOP)
		} else {
			setRecordState(RecordState.START)
		}
	}

	return (
		<>
			<div className="audio-recorder-section">
				<div className="audio-recorder-text audio-recorder-text--main">Bạn hãy nói: {keyword}</div>
				<div className="audio-recorder-text audio-recorder-text--sub">Khoảng cách: {distance}</div>
			</div>

			<div className="audio-recorder-section">
				<AudioReactRecorder
					state={recordState}
					onStop={updateAudioData}
					canvasWidth={1200}
					canvasHeight={300}
				/>
			</div>

			<div className="audio-recorder-section">
				<Button type="primary" onClick={handleButtonClick}>
					{recordState === RecordState.START ? 'Dừng' : 'Bắt đầu'}&nbsp;
				</Button>
			</div>

			<div className="audio-recorder-section">
				<audio controls ref={audioRef}></audio>
			</div>
		</>
	)
}

export default AudioStep
