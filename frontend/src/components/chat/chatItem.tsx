import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext"; 
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";



/**
 Helper function to convert simple inline markdown elements into
 JSX elements for rendering within a single line of plain text.
 */
function formatInlineText(text: string): React.ReactNode[] {
    // Regex to match bold (**text**) and italics (*text*)
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        } else if (part.startsWith('*') && part.endsWith('*')) {
            // Italic text
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        // Plain text
        return part;
    });
}

/**
 * Helper function to process block-level rich markdown (headings, rules, lists)
 * and render them correctly using Material UI Typography elements.
 */
function formatTextWithRichMarkdown(text: string): React.ReactNode[] {
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        // Skip lines that are empty after trimming
        if (trimmedLine === '') return;

        let node = null;
        let lineContent = trimmedLine;

        // 1. Horizontal Rule (---)
        if (lineContent === '---') {
            node = (
                <Box key={index} sx={{ borderBottom: '1px solid #ffffff30', my: 2, width: '100%' }} />
            );
        }
        // 2. Headings (###)
        else if (lineContent.startsWith('###')) {
            // Updated regex to remove prefix plus optional space
            lineContent = lineContent.replace(/^###\s*/, '');
            node = (
                <Typography 
                    key={index} 
                    sx={{ 
                        fontSize: "24px", 
                        fontWeight: 700, 
                        mt: 0, 
                        mb: 1, 
                        color: "white" 
                    }}
                >
                    {/* Apply inline formatting to the heading content */}
                    {formatInlineText(lineContent)}
                </Typography>
            );
        }
        // 3. Headings (##)
        else if (lineContent.startsWith('##')) {
            // Updated regex to remove prefix plus optional space(s)
            lineContent = lineContent.replace(/^##\s*/, '');
            node = (
                <Typography 
                    key={index} 
                    sx={{ 
                        fontSize: "28px", 
                        fontWeight: 700, 
                        mt: 0, 
                        mb: 1, 
                        color: "white" 
                    }}
                >
                    {formatInlineText(lineContent)}
                </Typography>
            );
        }
        // 4. Headings (#)
        else if (lineContent.startsWith('#')) {
            // Updated regex to remove prefix plus optional space
            lineContent = lineContent.replace(/^#\s*/, '');
            node = (
                <Typography 
                    key={index} 
                    sx={{ 
                        fontSize: "32px", 
                        fontWeight: 700, 
                        mt: 0, 
                        mb: 1, 
                        color: "white" 
                    }}
                >
                    {formatInlineText(lineContent)}
                </Typography>
            );
        }
        // 5. Unordered List Items (* or -)
        else if (lineContent.match(/^(\*|\-)\s/)) {
            lineContent = lineContent.replace(/^(\*|\-)\s*/, '');
            node = (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', ml: 2, my: 0.5 }}>
                    <Typography component="span" sx={{ fontSize: "20px", mr: 1, color: "white", mt: 0 }}>
                        •
                    </Typography>
                    <Typography component="span" sx={{ fontSize: "20px", whiteSpace: "pre-wrap", color: "white", mt: 0 }}>
                        {formatInlineText(lineContent)}
                    </Typography>
                </Box>
            );
        }
        // 6. Plain Text / Paragraphs (Applying inline markdown here)
        else {
            node = (
                // and minimal margin (0.5) for subsequent lines in the block.
                <Typography key={index} sx={{ 
                    fontSize: "20px", 
                    whiteSpace: "pre-wrap", 
                    mt: index === 0 ? 0 : 0.5, 
                    mb: 0.5 
                }}>
                    {formatInlineText(lineContent)}
                </Typography>
            );
        }

        if (node) {
            nodes.push(node);
        }
    });

    return nodes;
}



function extractCodeFromString(message: string): (string | { code: string; lang: string })[] {
    const blocks: (string | { code: string; lang: string })[] = [];
    const parts = message.split("```");

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i % 2 === 1) { // This is a code block
            const lines = part.trim().split('\n');
            const lang = lines[0].trim();
            const code = lines.slice(1).join('\n').trim();
            blocks.push({ code, lang: lang || 'javascript' }); // Default to javascript if no lang specified
        } else if (part.trim().length > 0) { // This is regular text
            blocks.push(part);
        }
    }
    return blocks;
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();
  
  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start", 
        p: 2,
        bgcolor: "#004d5612",
        gap: 2,
        borderRadius: 2,
        my: 1,
        wordWrap: "break-word",
        overflowWrap: "break-word",
    }}
     >
      <Avatar sx={{ ml: "0" }}>
        
        <img 
            src="gemini.png" 
            alt="gemini_img" 
            width="30px" 
        />
      </Avatar>
     <Box sx={{ flex: 1, minWidth: 0 }}>
       {messageBlocks.length > 0 ? (
         messageBlocks.map((block, index) =>
           typeof block === 'string' ? (
             
               <React.Fragment key={index}>
             
                {formatTextWithRichMarkdown(block)}
              </React.Fragment>
            ) : (
              <SyntaxHighlighter key={index} style={coldarkDark} language={block.lang}>
                {block.code}
              </SyntaxHighlighter>
            )
          )
        ) : (
          <React.Fragment>
            {formatTextWithRichMarkdown(content)}
          </React.Fragment>
        )}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start", 
        p: 2,
        bgcolor: "#004d56",
        gap: 2,
        borderRadius: 2,
        wordWrap: "break-word",
        overflowWrap: "break-word",
        my: 1,
      }}
     >
      {/* User Avatar */}
       <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
       {auth?.user?.name[0]}{auth?.user?.name.split(" ")[1]?.[0]} 
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {formatTextWithRichMarkdown(content)}
      </Box>
    </Box>
  );
};

export default ChatItem;
