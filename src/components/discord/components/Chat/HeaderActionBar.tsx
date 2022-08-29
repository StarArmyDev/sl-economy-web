import { ThreadsIcon, NotificationBellIcon, PinIcon, PeopleIcon, InboxIcon, QuestionMarkIcon } from "../../icons";
import styled from "styled-components";
import { TooltipWrapper } from "..";
import { HeaderSearchBar } from ".";

const StyledHeaderActionBar = styled.div`
    display: flex;
    align-items: center;

    .divider {
        margin: 0 4px;
        width: 1px;
        height: 22px;
        background: hsla(0, 0%, 84.7%, 0.1);
    }
`;

const StyledIconButton = styled.span`
    margin: 0 4px;
    height: 26px;

    svg {
        width: 24px;
        height: 24px;
        cursor: pointer;
        opacity: 0.6;

        :hover {
            opacity: 0.8;
        }

        &.active {
            opacity: 1;
        }
    }
`;

export const HeaderActionBar = ({
    isMembersListActive,
    onMembersToggleClick,
    isReduced
}: {
    isMembersListActive?: boolean;
    onMembersToggleClick?: React.MouseEventHandler<HTMLSpanElement>;
    isReduced?: boolean;
}) => (
    <StyledHeaderActionBar>
        {!isReduced && (
            <>
                <TooltipWrapper content="Hilos" direction="bottom">
                    <StyledIconButton>
                        <ThreadsIcon />
                    </StyledIconButton>
                </TooltipWrapper>

                <TooltipWrapper content="Ajustes de notificaciones" direction="bottom">
                    <StyledIconButton>
                        <NotificationBellIcon />
                    </StyledIconButton>
                </TooltipWrapper>

                <TooltipWrapper content="Mensajes Fijados" direction="bottom">
                    <StyledIconButton>
                        <PinIcon />
                    </StyledIconButton>
                </TooltipWrapper>

                <TooltipWrapper content="Lista de Miembros" direction="bottom">
                    <StyledIconButton onClick={onMembersToggleClick}>
                        <PeopleIcon className={isMembersListActive ? "active" : ""} />
                    </StyledIconButton>
                </TooltipWrapper>

                <HeaderSearchBar />

                <div className="divider" />
            </>
        )}
        <TooltipWrapper content="Bandeja de Entrada" direction="bottom">
            <StyledIconButton>
                <InboxIcon />
            </StyledIconButton>
        </TooltipWrapper>
        <TooltipWrapper content="Ayuda" direction="bottom">
            <StyledIconButton>
                <QuestionMarkIcon />
            </StyledIconButton>
        </TooltipWrapper>
    </StyledHeaderActionBar>
);
