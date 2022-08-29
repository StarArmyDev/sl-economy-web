import { Reply } from "../../interface";
import styled from "styled-components";
import { handleMemberClick } from ".";

const StyledReplyMessage = styled.div`
    .repliedMessage {
        margin-buttom: 4px;
        display: -webkit-box;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        font-size: 0.875rem;
        line-height: 1.125rem;
        color: #b9bbbe;
    }

    .repliedMessage::before {
        content: ".";
        color: #36393f;

        margin-right: 6px;
        margin-top: 12px;
        margin-left: 16px;
        margin-bottom: -10px;

        padding-right: 28px;
        padding-bottom: 4px;

        border-left: 2px solid #5c5d5f;
        border-bottom: 0 solid #c7ccd1;
        border-right: 0 solid #c7ccd1;
        border-top: 2px solid #5c5d5f;
        border-top-left-radius: 7px;
    }

    .replyAvatar {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 auto;
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-right: 0.25rem;
    }

    .commandName,
    .username {
        -ms-flex-negative: 0;
        flex-shrink: 0;
        font-size: inherit;
        line-height: inherit;
        margin-right: 0.25rem;
        opacity: 0.64;
    }

    .commandName {
        margin-left: 0.25rem;
        font-weight: 500;
        color: hsl(197, calc(1 * 100%), 47.8%);
    }
`;

export const ReplyMessage = ({ reply, isBot }: { reply: Reply; isBot?: boolean }) => (
    <StyledReplyMessage>
        <div className="repliedMessage ps-4" aria-hidden="true">
            <img className="replyAvatar" src={reply.user.avatarUrl} alt="" role="button" onClick={(e) => handleMemberClick(e, reply.user)} />
            <span
                className="username"
                style={{ color: reply.user.roles ? reply.user.roles[0].color : undefined }}
                role="button"
                onClick={(e) => handleMemberClick(e, reply.user)}
            >
                {reply.user.username}
            </span>
            {reply.content.startsWith("/") && "ha utilizado"}
            <span className={reply.content.startsWith("/") ? "commandName" : ""}>{reply.content}</span>
        </div>
    </StyledReplyMessage>
);
