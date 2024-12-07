import { Previews } from "./Previews";
import { cn } from "../../utils/cn";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = (props) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);

  const uploadFiles = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    const totalFiles = files.length;
    let uploadedFiles = 0;

    for (const file of files) {
      try {
        await uploadFile(file);
        uploadedFiles++;
        setUploadProgress((uploadedFiles / totalFiles) * 100);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("error");
        return;
      }
    }

    setIsUploading(false);
    setUploadStatus("success");
    setFiles([]);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8080/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        setFiles((prevFiles) => {
          const newFiles = acceptedFiles.filter((file) => {
            return !prevFiles.some((prevFile) => prevFile.name === file.name);
          });

          return [
            ...prevFiles,
            ...newFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            ),
          ];
        });
      },
    });

  return (
    <div className="group overflow-y-hidden my-4">
      {/* button to reset files list */}
      <button
        type="button"
        className="my-4 ml-auto block rounded border border-red-500 p-1 text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
        onClick={() => setFiles([])}
      >
        Reset
      </button>
      <div
        className={cn(
          "dropzone-area",
          {
            "border-blue-400": isFocused,
          },
          {
            "border-green-400": isDragAccept,
          },
          {
            "border-red-400": isDragReject,
          }
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <svg
          className="h-12 w-12"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M12 12v9" />
          <path d="m16 16-4-4-4 4" />
        </svg>
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </div>
      {/* Use the Previews component */}
      <Previews files={files} setFiles={setFiles} />{" "}
      {files.length > 0 && (
        <div className="">
          <button
            onClick={uploadFiles}
            disabled={isUploading}
            className={cn(
              "flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                Upload Files
              </>
            )}
          </button>
          {isUploading && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          {uploadStatus === "success" && (
            <p className="mt-2 text-green-500">Files uploaded successfully!</p>
          )}
          {uploadStatus === "error" && (
            <p className="mt-2 text-red-500">
              Error uploading files. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
