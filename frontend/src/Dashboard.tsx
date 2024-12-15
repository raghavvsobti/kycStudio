/* eslint-disable react-hooks/exhaustive-deps */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './components/Card'
import { useEffect, useMemo, useState } from 'react'
import { BASE_URL } from '../constants'
import { toast } from 'sonner'
import { DashboardLoading } from './components/DashboardLoading'

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6']

export function Dashboard() {
	const [isFetched, setIsFetched] = useState<boolean>(false);
	const [stats, setStats] = useState<{
		totalApproved: number;
		totalRejected: number;
		totalPending: number;
		totalUsers: number;
	} | null>(null)

	const pieChartData = useMemo(() => [
		{ name: 'Approved', value: stats?.totalApproved },
		{ name: 'Pending', value: stats?.totalPending },
		{ name: 'Rejected', value: stats?.totalRejected },
	], [JSON.stringify(stats)]
	)
	const barChartData = useMemo(() => [
		{ name: 'Total Users', value: stats?.totalUsers },
		{ name: 'Approved', value: stats?.totalApproved },
		{ name: 'Pending', value: stats?.totalPending },
		{ name: 'Rejected', value: stats?.totalRejected },
	], [JSON.stringify(stats)])

	const fetchData = async () => {
		try {
			const response = await fetch(`${BASE_URL}/dashboard/stats`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json()

			console.log(data, "data")

			if (!response.ok) {
				toast.error(data?.msg)
				throw new Error('Network response was not ok');
			}

			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	useEffect(() => {
		const getData = async () => {
			setIsFetched(false)
			const response = await fetchData();
			if (response) {
				setStats(response?.stats)
			} else {
				toast.error(response?.msg || "something went wrong!");
			}
			setIsFetched(true)
		};

		getData();
	}, []);

	return (
		<>
			{(stats || isFetched) ? <div className="container mx-auto p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<StatCard title="Total Users" value={stats?.totalUsers || 0} color="bg-blue-100 text-blue-800" icon="👥" />
					<StatCard title="Approved KYCs" value={stats?.totalApproved || 0} color="bg-green-100 text-green-800" icon="✅" />
					<StatCard title="Pending KYCs" value={stats?.totalPending || 0} color="bg-yellow-100 text-yellow-800" icon="⏳" />
					<StatCard title="Rejected KYCs" value={stats?.totalRejected || 0} color="bg-red-100 text-red-800" icon="❌" />
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<Card className="shadow-lg">
						<CardHeader className="pb-2">
							<CardTitle className="text-xl font-semibold text-gray-700">KYC Status Distribution</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={pieChartData}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={100}
											fill="#8884d8"
											dataKey="value"
											label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
										>
											{pieChartData?.map((_, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip />
										<Legend verticalAlign="bottom" height={36} />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
					<Card className="shadow-lg">
						<CardHeader className="pb-2">
							<CardTitle className="text-xl font-semibold text-gray-700">KYC Statistics</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={barChartData}>
										<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
										<XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
										<YAxis tick={{ fill: '#6B7280' }} />
										<Tooltip
											contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
											itemStyle={{ color: '#111827' }}
										/>
										<Legend />
										<Bar dataKey="value">
											{barChartData?.map((_, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</div>
			</div> : <DashboardLoading />}
		</>

	)
}

interface StatCardProps {
	title: string
	value: number
	color: string
	icon: string
}

function StatCard({ title, value, color, icon }: StatCardProps) {
	return (
		<Card className="shadow-md">
			<CardHeader className={`${color} rounded-t-lg py-3`}>
				<CardTitle className="text-lg flex items-center justify-between">
					{title}
					<span className="text-2xl">{icon}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-4">
				<p className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
			</CardContent>
		</Card>
	)
}

