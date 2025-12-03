import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadProps {
    label?: string;
    accept?: string;
    onChange: (file: File | null) => void;
    value?: File | null; // For controlled component if needed, though we usually handle file object locally
    error?: string;
    className?: string;
    fileName?: string; // To show name if file object is missing (e.g. from context)
}

export function FileUpload({ label, accept, onChange, value, error, className, fileName }: FileUploadProps) {
    const [preview, setPreview] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);

        if (file) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        } else {
            setPreview(null);
        }
    };

    const clearFile = () => {
        onChange(null);
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

            <div className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:bg-gray-100",
                error && "border-red-500 bg-red-50",
                (value || fileName) && "border-blue-500 bg-blue-50"
            )}>
                {(value || fileName) ? (
                    <div className="relative flex w-full flex-col items-center space-y-2">
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-32 w-auto rounded object-cover" />
                        ) : (
                            <FileText className="h-12 w-12 text-blue-500" />
                        )}
                        <p className="text-sm font-medium text-blue-700 truncate max-w-full px-4">
                            {value?.name || fileName}
                        </p>
                        <button
                            type="button"
                            onClick={clearFile}
                            className="absolute -top-4 -right-4 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
                        >
                            <X className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-xs text-gray-500">
                            <span className="font-semibold text-blue-600">クリックしてアップロード</span>
                            <br />
                            またはドラッグ＆ドロップ
                        </div>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG (最大 5MB)</p>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept={accept}
                    onChange={handleFileChange}
                />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
