/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUniversalState } from "../context/stateProvider";
import { BASE_URL } from "../../constants";
import AnimatedGradientText from "./AnimatedGradientText";
import { toast } from "sonner";

const Signup = () => {
	const { pathname } = useLocation();
	const [loginMode, setLoginMode] = useState<boolean>(pathname === "/login");
	const [email, setEmail] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [autoLogin, setAutoLogin] = useState<boolean>(false);
	const { setUser, setIsLoggedIn, isLoggedIn } = useUniversalState()

	const navigate = useNavigate()

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/")
		}
	}, [isLoggedIn])


	useEffect(() => {
		if (autoLogin) {
			submitHandler();
		}

		return () => {
			setAutoLogin(false)
		}
	}, [autoLogin])

	const submitHandler = async (e?: any) => {
		e?.preventDefault();

		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);

		try {
			const response = await fetch(loginMode ? `${BASE_URL}/auth/login` : `${BASE_URL}/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					email: email?.trim()?.toString(),
					password: password?.toString(),
					...(!loginMode && { name: name?.toString() })
				}),
			});

			// Check if the response is in the correct format before parsing
			if (response?.ok) {
				if (!loginMode) {
					setTimeout(() => {
						setAutoLogin(true)
					}, 100);
					setLoginMode(true)
					return;
				}
				const data = await response?.json();
				if (data?.token) {
					localStorage.setItem("token", data?.token);
					localStorage.setItem("user", data?.user?.email);
					localStorage.setItem("pdfs", data?.user?.pdfs);
					localStorage.setItem("colorIndex", data?.user?.colorIndex);
					localStorage.setItem("userId", data.user?._id);
					localStorage.setItem("data", JSON.stringify(data.user));
					setUser(data.user);
					setIsLoggedIn(true);
					toast.success("Logged in successfully!")
					if (data?.user?.role === "admin") {
						navigate("/dashboard")
					} else {
						navigate("/");
					}
				}
			} else {
				// Handle cases where the response is not OK
				const error = await response.json();
				console.error("Error response: ", error);
				toast.error(`${error?.msg}!`)
			}
		} catch (error) {
			console.error("Error: ", error);
		}
	};


	return (
		<div className="flex font-merriweather justify-center items-center w-full h-[80vh]">
			<div className="w-full max-w-lg">
				<div className=" w-full rounded-lg mb-2 p-4 flex justify-center">
					<AnimatedGradientText>kycstudio</AnimatedGradientText>
				</div>
				<form
					onSubmit={submitHandler}
					className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
				>
					{!loginMode && <div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="name"
						>
							name
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="name"
							type="text"
							placeholder="name"
							value={name}
							name="name"
							onChange={(e) => setName(e.target.value)}
						/>
					</div>}
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							type="text"
							placeholder="email"
							value={email}
							name="email"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							id="password2"
							type="password"
							placeholder="Password"
							value={password}
							name="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
							onClick={(e) => {
								submitHandler(e)
							}}
						>
							{loginMode ? "Sign In" : "Sign Up"}
						</button>
					</div>
				</form>
				<div className="flex justify-center">
					<button
						type="button"
						onClick={() => {
							setLoginMode((prev) => !prev);
						}}
						className="inline-block align-baseline hover:underline font-bold text-sm text-gray-500 hover:text-gray-800"
					>
						{!loginMode ? "Already have an account? Sign in!" : "Don't have an account? Sign up!"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Signup;
