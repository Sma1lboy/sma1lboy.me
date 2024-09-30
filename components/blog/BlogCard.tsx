import { Card, CardHeader, CardBody } from '@nextui-org/card'

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
  console.log(slug)

  return (
    <Card
      className={
        className ? 'px-2 py-2'.concat(' ').concat(className) : 'px-2 py-2'
      }
      shadow="sm"
    >
      <CardHeader>
        <a className="hover:underline" href={`/blog/${slug}`}>
          <h3 className="prose prose-xl prose-stone">{title}</h3>
        </a>
      </CardHeader>
      <CardBody className="pt-0">
        <p>{description}</p>
      </CardBody>
    </Card>
  )
}

export default BlogCard
