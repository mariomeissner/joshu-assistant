"use client";
import Link from "next/link";
import ImageCarousel from "../components/ImageCarousel";

// // Import your test images
import img1 from "@/agent/final_images/output_01_trim.jpg";
import img2 from "@/agent/final_images/output_04_trim.jpg";
import img3 from "@/agent/final_images/output_07_trim.jpg";
import img4 from "@/agent/final_images/output_10_trim.jpg";

import json1 from "@/agent/json_data_from_images/01.json";
import json2 from "@/agent/json_data_from_images/04.json";
import json3 from "@/agent/json_data_from_images/07.json";
import json4 from "@/agent/json_data_from_images/10.json";
const jsonArray = [json1, json2, json3, json4];

import { useEffect, useState } from "react";

export default function ReferencePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState(jsonArray[currentIndex]);

  useEffect(() => {
    setData(jsonArray[currentIndex]);
  }, [currentIndex]);

  const handleOnIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-purple-600 hover:text-purple-800">
            ← Back to Chat
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-purple-800">
          Joshu&apos;s Knowledge
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <p className="text-lg font-semibold text-gray-600 mb-4">
            Screenshots of the past employee activities
          </p>
          <ImageCarousel
            images={[img1, img2, img3, img4]}
            onIndexChange={handleOnIndexChange}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            Extracted Data
          </h2>
          <pre className="text-sm text-gray-600 overflow-x-scroll">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
