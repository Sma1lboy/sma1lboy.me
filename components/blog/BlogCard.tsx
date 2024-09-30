import { Card, CardHeader, CardBody } from '@nextui-org/card'

interface BlogCardProps {
  title: string
  description: string
  date?: string
  className?: string
}

export const BlogCard = ({
  title,
  description,
  date,
  className,
}: BlogCardProps) => {
  return (
    <Card
      shadow="sm"
      className={
        className ? 'px-2 py-2'.concat(' ').concat(className) : 'px-2 py-2'
      }
    >
      <CardHeader>
        <a href={'https://blog.sma1lboy.me/' + title.split(' ').join('-')}>
          <h3>{title}</h3>
        </a>
      </CardHeader>
      <CardBody className="pt-0">
        <p>{description}</p>
      </CardBody>
    </Card>
  )
}

export default BlogCard
