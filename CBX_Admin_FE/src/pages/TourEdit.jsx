import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, Trash2, Upload, Star } from 'lucide-react';

const EditTour = ({ tourData, onBack, onSave, mode = 'edit' }) => {
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
    tourType: 'noi-dia', // Thêm trường loại tour
    region: '',
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

  // Định nghĩa các tùy chọn khu vực theo loại tour
  const getRegionOptions = (tourType) => {
    switch (tourType) {
      case 'noi-dia':
        return [
          { value: 'Miền Bắc', label: 'Miền Bắc' },
          { value: 'Miền Trung', label: 'Miền Trung' },
          { value: 'Miền Nam', label: 'Miền Nam' }
        ];
      case 'quoc-te':
        return [
          { value: 'Châu Âu', label: 'Châu Âu' },
          { value: 'Châu Á', label: 'Châu Á' },
          { value: 'Châu Phi', label: 'Châu Phi' },
          { value: 'Châu Mỹ', label: 'Châu Mỹ' }
        ];
      case 'mice':
        return [];
      default:
        return [];
    }
  };

  // Handle tour type change
  const handleTourTypeChange = (newTourType) => {
    const regionOptions = getRegionOptions(newTourType);
    setFormData({
      ...formData,
      tourType: newTourType,
      region: regionOptions.length > 0 ? regionOptions[0].value : ''
    });
  };

  // Initialize form data
  useEffect(() => {
    if (mode === 'edit' && tourData) {
      // Load existing tour data
      const detailData = {
        "_id": "68be823b58807f7a9ac1c4ca",
        "slug": tourData.slug,
        "tourData": {
          "title": tourData.title,
          "location": tourData.departure,
          "duration": "3 ngày 2 đêm",
          "price": "3.500.000 đ",
          "rating": 4.5,
          "reviews": 120,
          "groupSize": "10-30 người",
          "highlights": ["Thăm Nhà thờ Lớn", "Khám phá phố cổ", "Thưởng thức ẩm thực địa phương"]
        },
        "scheduleData": [
          {
            "day": "Ngày 1",
            "title": "Khởi hành",
            "activities": [
              "Tập trung và khởi hành",
              "Di chuyển đến điểm đến",
              "Nhận phòng và nghỉ ngơi"
            ]
          },
          {
            "day": "Ngày 2",
            "title": "Tham quan",
            "activities": [
              "Thăm Nhà thờ Lớn",
              "Dạo bộ phố cổ",
              "Thưởng thức ẩm thực"
            ]
          },
          {
            "day": "Ngày 3",
            "title": "Kết thúc chuyến đi",
            "activities": [
              "Check-out khách sạn",
              "Mua sắm quà lưu niệm",
              "Về lại điểm xuất phát"
            ]
          }
        ],
        "priceIncludes": [
          "Xe ô tô đời mới, máy lạnh",
          "Khách sạn tiêu chuẩn",
          "Các bữa ăn theo chương trình",
          "Vé tham quan theo chương trình",
          "Hướng dẫn viên kinh nghiệm",
          "Bảo hiểm du lịch"
        ],
        "priceExcludes": [
          "Chi phí cá nhân",
          "Đồ uống có cồn",
          "Tip cho hướng dẫn viên và tài xế",
          "Chi phí phát sinh ngoài chương trình"
        ],
        "landscapeImages": [],
        "foodImages": [],
        "isActive": true,
        "featured": false
      };

      setFormData({
        ...tourData,
        ...detailData,
        tourType: tourData.tourType || 'noi-dia'
      });
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
        tourType: 'noi-dia',
        region: 'Miền Bắc',
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
  }, [tourData, mode]);

  const handleSave = () => {
    // Validate required fields
    if (!formData.title || !formData.departure || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    console.log('Saving tour data:', formData);
    if (onSave) {
      onSave(formData);
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

  const regionOptions = getRegionOptions(formData.tourType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {mode === 'add' ? 'Thêm Tour Mới' : 'Chỉnh sửa Tour'}
          </h1>
        </div>

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
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, departure: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Hà Nội"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá tour *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 3.500.000 đ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Chương trình 3 ngày 2 đêm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương tiện</label>
                  <input
                    type="text"
                    value={formData.airline}
                    onChange={(e) => setFormData({...formData, airline: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Xe du lịch"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lịch khởi hành</label>
                  <input
                    type="text"
                    value={formData.scheduleInfo}
                    onChange={(e) => setFormData({...formData, scheduleInfo: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Cuối tuần"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại tour *</label>
                  <select
                    value={formData.tourType}
                    onChange={(e) => handleTourTypeChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="noi-dia">Tour Nội địa</option>
                    <option value="quoc-te">Tour Quốc tế</option>
                    <option value="mice">Tour MICE</option>
                  </select>
                </div>
                {formData.tourType !== 'mice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {regionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Hình ảnh</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Kích hoạt</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">Nổi bật</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết tour */}
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
                      tourData: {...formData.tourData, location: e.target.value}
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
                      tourData: {...formData.tourData, duration: e.target.value}
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 3 ngày 2 đêm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng người</label>
                  <input
                    type="text"
                    value={formData.tourData.groupSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      tourData: {...formData.tourData, groupSize: e.target.value}
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 10-30 người"
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
                      tourData: {...formData.tourData, rating: parseFloat(e.target.value)}
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
                            tourData: {...formData.tourData, highlights: newHighlights}
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
                            tourData: {...formData.tourData, highlights: newHighlights}
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

            {/* Lịch trình */}
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
                          setFormData({...formData, scheduleData: newScheduleData});
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
                          setFormData({...formData, scheduleData: newScheduleData});
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
                            setFormData({...formData, scheduleData: newScheduleData});
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

            {/* Giá bao gồm */}
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
                        const newPriceIncludes = [...formData.priceIncludes];
                        newPriceIncludes[index] = e.target.value;
                        setFormData({...formData, priceIncludes: newPriceIncludes});
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Dịch vụ bao gồm..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPriceIncludes = formData.priceIncludes.filter((_, i) => i !== index);
                        setFormData({...formData, priceIncludes: newPriceIncludes});
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Giá không bao gồm */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Giá không bao gồm</h2>
                <button
                  type="button"
                  onClick={addExcludeItem}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                >
                  <Plus size={16} />
                  Thêm
                </button>
              </div>
              <div className="space-y-2">
                {formData.priceExcludes.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newPriceExcludes = [...formData.priceExcludes];
                        newPriceExcludes[index] = e.target.value;
                        setFormData({...formData, priceExcludes: newPriceExcludes});
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="Dịch vụ không bao gồm..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPriceExcludes = formData.priceExcludes.filter((_, i) => i !== index);
                        setFormData({...formData, priceExcludes: newPriceExcludes});
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex-1 sm:flex-none"
              >
                <Save size={20} />
                {mode === 'add' ? 'Tạo Tour' : 'Lưu thay đổi'}
              </button>
              <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex-1 sm:flex-none"
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