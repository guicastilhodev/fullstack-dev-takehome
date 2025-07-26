"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, File, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        onFileSelect(file)

        setUploadProgress(0)
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              return 100
            }
            return prev + 10
          })
        }, 100)
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  const removeFile = () => {
    onFileSelect(null)
    setUploadProgress(0)
  }

  if (selectedFile) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <File className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
      )}
    >
      <input {...getInputProps()} />
      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg font-medium mb-2">{isDragActive ? "Drop the file here" : "Drag & drop a file here"}</p>
      <p className="text-sm text-muted-foreground mb-4">or click to select a file</p>
      <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG (max 5MB)</p>
    </Card>
  )
}
