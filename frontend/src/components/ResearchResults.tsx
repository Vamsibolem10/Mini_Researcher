"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface ResearchResultsProps {
  result: string;
}

export function ResearchResults({ result }: ResearchResultsProps) {
  const renderSources = () => {
    const sourcesSection = result.split("# Sources")[1];
    if (!sourcesSection) return null;

    const sourceLines = sourcesSection
      .split("\n")
      .filter((line) => line.trim().startsWith("- ["));

    return (
      <div className="mt-8 pt-6 border-t border-border">
        <h2 className="text-2xl font-semibold mb-4">Sources</h2>
        <ul className="space-y-2">
          {sourceLines.map((line, index) => {
            const titleMatch = line.match(/\[(.*?)\]/);
            const urlMatch = line.match(/\((.*?)\)/);

            if (titleMatch && urlMatch) {
              const title = titleMatch[1];
              const url = urlMatch[1];

              return (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center text-xs font-medium h-5 w-5 rounded-full bg-primary/10 text-primary mr-2">
                    {index + 1}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                  >
                    {title}
                  </a>
                </li>
              );
            }

            return null;
          })}
        </ul>
      </div>
    );
  };

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No research results yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Submit a research query to see results here. The research assistant will analyze your query and provide comprehensive findings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Research Results</h2>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 overflow-auto max-h-[calc(100vh-250px)]">
        <article
          className="prose prose-blue max-w-none dark:prose-invert
            prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h1:pb-2 prose-h1:border-b prose-h1:border-border
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:pb-1
            prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6
            prose-p:my-4 prose-p:leading-relaxed prose-p:text-base
            prose-ul:my-4 prose-ul:pl-6 prose-ul:list-disc
            prose-ol:my-4 prose-ol:pl-6 prose-ol:list-decimal
            prose-li:my-2 prose-li:pl-1
            prose-a:font-medium prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80 prose-a:transition-colors
            prose-code:bg-secondary/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-secondary/50 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-auto
            prose-img:rounded-md prose-img:my-8 prose-img:mx-auto prose-img:shadow-sm
            prose-hr:my-8 prose-hr:border-border
            prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-table:overflow-hidden prose-table:rounded-md prose-table:shadow-sm
            prose-thead:bg-secondary/50
            prose-th:border prose-th:border-border prose-th:p-3 prose-th:text-left
            prose-td:border prose-td:border-border prose-td:p-3
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
            [&>table]:overflow-x-auto [&>table]:block [&>table]:w-full [&>table]:whitespace-nowrap"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: (props) => {
                const isCitation =
                  props.children &&
                  Array.isArray(props.children) &&
                  props.children.length > 0 &&
                  typeof props.children[0] === "string" &&
                  /^\[\d+\]$/.test(props.children[0]);

                if (isCitation) {
                  return (
                    <a
                      {...props}
                      className="inline-flex items-center justify-center text-xs font-medium h-5 px-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 no-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {props.children}
                    </a>
                  );
                }

                return (
                  <a
                    {...props}
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                );
              },
            }}
          >
            {result}
          </ReactMarkdown>

          {result.includes("# Sources") && renderSources()}
        </article>
      </div>
    </div>
  );
}
