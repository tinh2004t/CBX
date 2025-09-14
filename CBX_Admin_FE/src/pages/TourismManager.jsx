import React, { useState } from 'react';
import { Edit, Trash2, X, Save, Plus, Minus, Upload, Image } from 'lucide-react';

const ExploreManagement = () => {
  // Dữ liệu mẫu (được rút gọn)
  const [exploreData, setExploreData] = useState([
    {
      "_id": "68bbd1e8776872470a508d79",
      "slug": "cao-bang",
      "title": "Cao Bằng",
      "mainImage": "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
      "shortDescription": "Tỉnh Cao Bằng là một trong những tỉnh đẹp nhất Việt Nam, cách Hà Nội 272km về phía bắc. Là tỉnh miền núi phía Bắc, giáp biên giới với Trung Quốc ở phía bắc. Nằm ở độ cao 300m, Cao Bằng có khí hậu nhiệt đới ôn hòa và dễ chịu qua bốn mùa rõ rệt, nhiệt độ cao nhất vào tháng 5 và lạnh nhất vào tháng 1.",
      "fullDescription": "Tỉnh Cao Bằng là một trong những tỉnh đẹp nhất Việt Nam, cách Hà Nội 272km về phía bắc. Là tỉnh miền núi phía Bắc, giáp biên giới với Trung Quốc ở phía bắc. Nằm ở độ cao 300m, Cao Bằng có khí hậu nhiệt đới ôn hòa và dễ chịu qua bốn mùa rõ rệt, nhiệt độ cao nhất vào tháng 5 và lạnh nhất vào tháng 1.\n\nThành phố Cao Bằng có ít điểm thu hút so với các vùng lân cận. Tuy nhiên, bạn vẫn có thể khám phá đài tưởng niệm liệt sĩ, được dựng trên đỉnh một ngọn đồi. Từ đó, bạn sẽ có tầm nhìn toàn cảnh tuyệt đẹp.\n\nỞ các vùng lân cận Cao Bằng, có nhiều địa điểm không thể bỏ qua, đặc biệt là hồ Thang Hen, hang Pac Bo, và thác nước Bản Giốc.",
      "gallery": [
        "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
        "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg",
        "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg"
      ],
      "transportation": [
        "Xe ô tô riêng",
        "Xe máy (bằng lái xe quốc tế và bảo hiểm du lịch xe máy là bắt buộc. Liên hệ chúng tôi để có thêm thông tin)",
        "Xe buýt công cộng"
      ],
      "activities": [
        "Đi bộ dạo chơi",
        "Tham quan thác Bản Giốc",
        "Đi thuyền để ngắm thác gần hơn",
        "Tham quan hang Ngườm Ngao (hang Hổ)",
        "Tham quan làng thợ rèn Phúc Sen của dân tộc Nùng"
      ],
      "accommodations": [
        {
          "type": "Homestay",
          "image": "https://media.vov.vn/sites/default/files/styles/large/public/2020-09/99-thuyen_hoa.jpg"
        },
        {
          "type": "Ecolodge",
          "image": ""
        }
      ]
    }
  ]);

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditForm({
      ...item,
      gallery: item.gallery || [],
      transportation: item.transportation || [],
      activities: item.activities || [],
      accommodations: item.accommodations || [{ type: '', image: '' }]
    });
  };

  const handleSave = () => {
    const updatedData = exploreData.map(item => {
      if (item._id === editingItem) {
        return {
          ...item,
          title: editForm.title,
          mainImage: editForm.mainImage,
          shortDescription: editForm.shortDescription,
          fullDescription: editForm.fullDescription,
          gallery: editForm.gallery.filter(url => url.trim()),
          transportation: editForm.transportation.filter(t => t.trim()),
          activities: editForm.activities.filter(a => a.trim()),
          accommodations: editForm.accommodations.filter(acc => acc.type.trim())
        };
      }
      return item;
    });
    
    setExploreData(updatedData);
    setEditingItem(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      setExploreData(exploreData.filter(item => item._id !== id));
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditForm({});
  };

  // Dynamic list handlers
  const addListItem = (field) => {
    const currentList = editForm[field] || [];
    setEditForm({
      ...editForm,
      [field]: [...currentList, field === 'accommodations' ? { type: '', image: '' } : '']
    });
  };

  const removeListItem = (field, index) => {
    const currentList = editForm[field] || [];
    const newList = currentList.filter((_, i) => i !== index);
    setEditForm({
      ...editForm,
      [field]: newList
    });
  };

  const updateListItem = (field, index, value) => {
    const currentList = [...(editForm[field] || [])];
    currentList[index] = value;
    setEditForm({
      ...editForm,
      [field]: currentList
    });
  };

  const updateAccommodationField = (index, fieldName, value) => {
    const currentList = [...(editForm.accommodations || [])];
    currentList[index] = { ...currentList[index], [fieldName]: value };
    setEditForm({
      ...editForm,
      accommodations: currentList
    });
  };

  const ImagePreview = ({ src, size = "w-16 h-16" }) => (
    <div className={`${size} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50`}>
      {src ? (
        <img src={src} alt="Preview" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <Image className="text-gray-400" size={24} />
      )}
    </div>
  );

  const ImageUploadField = ({ label, value, onChange, preview = true }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        {preview && <ImagePreview src={value} />}
        <div className="flex-1 flex gap-2">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập URL ảnh..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>
    </div>
  );

  const DynamicListField = ({ label, items, fieldName, placeholder }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateListItem(fieldName, index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => removeListItem(fieldName, index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Minus size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addListItem(fieldName)}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Thêm {label.toLowerCase()}
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản Lý Nội Dung Khám Phá</h1>
        
        {/* Grid hiển thị dữ liệu */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {exploreData.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={item.mainImage} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.shortDescription}</p>
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div><strong>Phương tiện:</strong> {item.transportation.slice(0, 2).join(', ')}</div>
                  <div><strong>Hoạt động:</strong> {item.activities.slice(0, 2).join(', ')}</div>
                  <div><strong>Lưu trú:</strong> {item.accommodations.map(acc => acc.type).join(', ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal chỉnh sửa - Redesigned */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Chỉnh sửa nội dung</h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Main Image */}
                      <ImageUploadField
                        label="Ảnh chính"
                        value={editForm.mainImage}
                        onChange={(value) => setEditForm({...editForm, mainImage: value})}
                      />

                      {/* Short Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                        <textarea
                          value={editForm.shortDescription || ''}
                          onChange={(e) => setEditForm({...editForm, shortDescription: e.target.value})}
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Transportation */}
                      <DynamicListField
                        label="Phương tiện"
                        items={editForm.transportation || []}
                        fieldName="transportation"
                        placeholder="Nhập phương tiện..."
                      />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Full Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả đầy đủ</label>
                        <textarea
                          value={editForm.fullDescription || ''}
                          onChange={(e) => setEditForm({...editForm, fullDescription: e.target.value})}
                          rows={6}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Gallery */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Thư viện ảnh</label>
                        {(editForm.gallery || []).map((url, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <ImagePreview src={url} size="w-12 h-12" />
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => updateListItem('gallery', index, e.target.value)}
                              placeholder="URL ảnh..."
                              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => removeListItem('gallery', index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addListItem('gallery')}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Thêm ảnh
                        </button>
                      </div>

                      {/* Activities */}
                      <DynamicListField
                        label="Hoạt động"
                        items={editForm.activities || []}
                        fieldName="activities"
                        placeholder="Nhập hoạt động..."
                      />
                    </div>
                  </div>

                  {/* Accommodations - Full Width */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="space-y-4">
                      <label className="block text-lg font-medium text-gray-700">Lưu trú</label>
                      {(editForm.accommodations || []).map((acc, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Loại hình lưu trú</label>
                              <input
                                type="text"
                                value={acc.type || ''}
                                onChange={(e) => updateAccommodationField(index, 'type', e.target.value)}
                                placeholder="Ví dụ: Homestay, Hotel, Resort..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Ảnh minh họa</label>
                              <div className="flex items-center gap-3">
                                <ImagePreview src={acc.image} size="w-12 h-12" />
                                <input
                                  type="url"
                                  value={acc.image || ''}
                                  onChange={(e) => updateAccommodationField(index, 'image', e.target.value)}
                                  placeholder="URL ảnh..."
                                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeListItem('accommodations', index)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addListItem('accommodations')}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Thêm loại lưu trú
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium shadow-md"
                >
                  <Save size={16} />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreManagement;