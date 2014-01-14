var Java = [
    {
        scope: "comment.line",
        regex: /(\/\/.*?$)/gm
    },
    {
        scope: "comment.block",
        regex: /(\/\*[\s\S]*?\*\/)/g
    },
    {
        scope: "constant.numeric",
        regex: /\b(0x[\da-fA-F]+[lL]?|0b[01]+[lL]?|[\d]+[\.]?[\d]*[eE]?[\d]*[fFdDlL]?)\b/g
    },
    {
        scope: "constant.character",
        regex: /\\b|\\t|\\n|\\f|\\r|\\"|\\'|\\\\|\\u[0-9a-fA-F]{4}/g
    },
    {
        scope: "constant.language",
        regex: /\b(true|false|null)\b/g
    },
    {
        scope: "constant.other",
        regex: /\b(A-Z)\b/g
    },
    {
        scope: "entity.name.function",
        regex: /\b[^@\.\s]+\(/g
    },
    {
        scope: "entity.name.class",
        regex: /\b[A-Z]\w*\b/g
    },
    {
        scope: "keyword.control",
        regex: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g
    },
    {
        scope: "keyword.operator",
        regex: /(&gt;|&lt;|[\+\-~!\*\/%=&^|?:]|instanceof)/g
    },
    {
        scope: "string.quoted",
        regex: /(".*?"|'.*?')/g
    },
    {
        scope: "string.regex",
        regex: /(\/.*\/[gim]*)/g
    },
    {
        scope: "support",
        regex: /(import|package)\s(.+)/g
    }
];