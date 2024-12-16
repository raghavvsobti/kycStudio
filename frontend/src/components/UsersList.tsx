

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BASE_URL } from '../../constants'
import { Badge } from './Badge'
import { Button } from './Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './Dialog'
import { Label } from './Label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table'

interface KYCData {
	name: string;
	email: string;
	password: string;
	fileUrl: string;
}

interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: 'admin' | 'user'; // Enum-like role, can expand if needed
	kycData: KYCData;
	kycStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'pending' | 'approved' | 'rejected'; // Enum-like status
	createdAt: string; // ISO string for date
	updatedAt: string; // ISO string for date
}


type Status = "approved" | "pending" | "rejected"

export function KYCUserList() {
	const [selectedUser, setSelectedUser] = useState<User | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [users, setUsers] = useState([]);

	const handleStatusUpdate = async (newStatus: Status) => {
		if (selectedUser) {
			await changeStatus(selectedUser, newStatus)
			setIsModalOpen(false)
			setSelectedUser(null)
		}
	}

	const openModal = (user: User) => {
		setSelectedUser(user)
		setIsModalOpen(true)
	}

	useEffect(() => {
		(async () => {
			const res = await fetchData();
			setUsers(res);
		})()
	}, [])


	const changeStatus = async (user: User, status: Status) => {
		try {
			const response = await fetch(`${BASE_URL}/kyc/update/kycstatus/${user?.id}`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					status
				})
			});

			const data = await response.json()

			if (!response.ok) {
				toast.error(data?.msg)
				throw new Error('Network response was not ok');
			} else {
				toast.success(data?.msg)
			}

			fetchData();

		} catch (error) {
			console.log(error);
			return null;
		}
	}

	const fetchData = async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/users`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json()

			if (!response.ok) {
				toast.error(data?.msg)
				throw new Error('Network response was not ok');
			}

			const res = data?.sort((a: User, b: User) => {
				if (a.kycStatus?.toLowerCase() === "pending" && b.kycStatus?.toLowerCase() !== "pending") {
					return -1; // a comes before b
				}
				if (b.kycStatus?.toLowerCase() === "pending" && a.kycStatus?.toLowerCase() !== "pending") {
					return 1; // b comes before a
				}
				return a.kycStatus?.toLowerCase().localeCompare(b.kycStatus?.toLowerCase());
			})
			setUsers(res);

			return res;
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	useEffect(() => {
		fnBrowserDetect()

	}, [])

	const [browser, setBrowser] = useState<string>("")

	const fnBrowserDetect = () => {
		const userAgent = navigator.userAgent;
		let browserName;
		if (userAgent.match(/chrome|chromium|crios/i)) {
			browserName = "chrome";
		} else if (userAgent.match(/firefox|fxios/i)) {
			browserName = "firefox";
		} else if (userAgent.match(/safari/i)) {
			browserName = "safari";
		} else if (userAgent.match(/opr\//i)) {
			browserName = "opera";
		} else if (userAgent.match(/edg/i)) {
			browserName = "edge";
		} else {
			browserName = "No browser detection";
		}
		setBrowser(browserName);
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-8 font-comfortaa w-full text-center text-gray-700">Review Users</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users?.map((user: User) => (
						<TableRow key={user.id}>
							<TableCell className="font-medium">{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								<Badge
									variant={user.kycStatus?.toLowerCase() === 'approved' ? 'outline' : user.kycStatus?.toLowerCase() === 'pending' ? 'secondary' : 'destructive'}
								>
									{user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)?.toUpperCase()}
								</Badge>
							</TableCell>
							<TableCell>
								{user.kycStatus?.toLowerCase() !== 'approved' && (
									<Button className='bg-gray-600 text-white' variant="secondary" onClick={() => openModal(user)}>Review KYC</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-5xl h-[calc(100vh-10rem)] bg-gray-100">
					<DialogHeader>
						<DialogTitle>Review KYC Document</DialogTitle>
						<DialogDescription>
							Review the KYC document for {selectedUser?.name}
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Label htmlFor="kyc-document" className="text-right">
							KYC Document
						</Label>
						<div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
							<div className="bg-gray-100 h-[calc(100vh-30rem)] flex items-center justify-center text-gray-500">
								{/* PDF Viewer Placeholder */}
								<div className="w-full h-full flex justify-center items-center z-0 opacity-0 md:opacity-100">
									{
										<div className="w-full relative h-full">
											<div className="w-full h-full absolute md:z-10 z-0">
												{/* for firefox amd safari */}
												<object
													data={selectedUser?.kycData?.fileUrl} type="application/pdf" height="100%" width="100%" className={`${browser === "chrome" && "hidden"} rounded-md md:w-full md:h-full md:z-10 z-0 overflow-hidden`}>
												</object>
												{/* for chrome */}
												<iframe title="unique"
													src={`https://docs.google.com/viewerng/viewer?url=${selectedUser?.kycData?.fileUrl}&embedded=true`} height="100%" width="100%" className={`${browser !== "chrome" && "hidden"} md:z-20 md:absolute rounded-md w-full md:h-full block z-0`} >
												</iframe>
											</div>
											<div className='flex h-full w-full items-center justify-center'>
												<p className="font-bold text-sm text-gray-700">Loading...</p>
											</div>
										</div>
									}
								</div>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => handleStatusUpdate('rejected')}>
							Reject
						</Button>
						<Button onClick={() => handleStatusUpdate('approved')}>
							Approve
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div >
	)
}

