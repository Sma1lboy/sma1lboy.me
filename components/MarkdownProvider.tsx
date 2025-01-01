import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import parseMD from 'parse-md'

export const MarkdownNote = ({ children }: { children: string }) => {
  const { content } = parseMD(children)

  return (
    <Markdown
      className="prose prose-stone w-full max-w-none dark:prose-invert"
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  )
}

export default MarkdownNote
