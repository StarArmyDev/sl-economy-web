import { constants, colors } from '../../utils';
import { UserAvatar } from '../UserAvatar';
import type { User } from '../../interface';
import styled from 'styled-components';
import { MemberRolesList } from '.';

const StyledMemberCard = styled.div`
    width: ${constants.memberCardWidth}px;
    background-color: ${colors.memberCardBackground};
    color: ${colors.memberCardContent};

    .header {
        background-color: ${(props: { isPlaying: boolean }) =>
            props.isPlaying ? colors.memberCardHeaderPlayingBackground : colors.memberCardHeaderBackground};

        .avatar-wrapper {
            cursor: pointer;

            .status {
                border-color: ${props => (props.isPlaying ? colors.memberCardHeaderPlayingBackground : colors.memberCardHeaderBackground)};
            }

            :hover .view-profile {
                opacity: 1;
            }
        }

        .view-profile {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;

            display: flex;
            justify-content: center;
            align-items: center;

            text-transform: uppercase;
            font-size: 0.65em;
            font-weight: 900;

            transition: opacity 0.1s ease;
            box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.75);
            border-radius: 50%;
            opacity: 0;
        }

        .user-data {
            padding: 20px 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .username {
            margin-top: 10px;
            color: #fff;
            font-weight: 600;
            white-space: normal;
            word-break: break-word;
        }

        .tag {
            font-weight: 400;
            font-size: 1.1em;
            color: ${colors.memberCardUserTag};
        }
    }

    .content {
        padding: 12px 10px 10px;

        .roles {
            margin: 12px 0 20px;
        }

        .field-key {
            margin-bottom: 8px;
            font-weight: 800;
            font-size: 0.75em;
            color: ${colors.memberCardFieldKey};
            text-transform: uppercase;
            text-align: start;
        }
    }

    .footer {
        padding: 10px;
        border-top: 1px solid ${colors.memberCardFooterBorder};
        text-align: center;

        .protip {
            margin-top: 8px;
            color: ${colors.proptipText};
            font-size: 0.7em;

            .label {
                color: ${colors.proptipLabel};
                text-transform: uppercase;
                font-weight: 800;
                font-size: 1.05em;
            }
        }
    }
`;

const StyledNoteInput = styled.input`
    margin-left: -4px;
    padding: 4px;
    font-size: 0.7em;
    height: 22px;
    width: 100%;
    border-radius: 2px;

    color: ${colors.memberCardNoteInput};
    background: transparent;
    border: 0;
    outline: 0;

    &:focus {
        background-color: #202225;
    }
`;

const StyledMessageInput = styled.input`
    background-color: #36393f;
    color: hsla(0, 0%, 100%, 0.7);

    padding: 8px 10px;
    border: 1px solid #23262a;
    border-radius: 3px;
    font-size: 0.9em;
    width: 100%;
    height: 36px;
`;

export const MemberCard = ({ member }: { member: User }) => (
    <StyledMemberCard isPlaying={false}>
        <div className="header">
            <div className="user-data">
                <UserAvatar className="avatar-wrapper" avatarUrl={member.avatarUrl} isBig>
                    <div className="view-profile">Ver Perfil</div>
                </UserAvatar>

                <div className="username">
                    {member.username}
                    <span className="tag">#{member.tag}</span>
                </div>
            </div>
        </div>

        <div className="content">
            {member.roles && (
                <>
                    <div className="field-key roles-key">{member.roles.length > 0 ? 'Roles' : 'Sin Roles'}</div>
                    <div className="field-value roles">
                        <MemberRolesList roles={member.roles} />
                    </div>
                </>
            )}

            <div className="field-key">Nota</div>
            <div className="field-value">
                <StyledNoteInput placeholder="Haga clic para agregar una nota" />
            </div>
        </div>

        <div className="footer">
            <StyledMessageInput placeholder={`Enviar Mensaje a @${member.username}`} />
            <div className="protip">
                <span className="label">Protip:</span> Disfruta de la vida en el mundo real
            </div>
        </div>
    </StyledMemberCard>
);
