"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/**
 * Minimal Markdown renderer with:
 * - GitHub-flavored markdown (tables, task lists, fenced code, etc.)
 * - Syntax highlighting for code blocks
 * - Tailwind prose styling
 */
export default function Markdown({ children, className = "" }) {
  return (
    <div className={`prose prose-neutral max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({node, inline, className, children, ...props}) {
            // keep default highlighting but make sure Tailwind doesn't shrink
            return (
              <code
                className={`${className || ""} rounded-md`}
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
