import { PhotoGallery } from './photoContent'

import { PhotoUtils } from '@/utils/photoUtils'

export default async function PhotoPage() {
  const photoPaths = await PhotoUtils.getAllPhotoPaths('./public/photos')

  return <PhotoGallery photoPaths={photoPaths} />
}
