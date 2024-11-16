import Link from "next/link";
import ImageCarousel from "../components/ImageCarousel";

// Import your test images
import s0 from "@/test_images/s0.png";
import s1 from "@/test_images/s1.png";
import s2 from "@/test_images/s2.png";
import s3 from "@/test_images/s3.png";
import s4 from "@/test_images/s4.png";
import s5 from "@/test_images/s5.png";
import s20 from "@/test_images/s20.png";

export default function ReferencePage() {
  const data = '{ "test": "test" }';
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-purple-600 hover:text-purple-800">
            ← Back to Chat
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-purple-800">
          Reference Data
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <p className="text-lg font-semibold text-gray-600 mb-4">
            Screenshots of the past employee activities
          </p>
          <ImageCarousel images={[s0, s1, s2, s3, s4, s5, s20]} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            JSON data extracted from the screenshots
          </h2>
          <pre className="text-sm text-gray-600">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
