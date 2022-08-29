export const parseMarkdown = (text: string) =>
    text
        .replace(/`(.*)`/gim, "<code style='color: #dcddde;'>$1</code>")
        .replace(/\*{2}(.*)\*{2}/gim, "<b>$1</b>")
        .replace(/\*{1}(.*)\*{1}/gim, "<i>$1</i>")
        .replace(/_{2}(.*)_{2}/gim, "<b>$1</b>")
        .replace(/_{1}(.*)_{1}/gim, "<i>$1</i>")

        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/\n$/gim, "<br />")
        .trim();
