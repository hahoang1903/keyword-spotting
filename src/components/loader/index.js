import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Loader = ({ fontSize }) => {
	return <Spin indicator={<LoadingOutlined style={{ fontSize }} spin />} />
}

export default Loader
