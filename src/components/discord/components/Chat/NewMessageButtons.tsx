import { GiftIcon, GiftPickerIcon } from '../../icons';
import styled from 'styled-components';
import { EmojiPickerButton } from '.';
import { colors } from '../../utils';

const StyledButtonsBar = styled.div`
    display: flex;
    padding-right: 6px;
`;

const ButtonContainer = styled.div<{ $outerWidth: number; $iconWidth: number; $iconHeight: number }>`
    background: 0;
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props => props.$outerWidth}px;
    height: 35px;
    flex: 0 0 auto;

    > div {
        width: ${props => props.$iconWidth}px;
        height: ${props => props.$iconHeight}px;
        color: ${colors.icon};
        transition: all 0.2s ease;
    }

    :hover > div {
        color: ${colors.iconHover};
        width: ${props => props.$iconWidth + 2}px;
        height: ${props => props.$iconHeight + 2}px;
    }

    svg {
        width: 100%;
        height: 100%;
    }
`;

export const NewMessageButtons = ({ isReduced }: { isReduced?: boolean }) => (
    <StyledButtonsBar>
        {!isReduced && (
            <>
                <ButtonContainer $outerWidth={34} $iconWidth={20} $iconHeight={20}>
                    <div>
                        <GiftIcon />
                    </div>
                </ButtonContainer>

                <ButtonContainer $outerWidth={40} $iconWidth={24} $iconHeight={18}>
                    <div>
                        <GiftPickerIcon />
                    </div>
                </ButtonContainer>
            </>
        )}

        <EmojiPickerButton />
    </StyledButtonsBar>
);
