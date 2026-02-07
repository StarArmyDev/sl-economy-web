import styled, { keyframes } from 'styled-components';
import { useEffect, useRef } from 'react';
import type { User } from '../../interface';
import { MemberCard } from '.';

const fadeInAnimation = ({ $direction }: { $direction?: string }) => keyframes`
  from {
    opacity: 0;
    transform: translateX(
      ${{ left: '15%', right: '-15%' }[$direction || 'left']}
    );
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StyledMemberCardPopupWrapper = styled.div<{ $position: { x: number; y: number }; $direction: string }>`
    position: absolute;
    overflow: hidden;
    border-radius: 5px;
    box-shadow:
        0 2px 10px 0 rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(32, 34, 37, 0.6);
    z-index: 1000;

    top: ${props => props.$position.y}px;
    left: ${props => props.$position.x}px;

    animation: ${() => fadeInAnimation} ease-in 0.1s forwards;
`;

export const MemberCardPopupWrapper = ({
    direction,
    position,
    member,
    onClose,
}: {
    direction: string;
    position: { x: number; y: number };
    member: User;
    onClose: () => void;
}) => {
    const node = useRef(null);

    const handleDocumentClick = (e: any) => {
        if ((node.current as any).contains(e.target)) {
            return;
        }

        onClose();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentClick, false);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick, false);
        };
    });

    return (
        <StyledMemberCardPopupWrapper ref={node} $direction={direction} $position={position}>
            <MemberCard member={member} />
        </StyledMemberCardPopupWrapper>
    );
};
