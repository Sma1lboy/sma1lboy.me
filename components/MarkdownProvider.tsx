import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const MarkdownNote = ({ children }) => {
  return (
    <Markdown
      className="prose prose-stone dark:prose-invert"
      components={{
        img: props => {
          return props.src?.startsWith('./assets') ? (
            <img
              alt={props.alt}
              src={'./blog.sma1lboy.me/' + props.src.substring(2)}
            />
          ) : (
            <img alt={props.alt} src={props.src} />
          )
        },
      }}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </Markdown>
  )
}

export default MarkdownNote
