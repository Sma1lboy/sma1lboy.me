import { createFileRoute } from '@tanstack/react-router';
import BrutalistHome from '@/components/brutalist/BrutalistHome';

export const Route = createFileRoute('/new')({
  component: NewPage,
});

function NewPage() {
  return <BrutalistHome />;
}
