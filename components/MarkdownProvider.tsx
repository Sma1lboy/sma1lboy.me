import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const MarkdownNote = ({ children }: { children: string }) => {
  return (
    <Markdown
      className="prose prose-stone flex flex-col justify-center dark:prose-invert"
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </Markdown>
  )
}

export default MarkdownNote
