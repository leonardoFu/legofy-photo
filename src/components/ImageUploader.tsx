"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadedFile {
  file: File
  preview: string
  id: string
}

interface ImageUploaderProps {
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  currentFile?: File | null
  currentPreview?: string | null
  maxFiles?: number
  title?: string
  description?: string
  className?: string
}

export default function ImageUploader({ 
  onFileSelect,
  onFileRemove,
  currentFile,
  currentPreview,
  maxFiles = 1,
  title = "Upload Images",
  description = "Drag and drop your images here, or click to browse. Max size: 5MB per file.",
  className = ""
}: ImageUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
  const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload only image files (JPEG, PNG, GIF, WebP)"
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB"
    }
    return null
  }

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    setError(null)

    // For single file mode, only process the first file
    const filesToProcess = maxFiles === 1 ? [fileArray[0]] : fileArray

    filesToProcess.forEach((file) => {
      if (!file) return

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      // If there's a callback for file selection, use that instead of internal state
      if (onFileSelect) {
        onFileSelect(file)
        return
      }

      // For single file mode, replace the existing file
      if (maxFiles === 1) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newFile: UploadedFile = {
            file,
            preview: e.target?.result as string,
            id: Math.random().toString(36).substr(2, 9),
          }
          setUploadedFiles([newFile])
        }
        reader.readAsDataURL(file)
      } else {
        // For multiple files mode
        const reader = new FileReader()
        reader.onload = (e) => {
          const newFile: UploadedFile = {
            file,
            preview: e.target?.result as string,
            id: Math.random().toString(36).substr(2, 9),
          }
          setUploadedFiles((prev) => [...prev, newFile])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
    setError(null)
    if (onFileRemove) {
      onFileRemove()
    }
  }

  const handleRemoveCurrentFile = () => {
    setError(null)
    if (onFileRemove) {
      onFileRemove()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Use external state if provided, otherwise use internal state
  const displayFiles = currentFile ? [] : uploadedFiles
  const hasCurrentFile = !!currentFile

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex-grow flex flex-col">
        <div className="p-4 flex-grow flex flex-col">
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer flex-grow flex flex-col justify-center ${
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleClick()
              }
            }}
            aria-label="Upload files by clicking or dragging and dropping"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={maxFiles > 1}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-hidden="true"
            />

            <div className="space-y-3">
              <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium">
                  {isDragOver ? "Drop your images here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">Supports: JPEG, PNG, GIF, WebP (max 5MB each)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show current file if using external state */}
      {hasCurrentFile && currentFile && currentPreview && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-base font-semibold mb-3">Uploaded File</h3>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <div className="flex-shrink-0">
                  <img
                    src={currentPreview}
                    alt={currentFile.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentFile.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(currentFile.size)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCurrentFile}
                className="flex-shrink-0"
                aria-label={`Remove ${currentFile.name}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Show internal state files if not using external state */}
      {displayFiles.length > 0 && !hasCurrentFile && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Uploaded Files ({displayFiles.length})</h3>
            <div className="space-y-4">
              {displayFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={uploadedFile.preview || "/placeholder.svg"}
                      alt={uploadedFile.file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadedFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    className="flex-shrink-0"
                    aria-label={`Remove ${uploadedFile.file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {maxFiles > 1 && (
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full" size="lg">
                  Process {displayFiles.length} {displayFiles.length === 1 ? "Image" : "Images"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
