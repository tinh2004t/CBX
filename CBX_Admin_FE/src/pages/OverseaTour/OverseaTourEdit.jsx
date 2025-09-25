import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, Trash2, Upload, Star } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import overseaTourAPI from '../../api/overseaTourAPI';
import tourDetailAPI from '../../api/tourDetailApi.js';

const EditTour = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'edit';

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tourId, setTourId] = useState(null); // Lưu ID của OverseaTour

  // State cho form data
  const [formData, setFormData] = useState({
    // Basic tour info
    image: '',
    title: '',
    departure: '',
    price: '',
    duration: '',
    airline: '',
    scheduleInfo: '',
    tourType: 'quoc-te', // Thêm trường loại tour
    continent: '',
    // Detailed tour data
    tourData: {
      title: '',
      location: '',
      duration: '',
      price: '',
      rating: 0,
      reviews: 0,
      groupSize: '',
      highlights: []
    },
    scheduleData: [],
    priceIncludes: [],
    priceExcludes: [],
    landscapeImages: [],
    foodImages: [],
    isActive: true,
    featured: false
  });

  // Load dữ liệu tour khi edit
  const loadTourData = async () => {
    if (mode === 'edit' && slug) {
      try {
        setLoading(true);
        setError(null);

        // 1. Lấy thông tin cơ bản từ OverseaTour
        const overseaTourResponse = await overseaTourAPI.getTourBySlug(slug);

        if (!overseaTourResponse.success) {
          setError('Không tìm thấy tour');
          return;
        }

        const overseaTourData = overseaTourResponse.data;
        setTourId(overseaTourData._id);

        // 2. Lấy thông tin chi tiết từ TourDetail
        let tourDetailData = null;
        try {
          const tourDetailResponse = await tourDetailAPI.getTourDetailBySlug(slug);
          if (tourDetailResponse.success) {
            tourDetailData = tourDetailResponse.data;
          }
        } catch (detailError) {
          console.log('Chưa có thông tin chi tiết cho tour này');
          // Không có detail thì tạo structure mặc định
        }

        // 3. Merge dữ liệu
        setFormData({
          // Thông tin cơ bản từ OverseaTour
          image: overseaTourData.image || '',
          title: overseaTourData.title || '',
          departure: overseaTourData.departure || '',
          price: overseaTourData.price || '',
          duration: overseaTourData.duration || '',
          airline: overseaTourData.airline || '',
          scheduleInfo: overseaTourData.scheduleInfo || '',
          continent: overseaTourData.continent || 'Châu Á',
          tourType: 'quoc-te',

          // Thông tin chi tiết từ TourDetail (nếu có)
          tourData: tourDetailData?.tourData || {
            title: overseaTourData.title || '',
            location: overseaTourData.departure || '',
            duration: overseaTourData.duration || '',
            price: overseaTourData.price || '',
            rating: 0,
            reviews: 0,
            groupSize: '',
            highlights: []
          },
          scheduleData: tourDetailData?.scheduleData || [
            {
              day: 'Ngày 1',
              title: '',
              activities: ['']
            }
          ],
          priceIncludes: tourDetailData?.priceIncludes || [''],
          priceExcludes: tourDetailData?.priceExcludes || [''],
          landscapeImages: tourDetailData?.landscapeImages || [],
          foodImages: tourDetailData?.foodImages || [],
          isActive: overseaTourData.isDeleted === false,
          featured: tourDetailData?.featured || false
        });

      } catch (err) {
        setError('Lỗi khi tải dữ liệu tour: ' + err.message);
        console.error('Error loading tour data:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Định nghĩa các tùy chọn châu lục cho tour quốc tế
  const getContinentOptions = () => {
    return [
      { value: 'Châu Á', label: 'Châu Á' },
      { value: 'Châu Âu', label: 'Châu Âu' },
      { value: 'Châu Mỹ', label: 'Châu Mỹ' },
      { value: 'Châu Phi', label: 'Châu Phi' },
      { value: 'Châu Đại Dương', label: 'Châu Đại Dương' }
    ];
  };

  // Initialize form data
  useEffect(() => {
    if (mode === 'edit') {
      loadTourData();
    } else {
      // Reset form for add mode
      setFormData({
        image: '',
        title: '',
        departure: '',
        price: '',
        duration: '',
        airline: '',
        scheduleInfo: '',
        tourType: 'quoc-te',
        continent: 'Châu Á',
        tourData: {
          title: '',
          location: '',
          duration: '',
          price: '',
          rating: 0,
          reviews: 0,
          groupSize: '',
          highlights: []
        },
        scheduleData: [
          {
            day: 'Ngày 1',
            title: '',
            activities: ['']
          }
        ],
        priceIncludes: [''],
        priceExcludes: [''],
        landscapeImages: [],
        foodImages: [],
        isActive: true,
        featured: false
      });
    }
  }, [mode, slug]);

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title || !formData.departure || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (mode === 'add') {
        // Tạo mới tour

        // 1. Tạo OverseaTour trước
        const overseaTourData = {
          title: formData.title,
          departure: formData.departure,
          price: formData.price,
          duration: formData.duration,
          airline: formData.airline,
          scheduleInfo: formData.scheduleInfo,
          continent: formData.continent,
          image: formData.image,
          isDeleted: false
        };

        const overseaTourResponse = await overseaTourAPI.createTour(overseaTourData);

        if (!overseaTourResponse.success) {
          alert('Lỗi khi tạo tour: ' + overseaTourResponse.message);
          return;
        }

        alert('Tạo tour thành công!');
        navigate('/tour-quoc-te'); // Quay về trang danh sách

      } else {
        // Cập nhật tour

        // 1. Cập nhật OverseaTour
        const overseaTourData = {
          title: formData.title,
          departure: formData.departure,
          price: formData.price,
          duration: formData.duration,
          airline: formData.airline,
          scheduleInfo: formData.scheduleInfo,
          continent: formData.continent,
          image: formData.image,
          isDeleted: !formData.isActive
        };

        await overseaTourAPI.updateTour(tourId, overseaTourData);

        // 2. Cập nhật TourDetail
        const tourDetailData = {
          tourData: formData.tourData,
          scheduleData: formData.scheduleData,
          priceIncludes: formData.priceIncludes.filter(item => item.trim()),
          priceExcludes: formData.priceExcludes.filter(item => item.trim()),
          landscapeImages: formData.landscapeImages,
          foodImages: formData.foodImages,
          featured: formData.featured
        };

        await tourDetailAPI.updateTourDetailByTourId(tourId, tourDetailData);

        alert('Cập nhật tour thành công!');
        navigate('/tour-quoc-te'); // Quay về trang danh sách
      }

    } catch (err) {
      setError('Lỗi khi lưu tour: ' + err.message);
      console.error('Error saving tour:', err);
      alert('Có lỗi xảy ra khi lưu tour: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addScheduleDay = () => {
    setFormData({
      ...formData,
      scheduleData: [
        ...formData.scheduleData,
        {
          day: `Ngày ${formData.scheduleData.length + 1}`,
          title: '',
          activities: ['']
        }
      ]
    });
  };

  const handleBack = () => {
    navigate('/tour-quoc-te');
  };

  const removeScheduleDay = (index) => {
    const newScheduleData = formData.scheduleData.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      scheduleData: newScheduleData
    });
  };

  const addActivity = (scheduleIndex) => {
    const newScheduleData = [...formData.scheduleData];
    newScheduleData[scheduleIndex].activities.push('');
    setFormData({
      ...formData,
      scheduleData: newScheduleData
    });
  };

  const removeActivity = (scheduleIndex, activityIndex) => {
    const newScheduleData = [...formData.scheduleData];
    newScheduleData[scheduleIndex].activities = newScheduleData[scheduleIndex].activities.filter((_, i) => i !== activityIndex);
    setFormData({
      ...formData,
      scheduleData: newScheduleData
    });
  };

  const addHighlight = () => {
    setFormData({
      ...formData,
      tourData: {
        ...formData.tourData,
        highlights: [...formData.tourData.highlights, '']
      }
    });
  };

  const addIncludeItem = () => {
    setFormData({
      ...formData,
      priceIncludes: [...formData.priceIncludes, '']
    });
  };

  const addExcludeItem = () => {
    setFormData({
      ...formData,
      priceExcludes: [...formData.priceExcludes, '']
    });
  };

  const continentOptions = getContinentOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {mode === 'add' ? 'Thêm Tour Nước Ngoài Mới' : 'Chỉnh sửa Tour Nước Ngoài'}
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4">
              <div className="text-center">Đang xử lý...</div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            {/* Thông tin cơ bản */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên tour *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên tour..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Điểm khởi hành *</label>
                  <input
                    type="text"
                    value={formData.departure}
                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Khởi hành từ TP.HCM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá tour *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 25.000.000 đ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Chương trình 6 ngày 5 đêm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hãng hàng không</label>
                  <input
                    type="text"
                    value={formData.airline}
                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Vietnam Airlines"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lịch khởi hành</label>
                  <input
                    type="text"
                    value={formData.scheduleInfo}
                    onChange={(e) => setFormData({ ...formData, scheduleInfo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Khởi hành cuối tuần"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Châu lục</label>
                  <select
                    value={formData.continent}
                    onChange={(e) => setFormData({ ...formData, continent: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {continentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Hình ảnh</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết tour - chỉ hiện khi edit */}
            {mode === 'edit' && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                    <input
                      type="text"
                      value={formData.tourData.location}
                      onChange={(e) => setFormData({
                        ...formData,
                        tourData: { ...formData.tourData, location: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Địa điểm chính"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian chi tiết</label>
                    <input
                      type="text"
                      value={formData.tourData.duration}
                      onChange={(e) => setFormData({
                        ...formData,
                        tourData: { ...formData.tourData, duration: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: 6 ngày 5 đêm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng người</label>
                    <input
                      type="text"
                      value={formData.tourData.groupSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        tourData: { ...formData.tourData, groupSize: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: 15-25 người"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      min="0"
                      value={formData.tourData.rating}
                      onChange={(e) => setFormData({
                        ...formData,
                        tourData: { ...formData.tourData, rating: parseFloat(e.target.value) }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Điểm nổi bật */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Điểm nổi bật</h3>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                    >
                      <Plus size={16} />
                      Thêm
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.tourData.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => {
                            const newHighlights = [...formData.tourData.highlights];
                            newHighlights[index] = e.target.value;
                            setFormData({
                              ...formData,
                              tourData: { ...formData.tourData, highlights: newHighlights }
                            });
                          }}
                          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="Điểm nổi bật..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newHighlights = formData.tourData.highlights.filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              tourData: { ...formData.tourData, highlights: newHighlights }
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lịch trình */}
            {mode === 'edit' && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Lịch trình tour</h2>
                  <button
                    type="button"
                    onClick={addScheduleDay}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    <Plus size={16} />
                    Thêm ngày
                  </button>
                </div>

                {formData.scheduleData.map((schedule, scheduleIndex) => (
                  <div key={scheduleIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input
                          type="text"
                          value={schedule.day}
                          onChange={(e) => {
                            const newScheduleData = [...formData.scheduleData];
                            newScheduleData[scheduleIndex].day = e.target.value;
                            setFormData({ ...formData, scheduleData: newScheduleData });
                          }}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="Ngày..."
                        />
                        <input
                          type="text"
                          value={schedule.title}
                          onChange={(e) => {
                            const newScheduleData = [...formData.scheduleData];
                            newScheduleData[scheduleIndex].title = e.target.value;
                            setFormData({ ...formData, scheduleData: newScheduleData });
                          }}
                          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="Tiêu đề..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScheduleDay(scheduleIndex)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Hoạt động:</h4>
                        <button
                          type="button"
                          onClick={() => addActivity(scheduleIndex)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Plus size={14} />
                          Thêm hoạt động
                        </button>
                      </div>
                      {schedule.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={(e) => {
                              const newScheduleData = [...formData.scheduleData];
                              newScheduleData[scheduleIndex].activities[activityIndex] = e.target.value;
                              setFormData({ ...formData, scheduleData: newScheduleData });
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="Hoạt động..."
                          />
                          <button
                            type="button"
                            onClick={() => removeActivity(scheduleIndex, activityIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Giá bao gồm */}
            {mode === 'edit' && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Giá bao gồm</h2>
                  <button
                    type="button"
                    onClick={addIncludeItem}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                  >
                    <Plus size={16} />
                    Thêm
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.priceIncludes.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newPriceExcludes = [...formData.priceExcludes];
                          newPriceExcludes[index] = e.target.value;
                          setFormData({ ...formData, priceExcludes: newPriceExcludes });
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Dịch vụ không bao gồm..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPriceExcludes = formData.priceExcludes.filter((_, i) => i !== index);
                          setFormData({ ...formData, priceExcludes: newPriceExcludes });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex-1 sm:flex-none"
              >
                <Save size={20} />
                {loading ? 'Đang xử lý...' : (mode === 'add' ? 'Tạo Tour' : 'Lưu thay đổi')}
              </button>
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex-1 sm:flex-none"
              >
                <X size={20} />
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTour