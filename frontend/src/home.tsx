/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUniversalState } from "./context/stateProvider";
import { TypingAnimation } from "./components/TypingAnimation";
import { BASE_URL } from "../constants";
import { KYCStatus } from "./components/KycStatus";
import { toast } from "sonner";
import { KYCUserList } from "./components/UsersList";

function Home() {
  const [file, setFile] = useState<File | null>();
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const { user, setUser, setUrl } = useUniversalState()

  useEffect(() => {
    if (!localStorage.getItem("data")) {
      navigate("/login")
    }
  }, [])

  useEffect(() => {
    const data = localStorage.getItem("data");
    if (!user && data) {
      setUser(JSON.parse(data))
    }
  }, [user])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);

    if (!file && !e.target.files[0]) {
      alert('Please select a PDF file to upload');
      setIsUploading(false);
      return;
    }

    // formData.append('userId', user?._id || JSON.parse(localStorage.getItem('data')!)?._id);

    try {
      const { name, email } = user;
      const formData = new FormData();
      formData.append('file', file || e.target.files[0]);
      formData.append('kycData', JSON.stringify({ name, email }));
      const response = await fetch(`${BASE_URL}/kyc/kycform/${user?.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          // 'Content-Type': 'application/json',
        },
      });


      if (response) {
        const data = await response.json();
        if (data.msg) {
          toast.success(data.msg)
        }
        setUploadStatus(`File uploaded successfully! File ID: ${data.url}`);
        setUser(data?.user);
        // localStorage.setItem("data", JSON.stringify(data?.user))
        setUrl(data?.url)
        // navigate(`/pdf?url=${data?.url}`)
      } else {
        setUploadStatus('File upload failed. Please try again.');
      }
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file.');
    }
  };

  useEffect(() => {
    if (uploadStatus && !isUploading) {
      // show toast
    }
  }, [uploadStatus, isUploading])


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true)
      setFile(e.target.files[0]);
      setTimeout(() => {
        handleSubmit(e)
      }, 1000);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsUploading(true)
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
      setTimeout(() => {
        handleSubmit(e)
      }, 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      {user && user?.role !== "admin" && user?.kycData?.fileUrl !== undefined &&
        <div className="mt-16">
          <KYCStatus {...{ status: user?.kycStatus, "userName": user?.name }} />
        </div>
      }

      {user?.role !== "admin" && user?.kycData?.fileUrl === undefined && <div className="flex flex-col w-full h-full pt-24 overflow-clip">
        <div className="w-full flex flex-col justify-center items-center">
          <TypingAnimation text="Complete your KYC Registration!" />
          <p className="text-center mb-3">Secure document sharing..</p>
        </div>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50/40 transition-colors"
          onClick={handleButtonClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-sm text-gray-500">
            {file ? `Selected file: ${file.name}` : "Drag and drop a file here, or click to select a file"}
          </p>
          <button
            disabled={isUploading}
            className="mt-4 disabled:cursor-not-allowed inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            type="button"
          >
            {isUploading ? "Uploading..." : "Select & Upload"}
          </button>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>
      }

      {user?.role === "admin" && <>
        <KYCUserList />
      </>}
    </>
  )
}

export default Home