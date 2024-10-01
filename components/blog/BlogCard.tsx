import { Card, CardHeader, CardBody } from '@nextui-org/card'
import { formatDistanceToNow } from 'date-fns'
interface BlogCardProps {
  title: string
  description: string
  date?: string
  className?: string
  slug: string
}

export const BlogCard = ({
  title,
  description,
  date,
  className,
  slug,
}: BlogCardProps) => {
  const formattedDate = date ? formatRelativeDate(date) : ''

  return (
    <Card className={`px-2 py-2 ${className || ''}`} shadow="sm">
      <CardHeader className="flex items-center justify-between">
        <a className="hover:underline" href={`/blog/${slug}`}>
          <h3 className="prose prose-xl prose-stone">{title}</h3>
        </a>
        {date && <span className="text-sm text-gray-500">{formattedDate}</span>}
      </CardHeader>
      <CardBody className="pt-0">
        <p>{description}</p>
      </CardBody>
    </Card>
  )
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffInDays < 5) {
    return formatDistanceToNow(date, { addSuffix: true })
  } else {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}

export default BlogCard
