import { constants, colors } from "../../utils";
import styled from "styled-components";
import { User } from "../../interface";
import React from "react";

const StyledMemberMessageGroup = styled.div`
    padding: 20px 0;

    .divider {
        width: auto;
        height: 1px;
        background: ${colors.messageDivider};
        margin: 20px 20px -20px;
    }

    &:last-child .divider {
        display: none;
    }
`;

export const MemberMessageGroup = ({
    member,
    time,
    onMemberClick,
    children
}: {
    member: User;
    time: Date;
    onMemberClick: Function;
    children: JSX.Element[];
}) => (
    <StyledMemberMessageGroup>
        {React.Children.map(children, (child, index) => React.cloneElement(child, { member, time, isHeading: index === 0, onMemberClick }))}
        <div className="divider" />
    </StyledMemberMessageGroup>
);

const StyledMessage = styled.div`
    margin-bottom: 0.2em;

    .header {
        display: flex;
        height: 1.3em;

        .avatar-wrapper {
            margin: -2px 20px 20px;
            width: 40px;
            height: 40px;
            cursor: pointer;
        }

        .avatar {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            overflow: hidden;
            border-radius: 50%;
            transition: 0.1s opacity ease-in;

            :hover {
                opacity: 0.85;
            }
        }

        .username {
            color: ${(props: { usernameColor?: string }) => props.usernameColor || colors.memberUsernameChat};
            cursor: pointer;

            :hover {
                text-decoration: underline;
            }
        }

        .time {
            color: ${colors.messageTime};
            font-size: 0.75em;
            font-weight: 400;
            margin-left: 0.3em;
        }
    }

    .content {
        margin-left: 80px;
        width: 80%;

        font-weight: 400;
        font-size: 0.9375em;
        line-height: 1.4;
        color: ${colors.messageContent};
        white-space: pre-wrap;
        word-wrap: break-word;
    }
`;

export const MemberMessage = ({
    user,
    time,
    children,
    isHeading,
    onMemberClick
}: {
    user: User;
    time: Date;
    children: JSX.Element | string;
    isHeading?: boolean;
    onMemberClick: Function;
}) => {
    const rol = user.roles ? user.roles[0] : undefined;

    return (
        <StyledMessage usernameColor={rol?.color}>
            {isHeading && (
                <div className="header">
                    <div className="avatar-wrapper" onClick={(e) => onMemberClick(e, user)}>
                        <div className="avatar" style={{ backgroundImage: `url(${user.avatarUrl || constants.defaultAvatar})` }} />
                    </div>
                    <div className="data">
                        <span className="username" onClick={(e) => onMemberClick(e, user)}>
                            {user.username}
                        </span>
                        <span className="time">{time.toLocaleDateString()}</span>
                    </div>
                </div>
            )}
            <div className="content">{children}</div>
        </StyledMessage>
    );
};
