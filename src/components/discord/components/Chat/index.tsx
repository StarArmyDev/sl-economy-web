import { MessagesWrapper, HeaderActionBar, NewMessageWrapper, ContentHeader, ChannelName } from '..';
import type { Message } from '../../interface';
import styled from 'styled-components';
import { colors } from '../../utils';
import { useState } from 'react';

const StyledChat = styled.div`
    background: ${colors.grayLight};

    display: flex;
    flex-direction: column;

    .content-wrapper {
        display: flex;
        height: 100%;
    }

    .messages-container {
        flex: 1 1 auto;

        display: flex;
        flex-direction: column;
    }
`;

export const Chat = ({
    className,
    height,
    isPrivate,
    isWelcomeMessage = true,
    isReduced,
    channelName,
    messages,
}: {
    className?: string;
    height?: number;
    isPrivate?: boolean;
    isWelcomeMessage?: boolean;
    isReduced?: boolean;
    channelName: string;
    messages: Message[];
}) => {
    const [membersListVisible, setMembersListVisible] = useState(true);

    const toggleMembersListVisible = () => {
        setMembersListVisible(!membersListVisible);
    };

    return (
        <StyledChat className={className}>
            <ContentHeader
                content={<ChannelName name={channelName} isHeader isUser={isPrivate} textColor="#fff" />}
                rightContent={
                    <HeaderActionBar
                        isMembersListActive={membersListVisible}
                        onMembersToggleClick={toggleMembersListVisible}
                        isReduced={isReduced}
                    />
                }
            />

            <div className="content-wrapper" style={{ height: height }}>
                <div className="messages-container">
                    <MessagesWrapper messages={messages} channelName={channelName} isWelcomeMessage={isWelcomeMessage} />
                    <NewMessageWrapper channelName={channelName} isPrivate={isPrivate} isReduced={isReduced} />
                </div>
            </div>
        </StyledChat>
    );
};

export * from './AttachButton';
export * from './ButtonComponent';
export * from './EmojiPickerButton';
export * from './HandleMemberClick';
export * from './HeaderActionBar';
export * from './HeaderSearchBar';
export * from './MemberMessage';
export * from './MessageEmbed';
export * from './MessagesWrapper';
export * from './NewMessageButtons';
export * from './NewMessageForm';
export * from './NewMessageWrapper';
export * from './ReplyMessage';
export * from './SelectMenu';
export * from './WelcomeChannelMessage';
