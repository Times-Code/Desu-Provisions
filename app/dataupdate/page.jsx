import SubmissionButton from './Modal'
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Submission Management</h1>
      <SubmissionButton />
      <Toaster />
    </main>
  )
}

