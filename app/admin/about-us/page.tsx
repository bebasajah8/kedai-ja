'use client';

import { useEffect, useState } from 'react';
import { Save, AlertCircle, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

interface AboutUsData {
  title: string;
  subtitle: string;
  description: string;
  secondDescription: string;
  companyDescription: string;
  yearsOfExperience: number;
  masterChefs: number;
  images: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    lingkunganKedai: string[];
    spotTempatDuduk: string[];
  };
}

export default function AdminAboutUs() {
  const [aboutUs, setAboutUs] = useState<AboutUsData>({
    title: '',
    subtitle: '',
    description: '',
    secondDescription: '',
    companyDescription: '',
    yearsOfExperience: 0,
    masterChefs: 0,
    images: {
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      lingkunganKedai: [],
      spotTempatDuduk: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'company'>('basic');
  const [imageFiles, setImageFiles] = useState<{[key: string]: File | null}>({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    lingkunganKedai: null,
    spotTempatDuduk: null
  });

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
        description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
        secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan.',
        companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          image1: '',
          image2: '',
          image3: '',
          image4: '',
          lingkunganKedai: [],
          spotTempatDuduk: []
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about us:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Convert image files to base64 if they exist
      const updatedImages = { ...aboutUs.images };
      
      for (const [key, file] of Object.entries(imageFiles)) {
        if (file && !key.includes('lingkunganKedai') && !key.includes('spotTempatDuduk')) {
          const reader = new FileReader();
          const filePromise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          });
          reader.readAsDataURL(file);
          updatedImages[key as keyof typeof updatedImages] = await filePromise;
        }
      }

      const response = await fetch('/api/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...aboutUs,
          images: updatedImages
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Data tentang kami berhasil disimpan');
      setImageFiles({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        lingkunganKedai: null,
        spotTempatDuduk: null
      });
      
      // Update local state with new data
      setAboutUs(data.aboutUs);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AboutUsData, value: string | number) => {
    setAboutUs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (imageKey: string, file: File | null) => {
    setImageFiles(prev => ({
      ...prev,
      [imageKey]: file
    }));
  };

  const removeImage = (imageKey: string) => {
    if (imageKey.includes('lingkunganKedai') || imageKey.includes('spotTempatDuduk')) {
      const [category, indexStr] = imageKey.split('-');
      const index = parseInt(indexStr);
      setAboutUs(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [category]: prev.images[category as keyof typeof prev.images].filter((_, i) => i !== index)
        }
      }));
    } else {
      setAboutUs(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [imageKey]: ''
        }
      }));
    }
    setImageFiles(prev => ({
      ...prev,
      [imageKey]: null
    }));
  };

  const addGalleryImage = async (category: 'lingkunganKedai' | 'spotTempatDuduk', file: File) => {
    try {
      const reader = new FileReader();
      const filePromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Image = await filePromise;

      setAboutUs(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [category]: [...prev.images[category], base64Image]
        }
      }));
    } catch (error) {
      setError('Gagal menambahkan gambar');
    }
  };
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data tentang kami...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Tentang Kami</h1>
        <p className="text-gray-600 mt-2">Kelola konten, gambar, dan galeri untuk bagian tentang kami</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informasi Dasar
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'company'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informasi Tentang Kami
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === 'basic' && (
          <>
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Dasar</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={aboutUs.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjudul
                  </label>
                  <input
                    type="text"
                    value={aboutUs.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Pertama
                  </label>
                  <textarea
                    value={aboutUs.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Kedua
                  </label>
                  <textarea
                    value={aboutUs.secondDescription}
                    onChange={(e) => handleInputChange('secondDescription', e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun Pengalaman
                    </label>
                    <input
                      type="number"
                      value={aboutUs.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', Number(e.target.value))}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Master Chef
                    </label>
                    <input
                      type="number"
                      value={aboutUs.masterChefs}
                      onChange={(e) => handleInputChange('masterChefs', Number(e.target.value))}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gambar Tentang Kami (Homepage)</h2>
              <p className="text-gray-600 mb-6">Upload 4 gambar untuk ditampilkan di bagian tentang kami di homepage</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((num) => {
                  const imageKey = `image${num}`;
                  const currentImage = aboutUs.images[imageKey as keyof typeof aboutUs.images];
                  const selectedFile = imageFiles[imageKey];
                  
                  return (
                    <div key={imageKey} className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Gambar {num}
                      </label>
                      
                      {/* Current Image or Preview */}
                      {(currentImage || selectedFile) && (
                        <div className="relative">
                          <img
                            src={selectedFile ? URL.createObjectURL(selectedFile) : currentImage}
                            alt={`About us ${num}`}
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(imageKey)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      
                      {/* Upload Input */}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Klik untuk upload</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG atau JPEG</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleImageChange(imageKey, file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'company' && (
          <>
            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Perusahaan</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Perusahaan (untuk halaman /about)
                  </label>
                  <textarea
                    value={aboutUs.companyDescription}
                    onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                    required
                    rows={8}
                    placeholder="Masukkan deskripsi lengkap tentang perusahaan..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Deskripsi ini akan ditampilkan di halaman "Tentang Kami" (/about)
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Galeri Gambar</h2>
              <p className="text-gray-600 mb-6">Upload gambar untuk galeri di halaman "Tentang Kami"</p>
              
              {/* Lingkungan Kedai Gallery */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Galeri Lingkungan Kedai</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {aboutUs.images.lingkunganKedai.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Lingkungan Kedai ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(`lingkunganKedai-${index}`)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Tambah gambar lingkungan kedai</span>
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          addGalleryImage('lingkunganKedai', file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Spot Tempat Duduk Gallery */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Galeri Spot Tempat Duduk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {aboutUs.images.spotTempatDuduk.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Spot Tempat Duduk ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(`spotTempatDuduk-${index}`)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Tambah gambar spot tempat duduk</span>
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          addGalleryImage('spotTempatDuduk', file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}