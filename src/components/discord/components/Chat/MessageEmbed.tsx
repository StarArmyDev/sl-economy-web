import { Col, Container, Row } from 'react-bootstrap';
import type { Embed } from '../../interface';
import styled from 'styled-components';
import React from 'react';

import { parseMarkdown } from '@app/helpers';

const StyledMessagesEmbed = styled.div`
    .container > * {
        justify-self: start;
        align-self: start;
    }

    .grid {
        grid-template-columns: auto min-content;
        overflow: hidden;
        padding: 0.5rem 1rem 1rem 0rem;
        display: inline-grid;
    }

    .embed {
        position: relative;
        display: grid;
        max-width: 520px;
        box-sizing: border-box;
        border-radius: 4px;
    }

    .embedFull {
        border-left: 4px solid #202225;
        background: #2f3136;
    }

    .embedFull .embedMedia {
        margin-top: 16px;
    }

    .embedMargin {
        margin-top: 8px;
    }

    .embedAuthorName,
    .embedAuthorNameLink,
    .embedDescription,
    .embedFieldName,
    .embedFieldValue,
    .embedFooterText,
    .embedLink-1TLNja,
    .embedProvider,
    .embedTitle,
    .embedTitleLink- {
        unicode-bidi: -moz-plaintext;
        unicode-bidi: plaintext;
        text-align: left;
    }

    .embedAuthor {
        display: -webkit-box;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        grid-column: 1/1;
    }

    .embedAuthorIcon {
        margin-right: 8px;
        width: 24px;
        height: 24px;
        object-fit: contain;
        border-radius: 50%;
    }

    .embedAuthorName {
        font-size: 0.875rem;
        font-weight: 600;
    }

    .embedTitle {
        font-size: 1rem;
        font-weight: 600;
        display: inline-block;
        grid-column: 1/1;
    }

    .embedDescription {
        font-size: 0.875rem;
        line-height: 1.125rem;
        font-weight: 400;
        white-space: pre-line;
        grid-column: 1/1;
    }

    .embedFields {
        display: grid;
        grid-column: 1/1;
        margin-top: 8px;
        grid-gap: 8px;
    }

    .embedField,
    .embedFieldName {
        font-size: 0.875rem;
        line-height: 1.125rem;
        min-width: 0;
    }

    .embedField {
        font-weight: 400;
    }

    .embedFieldName {
        font-weight: 600;
        margin-bottom: 2px;
    }

    .embedFieldValue {
        font-size: 0.875rem;
        line-height: 1.125rem;
        font-weight: 400;
        white-space: pre-line;
        min-width: 0;
    }

    .hasThumbnail .embedFooter {
        grid-column: 1/3;
    }

    .embedAuthor,
    .embedDescription,
    .embedFields,
    .embedFooter,
    .embedMedia,
    .embedProvider,
    .embedTitle {
        min-width: 0;
    }

    .embedFooter {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        grid-row: auto/auto;
        grid-column: 1/1;
    }

    .embedFooterIcon {
        margin-right: 8px;
        width: 20px;
        height: 20px;
        object-fit: contain;
        border-radius: 50%;
    }

    .embedFooterText {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 500;
        color: var(--text-normal);
    }

    .embedImage,
    .embedThumbnail,
    .embedVideo {
        display: block;
        object-fit: fill;
    }

    .embedThumbnail {
        grid-row: 1/8;
        grid-column: 2/2;
        margin-left: 16px;
        margin-top: 8px;
        flex-shrink: 0;
        justify-self: end;
    }

    .embedMedia {
        grid-column: 1/1;
        border-radius: 4px;
        contain: paint;
    }

    .imageWrapper {
        position: relative;
        user-select: text;
        overflow: hidden;
        border-radius: 3px;
    }

    .clickableWrapper {
        width: 100%;
    }
`;

const createMessageEmbed = (embed: Embed) => (
    <React.Fragment key={embed.title || '0'}>
        <Container
            className="embed embedFull embedWrapper container"
            style={{ borderColor: embed.color }}
            key={embed.title?.substring(0, 5) || embed.author?.name?.substring(0, 5)}>
            <Container className="grid" key={embed.title?.substring(0, 5) || embed.author?.name?.substring(0, 5)}>
                <Col className="embedAuthor embedMargin">
                    {embed.author?.iconUrl && <img className="embedAuthorIcon" src={embed.author.iconUrl} alt={embed.author?.name} />}
                    {embed.author?.name && <span className="embedAuthorName">{embed.author.name}</span>}
                </Col>
                <Row className="embedTitle embedMargin">{embed.title && <span>{embed.title}</span>}</Row>
                <Row className="embedDescription embedMargin">
                    {embed.description && (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: parseMarkdown(embed.description),
                            }}
                        />
                    )}
                </Row>
                <Row className="embedFields embedMargin">
                    {embed.fields?.map((field, index) => (
                        <Col
                            key={`f_${index}`}
                            className="embedField"
                            style={
                                field.inline
                                    ? {
                                          gridColumn: index % 3 === 0 ? '1/5' : index % 3 === 2 ? '9/13' : '5/9',
                                      }
                                    : { gridColumn: '1/3' }
                            }>
                            <Row className="embedFieldName">
                                <strong>{field.name}</strong>
                            </Row>
                            <Row className="embedFieldValue">
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: parseMarkdown(field.value),
                                    }}
                                />
                            </Row>
                        </Col>
                    ))}
                </Row>
                <Col className="embedThumbnail imageWrapper">
                    {embed.thumbnail && (
                        <>
                            <Col className="clickableWrapper" role="button" onClick={() => openImage(embed.thumbnail!)}>
                                <img alt="Imagen" src={embed.thumbnail} style={{ width: '80px', height: '80px' }} />
                            </Col>
                        </>
                    )}
                </Col>
                <Col className="imageWrapper embedImage embedMedia">
                    {embed.image && (
                        <>
                            <Col className="clickableWrapper" role="button" onClick={() => openImage(embed.image!)}>
                                <img alt="ImagenWrapper" src={embed.image} style={{ width: '256px', height: '256px' }} />
                            </Col>
                        </>
                    )}
                </Col>
                <Col className="embedFooter embedMargin">
                    {embed.footer?.iconUrl && <img className="embedFooterIcon" alt="" src={embed.footer.iconUrl} />}
                    {embed.footer?.text && <span className="embedFooterText">{embed.footer?.text}</span>}
                </Col>
            </Container>
        </Container>
    </React.Fragment>
);

const openImage = (url: string) => {
    window.open(url, '_blank');
};

export const MessagesEmbed = ({ embeds }: { embeds: Embed[] }) => {
    const embedsElements: JSX.Element[] = [];

    for (const embed of embeds) {
        embedsElements.push(createMessageEmbed(embed));
    }

    return <StyledMessagesEmbed>{embedsElements}</StyledMessagesEmbed>;
};
