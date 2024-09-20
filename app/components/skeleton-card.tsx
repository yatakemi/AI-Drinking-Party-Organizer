import { Skeleton } from '~/components/ui/skeleton'

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-6 items-center">
      <Skeleton className="h-[125px] w-full max-w-2xl rounded-xl" />
      <div className="space-y-2 w-full max-w-2xl">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
