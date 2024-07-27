import { Button } from "antd";
import styled from "styled-components";
import { openUrlInNewTab } from "../../../../service/chrome/utils";

const defaultText = `안녕하세요! 현재 사용 중인 계정의 개인 프롬프트 저장 한도에 도달했습니다.

방금 프롬프트를 삭제하셨다면, 잠시 후 다시 시도해 주세요. 시스템에 반영되는 데 약간의 시간이 필요할 수 있 습니다.

더 많은 개인 아이디어를 저장하고 싶으신가요? 프리미 엄 플랜으로 업그레이드하시면 더 많은 개인 프롬프트를 저장해 사용할 수 있습니다. 당신의 창의력에 날개를 달 아보세요!
`;
interface LimitContentProps {
    text?: string;
}
export default function LimitContent({
    text = defaultText,
}: LimitContentProps) {
    return <Text>{text}</Text>;
}

const Text = styled.div`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

interface LimitFooterProps {
    closeModal: () => void;
}
export function LimitFooter({ closeModal }: LimitFooterProps) {
    function handleGoToPlan() {
        openUrlInNewTab("https://github.com/yusiny"); //[TODO] 노션 링크로 변경
        closeModal();
    }

    return (
        <>
            <Button onClick={closeModal}>나중에 하기</Button>
            <Button type="primary" onClick={handleGoToPlan}>
                플랜 둘러보기
            </Button>
        </>
    );
}