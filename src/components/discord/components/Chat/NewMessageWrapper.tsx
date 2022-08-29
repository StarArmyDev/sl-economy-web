import styled from "styled-components";
import { NewMessageForm } from ".";

const StyledNewMessageWrapper = styled.div`
    margin: 0 20px;
`;

const StyledContainer = styled.div`
    border-top: 1px solid hsla(0, 0%, 100%, 0.06);
    margin-bottom: 30px;
    padding-top: 20px;
`;

export const NewMessageWrapper = ({ channelName, isPrivate, isReduced }: { channelName: string; isPrivate?: boolean; isReduced?: boolean }) => (
    <StyledNewMessageWrapper>
        <StyledContainer>
            <NewMessageForm channelName={channelName} isPrivate={isPrivate} isReduced={isReduced} />
        </StyledContainer>
    </StyledNewMessageWrapper>
);
