import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus, Trash2, Upload, Star } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'; // Thêm để lấy params
import tourDetailAPI from '../../api/tourDetailApi.js';
import tourAPI from '../../api/tourApi.js';

const EditTour = () => { // Bỏ tourData prop, lấy từ URL params
  const { slug } = useParams(); // Lấy slug từ URL params
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'edit';

  // Thêm loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tourId, setTourId] = useState(null); // Lưu ID của DomesticTour

  // State cho form data
  const [formData, setFormData] = useState({
    // Base fields (chung cho tất cả tour)
    slug: '',
    title: '',
    image: '',
    duration: '',
    price: '',
    rating: 0,
    reviews: 0,
    tourType: 'domestic', // 'mice', 'domestic', 'oversea'

    // MICE specific fields
    location: '',
    category: 'meeting',
    groupSize: '',
    services: [],
    facilities: [],

    // Domestic specific fields  
    departure: '',
    scheduleInfo: '',
    region: 'Miền Bắc',
    transportation: 'bus',

    // Oversea specific fields
    airline: '',
    continent: 'Châu Á',
    visa: 'required',
    countries: [],

    // Status fields
    isDeleted: false,

    // Chi tiết tour (giữ nguyên như cũ)
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
    featured: false
  });

  const TOUR_TYPES = [
    { value: 'mice', label: 'MICE Tour' },
    { value: 'domestic', label: 'Tour Nội Địa' },
    { value: 'oversea', label: 'Tour Quốc Tế' }
  ];

  const MICE_CATEGORIES = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'incentive', label: 'Incentive' },
    { value: 'conference', label: 'Conference' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'teambuilding', label: 'Teambuilding' },
    { value: 'workshop', label: 'Workshop' }
  ];

  const TRANSPORTATION_TYPES = [
    { value: 'bus', label: 'Xe buýt' },
    { value: 'train', label: 'Tàu hỏa' },
    { value: 'plane', label: 'Máy bay' },
    { value: 'car', label: 'Xe hơi' }
  ];

  const VISA_TYPES = [
    { value: 'required', label: 'Cần visa' },
    { value: 'not_required', label: 'Không cần visa' },
    { value: 'visa_on_arrival', label: 'Visa khi đến' }
  ];


  // Load dữ liệu tour khi edit
  const loadTourData = async () => {
    if (mode === 'edit' && slug) {
      try {
        setLoading(true);
        setError(null);

        // 1. Lấy thông tin cơ bản từ Tour API (unified)
        const tourResponse = await tourAPI.getTourBySlug(slug);

        if (!tourResponse.success) {
          setError('Không tìm thấy tour');
          return;
        }

        const tourData = tourResponse.data;
        const theId = tourData._id || tourData.id || tourData.tourId;
        console.log("Tour loaded:", tourData);
        console.log("TourId resolved:", theId);
        setTourId(theId);;


        // 2. Lấy thông tin chi tiết từ TourDetail
        let tourDetailData = null;
        try {
          const tourDetailResponse = await tourDetailAPI.getTourDetailBySlug(slug);
          if (tourDetailResponse.success) {
            tourDetailData = tourDetailResponse.data;

          }
        } catch (detailError) {
          console.log('Chưa có thông tin chi tiết cho tour này');
        }

        // 3. Merge dữ liệu theo model mới
        const baseFormData = {
          // Base fields (chung cho tất cả tour)
          title: tourData.title || '',
          image: tourData.image || '',
          duration: tourData.duration || '',
          price: tourData.price || '',
          rating: tourData.rating || 0,
          reviews: tourData.reviews || 0,
          tourType: tourData.tourType || 'domestic',
          isDeleted: tourData.isDeleted || false,

          // Initialize empty arrays/objects
          services: [],
          facilities: [],
          countries: [],

          // TourDetail data
          tourData: tourDetailData?.tourData || {
            title: tourData.title || '',
            location: '',
            duration: tourData.duration || '',
            price: tourData.price || '',
            rating: tourData.rating || 0,
            reviews: tourData.reviews || 0,
            groupSize: '',
            highlights: []
          },
          scheduleData: tourDetailData?.scheduleData || [{
            day: 'Ngày 1',
            title: '',
            activities: ['']
          }],
          priceIncludes: tourDetailData?.priceIncludes || [''],
          priceExcludes: tourDetailData?.priceExcludes || [''],
          landscapeImages: tourDetailData?.landscapeImages || [],
          foodImages: tourDetailData?.foodImages || [],
          featured: tourDetailData?.featured || false
        };

        // 4. Thêm fields specific theo tourType
        if (tourData.tourType === 'mice') {
          Object.assign(baseFormData, {
            location: tourData.location || '',
            category: tourData.category || 'meeting',
            groupSize: tourData.groupSize || '',
            services: tourData.services || [],
            facilities: tourData.facilities || []
          });
        } else if (tourData.tourType === 'domestic') {
          Object.assign(baseFormData, {
            departure: tourData.departure || '',
            scheduleInfo: tourData.scheduleInfo || '',
            region: tourData.region || 'Miền Bắc',
            transportation: tourData.transportation || 'bus'
          });
        } else if (tourData.tourType === 'oversea') {
          Object.assign(baseFormData, {
            departure: tourData.departure || '',
            airline: tourData.airline || '',
            scheduleInfo: tourData.scheduleInfo || '',
            continent: tourData.continent || 'Châu Á',
            visa: tourData.visa || 'required',
            countries: tourData.countries || []
          });
        }

        setFormData(baseFormData);

      } catch (err) {
        setError('Lỗi khi tải dữ liệu tour: ' + err.message);
        console.error('Error loading tour data:', err);
      } finally {
        setLoading(false);
      }
    }
  };

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
    setFormData(prev => ({
      ...prev,
      tourType: newTourType,
      // Reset fields specific cho loại tour khác
      location: newTourType === 'mice' ? prev.location : '',
      category: newTourType === 'mice' ? prev.category : 'meeting',
      departure: ['domestic', 'oversea'].includes(newTourType) ? prev.departure : '',
      region: newTourType === 'domestic' ? prev.region : 'Miền Bắc',
      continent: newTourType === 'oversea' ? prev.continent : 'Châu Á',
      airline: newTourType === 'oversea' ? prev.airline : '',
      visa: newTourType === 'oversea' ? prev.visa : 'required'
    }));
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
  }, [mode, slug]);

  const handleSave = async () => {
    // Validate theo từng loại tour
    const baseRequired = ['title', 'image', 'duration', 'price'];
    let specificRequired = [];

    switch (formData.tourType) {
      case 'mice':
        specificRequired = ['location'];
        break;
      case 'domestic':
        specificRequired = ['departure', 'region', 'scheduleInfo'];
        break;
      case 'oversea':
        specificRequired = ['departure', 'airline', 'continent', 'scheduleInfo'];
        break;
    }

    const allRequired = [...baseRequired, ...specificRequired];

    // Kiểm tra required fields
    for (let field of allRequired) {
      if (!formData[field]?.toString().trim()) {
        alert(`Vui lòng nhập ${field}`);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Chuẩn bị data cho Tour API
      const tourData = {
        title: formData.title,
        image: formData.image,
        duration: formData.duration,
        price: formData.price,
        rating: formData.rating || 0,
        reviews: formData.reviews || 0,
        tourType: formData.tourType
      };

      // Thêm fields specific theo tourType
      // Thay đổi phần này trong handleSave:
      if (formData.tourType === 'mice') {
        Object.assign(tourData, {
          location: formData.location,
          category: formData.category,
          groupSize: formData.groupSize,
          services: (formData.services || []).filter(s => s?.trim()), // Thêm || [] và optional chaining
          facilities: (formData.facilities || []).filter(f => f?.trim())
        });
      } else if (formData.tourType === 'domestic') {
        Object.assign(tourData, {
          departure: formData.departure,
          scheduleInfo: formData.scheduleInfo,
          region: formData.region,
          transportation: formData.transportation
        });
      } else if (formData.tourType === 'oversea') {
        Object.assign(tourData, {
          departure: formData.departure,
          airline: formData.airline,
          scheduleInfo: formData.scheduleInfo,
          continent: formData.continent,
          visa: formData.visa,
          countries: (formData.countries || []).filter(c => c?.trim()) // Thêm || [] và optional chaining
        });
      }

      if (mode === 'add') {
        // Tạo mới tour
        const createResponse = await tourAPI.createTour(tourData);

        if (!createResponse.success) {
          alert('Lỗi khi tạo tour: ' + createResponse.message);
          return;
        }

        alert('Tạo tour thành công!');
        navigate(`/tours`); // Điều hướng về danh sách chung

      } else {
        // Cập nhật tour hiện có

        // 1. Cập nhật thông tin cơ bản
        const updateResponse = await tourAPI.updateTour(tourId, tourData);

        if (!updateResponse.success) {
          alert('Lỗi khi cập nhật tour: ' + updateResponse.message);
          return;
        }

        // 2. Cập nhật thông tin chi tiết (nếu có)
        if (mode === 'edit') {
          const tourDetailData = {
            tourData: {
              ...formData.tourData,
              title: formData.title, // Sync title
              duration: formData.duration, // Sync duration
              price: formData.price, // Sync price
              rating: formData.rating,
              reviews: formData.reviews
            },
            scheduleData: formData.scheduleData.filter(schedule =>
              schedule.day.trim() && (schedule.title.trim() || schedule.activities.some(a => a.trim()))
            ),
            priceIncludes: formData.priceIncludes.filter(item => item.trim()),
            priceExcludes: formData.priceExcludes.filter(item => item.trim()),
            landscapeImages: formData.landscapeImages,
            foodImages: formData.foodImages,
            featured: formData.featured
          };

          try {
            await tourDetailAPI.updateTourDetailByTourId(tourId, tourDetailData);
          } catch (detailError) {
            console.warn('Không thể cập nhật chi tiết tour:', detailError);
            // Không block việc save tour chính
          }
        }

        alert('Cập nhật tour thành công!');
        navigate('/tours'); // Điều hướng về danh sách chung
      }

    } catch (err) {
      setError('Lỗi khi lưu tour: ' + err.message);
      console.error('Error saving tour:', err);
      alert('Có lỗi xảy ra khi lưu tour: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm helper cho việc quản lý arrays (services, facilities, countries)
  const addArrayItem = (arrayName) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], '']
    });
  };

  const updateArrayItem = (arrayName, index, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
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
    // Điều hướng về trang phù hợp theo tourType
    switch (formData.tourType) {
      case 'mice':
        navigate('/mice');
        break;
      case 'domestic':
        navigate('/tour-noi-dia');
        break;
      case 'oversea':
        navigate('/tour-quoc-te');
        break;
      default:
        navigate('/');
    }
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

  const handleApiError = (error, operation) => {
    console.error(`Error during ${operation}:`, error);

    if (error.response) {
      // Server trả về error response
      const message = error.response.data?.message || `Lỗi ${operation}`;
      setError(message);
      alert(message);
    } else if (error.request) {
      // Network error
      const message = 'Lỗi kết nối mạng';
      setError(message);
      alert(message);
    } else {
      // Other error
      const message = error.message || `Lỗi không xác định khi ${operation}`;
      setError(message);
      alert(message);
    }
  };

  const regionOptions = getRegionOptions(formData.tourType);

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
            {mode === 'add' ? 'Thêm Tour Mới' : 'Chỉnh sửa Tour'}
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

              {/* Tour Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại tour *</label>
                <select
                  value={formData.tourType}
                  onChange={(e) => handleTourTypeChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {TOUR_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Common fields */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên tour *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá tour *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian *</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Hình ảnh *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* MICE specific fields */}
                {formData.tourType === 'mice' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loại sự kiện</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {MICE_CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quy mô nhóm</label>
                      <input
                        type="text"
                        value={formData.groupSize}
                        onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: 50-100 người"
                      />
                    </div>
                  </>
                )}

                {/* Domestic specific fields */}
                {formData.tourType === 'domestic' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Điểm khởi hành *</label>
                      <input
                        type="text"
                        value={formData.departure}
                        onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vùng miền *</label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Miền Bắc">Miền Bắc</option>
                        <option value="Miền Trung">Miền Trung</option>
                        <option value="Miền Nam">Miền Nam</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phương tiện</label>
                      <select
                        value={formData.transportation}
                        onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {TRANSPORTATION_TYPES.map(trans => (
                          <option key={trans.value} value={trans.value}>{trans.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Oversea specific fields */}
                {formData.tourType === 'oversea' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Điểm khởi hành *</label>
                      <input
                        type="text"
                        value={formData.departure}
                        onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hãng hàng không *</label>
                      <input
                        type="text"
                        value={formData.airline}
                        onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Châu lục *</label>
                      <select
                        value={formData.continent}
                        onChange={(e) => setFormData({ ...formData, continent: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Châu Á">Châu Á</option>
                        <option value="Châu Âu">Châu Âu</option>
                        <option value="Châu Úc">Châu Úc</option>
                        <option value="Châu Mỹ">Châu Mỹ</option>
                        <option value="Châu Phi">Châu Phi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu visa</label>
                      <select
                        value={formData.visa}
                        onChange={(e) => setFormData({ ...formData, visa: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {VISA_TYPES.map(visa => (
                          <option key={visa.value} value={visa.value}>{visa.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Common fields tiếp */}
                {(formData.tourType === 'domestic' || formData.tourType === 'oversea') && (
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin lịch trình *</label>
                    <textarea
                      value={formData.scheduleInfo}
                      onChange={(e) => setFormData({ ...formData, scheduleInfo: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Mô tả lịch khởi hành..."
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* MICE specific sections */}
            {formData.tourType === 'mice' && mode === 'edit' && (
              <>
                {/* Services */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Dịch vụ</h2>
                    <button
                      type="button"
                      onClick={() => addArrayItem('services')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                    >
                      <Plus size={16} />
                      Thêm dịch vụ
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(formData.services || []).map((service, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={service}
                          onChange={(e) => updateArrayItem('services', index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="Dịch vụ..."
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('services', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Tiện nghi</h2>
                    <button
                      type="button"
                      onClick={() => addArrayItem('facilities')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                    >
                      <Plus size={16} />
                      Thêm tiện nghi
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.facilities.map((facility, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={facility}
                          onChange={(e) => updateArrayItem('facilities', index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder="Tiện nghi..."
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('facilities', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Oversea specific sections */}
            {formData.tourType === 'oversea' && mode === 'edit' && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Các quốc gia</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('countries')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                  >
                    <Plus size={16} />
                    Thêm quốc gia
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.countries.map((country, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => updateArrayItem('countries', index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Tên quốc gia..."
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('countries', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                        tourData: { ...formData.tourData, groupSize: e.target.value }
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
            )
            }

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
            )
            }
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
                          const newPriceIncludes = [...formData.priceIncludes];
                          newPriceIncludes[index] = e.target.value;
                          setFormData({ ...formData, priceIncludes: newPriceIncludes });
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Dịch vụ bao gồm..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPriceIncludes = formData.priceIncludes.filter((_, i) => i !== index);
                          setFormData({ ...formData, priceIncludes: newPriceIncludes });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
            }
            {/* Giá không bao gồm */}
            {mode === 'edit' && (
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
            )
            }

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