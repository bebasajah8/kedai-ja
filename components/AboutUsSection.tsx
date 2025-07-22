'use client';

import { useEffect, useState } from 'react';
import { ChefHat, Users, Award, Clock } from 'lucide-react';

interface AboutUsData {
  title: string;
  subtitle: string;
  description: string;
  secondDescription: string;
  yearsOfExperience: number;
  masterChefs: number;
  images: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
  };
}

export default function AboutUsSection() {
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      setAboutUs(data.aboutUs || {
        title: 'About Us',
        subtitle: 'Welcome to Kedai J.A',
        description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern. Kami berkomitmen untuk menyajikan hidangan berkualitas tinggi dengan bahan-bahan segar pilihan.',
        secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan. Setiap hidangan dibuat dengan penuh cinta dan keahlian oleh chef berpengalaman kami.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          image1: '',
          image2: '',
          image3: '',
          image4: ''
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about us:', error);
      setAboutUs({
        title: 'About Us',
        subtitle: 'Welcome to Kedai J.A',
        description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
        secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          image1: '',
          image2: '',
          image3: '',
          image4: ''
        }
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat informasi tentang kami...</p>
      </div>
    );
  }

  if (!aboutUs) return null;

  const images = [
    aboutUs.images.image1,
    aboutUs.images.image2,
    aboutUs.images.image3,
    aboutUs.images.image4
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Side - Images Grid */}
      <div className="grid grid-cols-2 gap-4">
        {images.length > 0 ? (
          <>
            {/* Large image - top left */}
            <div className="col-span-1 row-span-2">
              <div className="h-80 rounded-lg overflow-hidden shadow-lg">
                {images[0] ? (
                  <img
                    src={images[0]}
                    alt="About us 1"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-white opacity-80" />
                  </div>
                )}
              </div>
            </div>

            {/* Top right image */}
            <div className="col-span-1">
              <div className="h-38 rounded-lg overflow-hidden shadow-lg">
                {images[1] ? (
                  <img
                    src={images[1]}
                    alt="About us 2"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white opacity-80" />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom right image */}
            <div className="col-span-1">
              <div className="h-38 rounded-lg overflow-hidden shadow-lg">
                {images[2] ? (
                  <img
                    src={images[2]}
                    alt="About us 3"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                    <Award className="h-12 w-12 text-white opacity-80" />
                  </div>
                )}
              </div>
            </div>

            {/* Additional image if available */}
            {images[3] && (
              <div className="col-span-2 mt-4">
                <div className="h-32 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={images[3]}
                    alt="About us 4"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          // Default placeholder images when no images are uploaded
          <>
            <div className="col-span-1 row-span-2">
              <div className="h-80 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                <ChefHat className="h-16 w-16 text-white opacity-80" />
              </div>
            </div>
            <div className="col-span-1">
              <div className="h-38 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                <Users className="h-12 w-12 text-white opacity-80" />
              </div>
            </div>
            <div className="col-span-1">
              <div className="h-38 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                <Award className="h-12 w-12 text-white opacity-80" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Side - Content */}
      <div className="space-y-6">
        {/* Title Section */}
        <div>
          <p className="text-orange-500 font-semibold text-lg mb-2 italic">
            {aboutUs.title}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {aboutUs.subtitle}
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {aboutUs.description}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {aboutUs.secondDescription}
          </p>
        </div>

        {/* Statistics */}
        <div className="flex items-center space-x-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="text-4xl font-bold text-orange-500 border-l-4 border-orange-500 pl-4">
              {aboutUs.yearsOfExperience}
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Years of</p>
              <p className="font-semibold text-gray-900 uppercase tracking-wide">EXPERIENCE</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-4xl font-bold text-orange-500 border-l-4 border-orange-500 pl-4">
              {aboutUs.masterChefs}
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Popular</p>
              <p className="font-semibold text-gray-900 uppercase tracking-wide">MASTER CHEFS</p>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <div>
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 uppercase tracking-wide">
            READ MORE
          </button>
        </div>
      </div>
    </div>
  );
}