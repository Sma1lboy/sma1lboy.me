import { PhotoGallery } from './photoContent'
import { photoUrls } from './photoUrls'

export default function PhotoPage() {
  return (
    <div className="mx-auto p-1">
      <PhotoGallery photoPaths={photoUrls} />
    </div>
  )
}
