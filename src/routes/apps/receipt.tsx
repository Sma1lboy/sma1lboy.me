import Receipt from '@/components/apps/receipt/Receipt'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/receipt')({
  component: ReceiptApp,
})

function ReceiptApp() {
  return <Receipt />
}
