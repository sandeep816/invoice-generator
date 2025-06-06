"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface LogoUploadProps {
  onLogoChange: (logoUrl: string | null) => void
  currentLogo: string | null
}

export function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      e.target.value = "" // Clear the input
      return
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB")
      e.target.value = "" // Clear the input
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setPreviewUrl(result)
      onLogoChange(result)
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setPreviewUrl(null)
    onLogoChange(null)
  }

  return (
    <div className="space-y-4 overflow-hidden">
      <Label>Company Logo</Label>

      {previewUrl ? (
        <div className="relative w-full h-32 border rounded-md overflow-hidden">
          <img src={previewUrl || "/placeholder.svg"} alt="Company logo" className="w-full h-full object-contain p-2" />
          <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={removeLogo}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400">SVG, PNG, JPG (max. 2MB)</p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}
