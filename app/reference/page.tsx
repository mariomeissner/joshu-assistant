"use client";
import Link from "next/link";
import ImageCarousel from "../components/ImageCarousel";

// Import your test images
import img1 from "@/test_images/img1_4.png";
import img2 from "@/test_images/img2_5.png";
import img3 from "@/test_images/img3_8.png";
import img4 from "@/test_images/img4_15.png";
import img5 from "@/test_images/img5_20.png";
import img6 from "@/test_images/img6_23.png";

import json1 from "@/agent/json_data_from_images/004.json";
import json2 from "@/agent/json_data_from_images/005.json";
import json3 from "@/agent/json_data_from_images/008.json";
import json4 from "@/agent/json_data_from_images/015.json";
import json5 from "@/agent/json_data_from_images/020.json";
import json6 from "@/agent/json_data_from_images/023.json";
import { useEffect, useState } from "react";

export default function ReferencePage() {
  const jsonArray = [json1, json2, json3, json4, json5, json6];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState(jsonArray[currentIndex]);

  useEffect(() => {
    setData(jsonArray[currentIndex]);
  }, [currentIndex, jsonArray]);

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
          Reference Data
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <p className="text-lg font-semibold text-gray-600 mb-4">
            Screenshots of the past employee activities
          </p>
          <ImageCarousel
            images={[img1, img2, img3, img4, img5, img6]}
            onIndexChange={handleOnIndexChange}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">
            JSON data extracted from the screenshots
          </h2>
          <pre className="text-sm text-gray-600 overflow-x-scroll">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
