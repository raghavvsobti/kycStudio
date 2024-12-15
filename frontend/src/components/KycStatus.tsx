import { Card, CardContent, CardHeader, CardTitle } from "./Card";

interface KYCStatusProps {
	status: 'pending' | 'approved' | 'rejected';
	userName: string;
}

export function KYCStatus({ status, userName }: KYCStatusProps) {
	const statusConfig = {
		pending: {
			title: 'KYC Under Process',
			description: 'Your KYC registration is currently being reviewed.',
			color: 'text-yellow-700',
			bgColor: 'bg-yellow-50',
			borderColor: 'border-yellow-200',
			image: (
				<svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M12 6V12L16 14" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)
		},
		approved: {
			title: 'KYC Approved',
			description: 'Congratulations! Your KYC has been successfully verified.',
			color: 'text-green-700',
			bgColor: 'bg-green-50',
			borderColor: 'border-green-200',
			image: (
				<svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M22 4L12 14.01L9 11.01" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)
		},
		rejected: {
			title: 'KYC Rejected',
			description: `We're sorry, but your KYC application has been rejected. Please contact support for more information.`,
			color: 'text-red-700',
			bgColor: 'bg-red-50',
			borderColor: 'border-red-200',
			image: (
				<svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M15 9L9 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M9 9L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			)
		}
	};

	const { title, description, color, bgColor, borderColor, image } = statusConfig[status];

	return (
		<Card className={`${bgColor} ${borderColor} border-2`}>
			<CardHeader>
				<CardTitle className={`${color} text-2xl font-bold`}>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col md:flex-row items-center gap-6">
					<div className="flex-shrink-0">
						{image}
					</div>
					<div className="text-center md:text-left">
						<p className={`${color} text-lg font-semibold mb-2`}>Hello, {userName}</p>
						<p className={`${color} text-base`}>{description}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

