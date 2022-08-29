import { MemberCardPopup } from "../MemberCardPopup";
import { User } from "components/discord/interface";

export const handleMemberClick = (element: React.MouseEvent<HTMLElement, MouseEvent>, member: User) => {
    const { target } = element;
    const targetRect = (target as HTMLDivElement).getBoundingClientRect();

    MemberCardPopup.show({
        direction: "left",
        position: { x: targetRect.x + 50, y: targetRect.top - 100 },
        member
    });
};
