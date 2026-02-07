import { ButtonComponent, ButtonStyle } from '../../interface';
import styled from 'styled-components';

const StyledButtonComponent = styled.div`
    .componentButton {
        width: auto;
        height: 32px;

        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        border-radius: 3px;
        font-size: 14px;
        padding: 2px 16px;
        background-color: ${(props: { style: ButtonStyle }) => backgroundColors[props.style]};
        width: auto;
        color: #fff;
        margin: 4px 8px 4px 0;
        transition: background-color 0.17s ease, color 0.17s ease;
    }

    .componentButton:hover {
        background-color: ${(props: { style: ButtonStyle }) => backgroundColorsHover[props.style]};
    }

    .componentButton:active {
        background-color: ${(props: { style: ButtonStyle }) => backgroundColorsActive[props.style]};
    }

    .componentButton:disabled {
        background-color: ${(props: { style: ButtonStyle }) => backgroundColorsDisabled[props.style]};
    }

    .contentButton {
        width: auto;
        min-width: 25px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 10px;
    }

    .launchIcon {
        margin-left: 8px;
    }

    .textEmoji {
        font-size: 18px;
        flex-shrink: 0;
        margin-right: 4px;
        object-fit: contain;
        width: 1.375em;
        height: 1.375em;
        vertical-align: bottom;
    }
`;

export const ButtonCmp = ({ data }: { data: ButtonComponent }) => {
    return (
        <StyledButtonComponent style={data.style}>
            <button
                className="componentButton"
                type="button"
                onClick={() => (data.url && data.url.length > 12 ? window.open(data.url, '_blank') : null)}>
                <div className="contentButton" aria-hidden="false">
                    {data.emoji && <span className="textEmoji">{data.emoji}</span>}
                    <span>{data.label}</span>
                    {data.style === ButtonStyle.Link && (
                        <svg className="launchIcon" aria-hidden="false" width="16" height="16" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z"></path>
                            <path
                                fill="currentColor"
                                d="M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z"></path>
                        </svg>
                    )}
                </div>
            </button>
        </StyledButtonComponent>
    );
};

const backgroundColors = {
    1: 'hsl(235,calc(1*85.6%),64.7%)', // Primary
    2: '#4f545c', // Secondary
    3: 'hsl(139,calc(1*47.1%),33.33%)', // Success
    4: 'hsl(359,calc(1*66.7%),54.1%)', // Danger
    5: '#4f545c', // Link
};

const backgroundColorsHover = {
    1: 'hsl(235,calc(1*85.7%),69.8%)', // Primary -> --brand-experiment-430
    2: '#686d73', // Secondary
    3: 'hsl(138,calc(1*46.8%),24.3%)', // Success
    4: 'hsl(359,calc(1*56.3%),40.4%)', // Danger
    5: '#686d73', // Link
};

const backgroundColorsActive = {
    1: 'hsl(235,calc(1*86.1%),71.8%)', // Primary -> --brand-experiment-400
    2: '#72767d', // Secondary
    3: 'hsl(138,calc(1*46.9%),22.2%)', // Success
    4: 'hsl(359,calc(1*56.4%),35.1%)',
    5: '#72767d',
};

const backgroundColorsDisabled = {
    1: 'hsl(235,calc(1*85.6%),64.7%)', // Primary
    2: '#4f545c', // Secondary
    3: 'hsl(139,calc(1*47.1%),33.3%)', // Success
    4: 'hsl(359,calc(1*66.7%),54.1%)', // Danger
    5: '#4f545c', // Link
};
