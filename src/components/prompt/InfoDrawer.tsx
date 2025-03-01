import { Descriptions, Drawer } from 'antd';
import { GetPromptResponse } from '../../hooks/queries/prompt/useGetPrompt';
import { Categories } from '../../core/Prompt';

interface InfoDrawerProps {
	info: GetPromptResponse;
	isOpen: boolean;
	onClose: () => void;
}

export default function InfoDrawer({ isOpen, onClose, info }: InfoDrawerProps) {
	return (
		<Drawer open={isOpen} onClose={onClose} placement="bottom">
			<Descriptions title={info?.title} size="small">
				<Descriptions.Item label="작성자">{info?.author_nickname}</Descriptions.Item>

				<Descriptions.Item label="공개 여부">{info?.visibility}</Descriptions.Item>

				<Descriptions.Item label="카테고리">
					{info?.categories.map((cat) => Categories[cat].ko).join(', ')}
				</Descriptions.Item>

				<Descriptions.Item label="조회수">{info?.views}</Descriptions.Item>

				<Descriptions.Item label="사용된 횟수">{info?.usages}</Descriptions.Item>

				<Descriptions.Item label="즐겨찾기 수">{info?.star}</Descriptions.Item>

				<Descriptions.Item label="설명">{info?.description}</Descriptions.Item>

				<Descriptions.Item label="프롬프트">{info?.prompt_template}</Descriptions.Item>
			</Descriptions>
		</Drawer>
	);
}
