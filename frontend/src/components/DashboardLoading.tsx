import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Skeleton } from "./Skeleton"

export function DashboardLoading() {
	return (
		<div className="container mx-auto p-6">
			<Skeleton className="h-12 w-64 mb-8" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
				<StatCardSkeleton />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card className="shadow-lg bg-gray-50">
					<CardHeader className="pb-2">
						<Skeleton className="h-6 w-48" />
					</CardHeader>
					<CardContent>
						<div className="h-[300px] flex items-center justify-center">
							<Skeleton className="h-64 w-64 rounded-full" />
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-lg bg-gray-50">
					<CardHeader className="pb-2">
						<Skeleton className="h-6 w-48" />
					</CardHeader>
					<CardContent>
						<div className="h-[300px]">
							<Skeleton className="h-full w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

function StatCardSkeleton() {
	return (
		<Card className="shadow-md bg-gray-100">
			<CardHeader className="rounded-t-lg py-3">
				<CardTitle className="flex items-center justify-between">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-8 w-8 rounded-full" />
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-4">
				<Skeleton className="h-8 w-20" />
			</CardContent>
		</Card>
	)
}

