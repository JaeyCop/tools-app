import Link from "next/link";
import {
  GitMerge,
  Scissors,
  FileImage,
  Archive,
  Move,
  FileText,
  RefreshCw,
  Eraser,
} from "lucide-react";

// This data can be moved to a separate file later for better organization
const toolCategories = [
  {
    name: "PDF Tools",
    description: "Manipulate and convert your PDF files with ease.",
    tools: [
      { href: "/pdf/merge", label: "Merge PDFs", icon: GitMerge, description: "Combine multiple PDFs into one." },
      { href: "/pdf/split", label: "Split PDF", icon: Scissors, description: "Extract pages from a PDF." },
      { href: "/pdf/compress", label: "Compress PDF", icon: Archive, description: "Reduce the file size of your PDF." },
      { href: "/pdf/to-images", label: "PDF to Images", icon: FileImage, description: "Convert PDF pages to images." },
    ],
  },
  {
    name: "Image Tools",
    description: "Resize, convert, and edit your images in seconds.",
    tools: [
      { href: "/image/resize", label: "Resize Image", icon: Move, description: "Change the dimensions of your image." },
      { href: "/image/convert", label: "Convert Format", icon: RefreshCw, description: "Convert images to JPG, PNG, etc." },
      { href: "/image/compress", label: "Compress Image", icon: Archive, description: "Reduce image file size." },
      { href: "/image/to-pdf", label: "Images to PDF", icon: FileText, description: "Convert multiple images into a single PDF." },
    ],
  },
];

export default function HomePage() {
  return (
    <main className="space-y-12 py-6 md:py-8">
      {/* Hero Section */}
      <section className="text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your All-in-One File Processing Suite
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Quickly merge PDFs, resize images, and more. All processing is done in your browser for maximum privacy and speed.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>No Upload Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      {toolCategories.map((category) => (
        <section key={category.name} className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{category.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{category.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.tools.map((tool) => (
              <Link
                href={tool.href}
                key={tool.href}
                className="group block p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <tool.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}