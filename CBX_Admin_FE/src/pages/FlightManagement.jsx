import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Plane, Calendar, Clock, Users, X, Save } from 'lucide-react';

const FlightManagement = () => {
  // Dữ liệu mẫu
  const [flightsData, setFlightsData] = useState([
    {
      "_id": "68be95d15782704cb8833abf",
      "departure": "Hà Nội",
      "destination": "Đà Nẵng",
      "airline": "Vietnam Airlines",
      "airlineLogo": "https://tse1.mm.bing.net/th/id/OIP.mCWXPfBxEdoPr5KNOhoA-wHaFA?pid=Api&P=0&h=220",
      "date": "2025-01-15",
      "price": "12,500,000",
      "flights": [
        {
          "time": "06:00 - 12:30",
          "duration": "3h 30m",
          "flightCode": "VN3201",
          "aircraft": "Boeing 787",
          "status": "Hết chỗ",
          "_id": "68be95d15782704cb8833ac0"
        },
        {
          "time": "14:30 - 21:00",
          "duration": "3h 30m",
          "flightCode": "VN3e03",
          "aircraft": "Boeing 787",
          "status": "Còn chỗ",
          "_id": "68be95d15782704cb8833ac1"
        },
        {
          "time": "22:15 - 04:45+1",
          "duration": "3h 30m",
          "flightCode": "VNq305",
          "aircraft": "Airbus A350",
          "status": "Sắp hết",
          "_id": "68be95d15782704cb8833ac2"
        }
      ]
    },
    {
      "_id": "68be95d15782704cb8833abc",
      "departure": "TP.HCM",
      "destination": "Hà Nội",
      "airline": "Vietjet Air",
      "airlineLogo": "https://logos-world.net/wp-content/uploads/2021/08/VietJet-Air-Logo.png",
      "date": "2025-01-16",
      "price": "8,900,000",
      "flights": [
        {
          "time": "07:30 - 09:45",
          "duration": "2h 15m",
          "flightCode": "VJ150",
          "aircraft": "Airbus A321",
          "status": "Còn chỗ",
          "_id": "68be95d15782704cb8833abd"
        },
        {
          "time": "15:20 - 17:35",
          "duration": "2h 15m",
          "flightCode": "VJ152",
          "aircraft": "Airbus A321",
          "status": "Còn chỗ",
          "_id": "68be95d15782704cb8833abe"
        }
      ]
    }
  ]);

  const [filteredFlights, setFilteredFlights] = useState(flightsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    airline: '',
    airlineLogo: '',
    date: '',
    price: '',
    flights: []
  });

  // Single flight detail state
  const [flightDetail, setFlightDetail] = useState({
    time: '',
    duration: '',
    flightCode: '',
    aircraft: '',
    status: 'Còn chỗ'
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      departure: '',
      destination: '',
      airline: '',
      airlineLogo: '',
      date: '',
      price: '',
      flights: []
    });
    setFlightDetail({
      time: '',
      duration: '',
      flightCode: '',
      aircraft: '',
      status: 'Còn chỗ'
    });
  };

  // Filter và search logic
  useEffect(() => {
    let filtered = flightsData;

    if (searchTerm) {
      filtered = filtered.filter(flight => 
        flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.flights.some(f => f.flightCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (airlineFilter !== 'all') {
      filtered = filtered.filter(flight => flight.airline === airlineFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(flight => 
        flight.flights.some(f => f.status === statusFilter)
      );
    }

    setFilteredFlights(filtered);
  }, [searchTerm, statusFilter, airlineFilter, flightsData]);

  const uniqueAirlines = [...new Set(flightsData.map(flight => flight.airline))];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Còn chỗ': return 'bg-green-100 text-green-800';
      case 'Sắp hết': return 'bg-yellow-100 text-yellow-800';
      case 'Hết chỗ': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const deleteFlight = (flightId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) {
      setFlightsData(prev => prev.filter(flight => flight._id !== flightId));
    }
  };

  const editFlight = (flight) => {
    setEditingFlight(flight);
    setFormData({
      departure: flight.departure,
      destination: flight.destination,
      airline: flight.airline,
      airlineLogo: flight.airlineLogo,
      date: flight.date,
      price: flight.price,
      flights: flight.flights
    });
    setShowEditModal(true);
  };

  // Add flight detail to form
  const addFlightDetail = () => {
    if (!flightDetail.time || !flightDetail.flightCode) {
      alert('Vui lòng nhập đầy đủ thời gian và mã chuyến bay');
      return;
    }

    const newDetail = {
      ...flightDetail,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    setFormData(prev => ({
      ...prev,
      flights: [...prev.flights, newDetail]
    }));

    setFlightDetail({
      time: '',
      duration: '',
      flightCode: '',
      aircraft: '',
      status: 'Còn chỗ'
    });
  };

  // Remove flight detail from form
  const removeFlightDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      flights: prev.flights.filter((_, i) => i !== index)
    }));
  };

  // Handle create flight
  const handleCreateFlight = () => {
    if (!formData.departure || !formData.destination || !formData.airline || !formData.date || !formData.price) {
      alert('Vui lòng nhập đầy đủ thông tin chuyến bay');
      return;
    }

    if (formData.flights.length === 0) {
      alert('Vui lòng thêm ít nhất một chuyến bay chi tiết');
      return;
    }

    const newFlight = {
      ...formData,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    setFlightsData(prev => [...prev, newFlight]);
    setShowCreateModal(false);
    resetForm();
    alert('Tạo chuyến bay thành công!');
  };

  // Handle update flight
  const handleUpdateFlight = () => {
    if (!formData.departure || !formData.destination || !formData.airline || !formData.date || !formData.price) {
      alert('Vui lòng nhập đầy đủ thông tin chuyến bay');
      return;
    }

    if (formData.flights.length === 0) {
      alert('Vui lòng thêm ít nhất một chuyến bay chi tiết');
      return;
    }

    setFlightsData(prev => prev.map(flight => 
      flight._id === editingFlight._id 
        ? { ...formData, _id: editingFlight._id }
        : flight
    ));

    setShowEditModal(false);
    setEditingFlight(null);
    resetForm();
    alert('Cập nhật chuyến bay thành công!');
  };

  // Form Modal Component
  const FormModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Chỉnh sửa chuyến bay' : 'Tạo chuyến bay mới'}
          </h2>
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
                setEditingFlight(null);
              } else {
                setShowCreateModal(false);
              }
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm khởi hành *
                </label>
                <input
                  type="text"
                  value={formData.departure}
                  onChange={(e) => setFormData(prev => ({ ...prev, departure: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Hà Nội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm đến *
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Đà Nẵng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hãng bay *
                </label>
                <input
                  type="text"
                  value={formData.airline}
                  onChange={(e) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: Vietnam Airlines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo hãng bay (URL)
                </label>
                <input
                  type="url"
                  value={formData.airlineLogo}
                  onChange={(e) => setFormData(prev => ({ ...prev, airlineLogo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bay *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VND) *
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: 12,500,000"
                />
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Chi tiết chuyến bay</h3>
            
            {/* Add Flight Detail Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-3">Thêm chuyến bay chi tiết</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian *
                  </label>
                  <input
                    type="text"
                    value={flightDetail.time}
                    onChange={(e) => setFlightDetail(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="06:00 - 12:30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời lượng
                  </label>
                  <input
                    type="text"
                    value={flightDetail.duration}
                    onChange={(e) => setFlightDetail(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="3h 30m"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã chuyến bay *
                  </label>
                  <input
                    type="text"
                    value={flightDetail.flightCode}
                    onChange={(e) => setFlightDetail(prev => ({ ...prev, flightCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VN3201"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại máy bay
                  </label>
                  <input
                    type="text"
                    value={flightDetail.aircraft}
                    onChange={(e) => setFlightDetail(prev => ({ ...prev, aircraft: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Boeing 787"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={flightDetail.status}
                    onChange={(e) => setFlightDetail(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Còn chỗ">Còn chỗ</option>
                    <option value="Sắp hết">Sắp hết</option>
                    <option value="Hết chỗ">Hết chỗ</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addFlightDetail}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Flight Details List */}
            {formData.flights.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Danh sách chuyến bay ({formData.flights.length})</h4>
                <div className="space-y-2">
                  {formData.flights.map((flight, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{flight.flightCode}</span>
                        <span className="text-gray-600">{flight.time}</span>
                        <span className="text-gray-600">{flight.duration}</span>
                        <span className="text-gray-600">{flight.aircraft}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFlightDetail(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setEditingFlight(null);
                } else {
                  setShowCreateModal(false);
                }
                resetForm();
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Hủy
            </button>
            <button
              onClick={isEdit ? handleUpdateFlight : handleCreateFlight}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {isEdit ? 'Cập nhật' : 'Tạo chuyến bay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Plane className="text-blue-600" />
                Quản lý chuyến bay
              </h1>
              <p className="text-gray-600 mt-1">Quản lý tất cả các chuyến bay trong hệ thống</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Tạo chuyến bay
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo địa điểm, hãng bay, mã chuyến..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <select
                value={airlineFilter}
                onChange={(e) => setAirlineFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả hãng bay</option>
                {uniqueAirlines.map(airline => (
                  <option key={airline} value={airline}>{airline}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Còn chỗ">Còn chỗ</option>
                <option value="Sắp hết">Sắp hết</option>
                <option value="Hết chỗ">Hết chỗ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flight Cards */}
        <div className="grid gap-6">
          {filteredFlights.map((flight) => (
            <div key={flight._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6 border-b">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={flight.airlineLogo}
                      alt={flight.airline}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNCIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNMTIgMjRMMzYgMTJWMzZMMTIgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {flight.departure} → {flight.destination}
                      </h3>
                      <p className="text-gray-600">{flight.airline}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date(flight.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {flight.price} VND
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => editFlight(flight)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteFlight(flight._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {flight.flights.map((flightDetail) => (
                    <div key={flightDetail._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500" />
                          <div>
                            <div className="font-semibold">{flightDetail.time}</div>
                            <div className="text-sm text-gray-600">{flightDetail.duration}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-semibold">{flightDetail.flightCode}</div>
                          <div className="text-sm text-gray-600">{flightDetail.aircraft}</div>
                        </div>
                        
                        <div className="col-span-2 sm:col-span-1 flex justify-start sm:justify-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(flightDetail.status)}`}>
                            {flightDetail.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredFlights.length === 0 && (
          <div className="text-center py-12">
            <Plane size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Không tìm thấy chuyến bay</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        )}

        {/* Modals */}
        {showCreateModal && <FormModal isEdit={false} />}
        {showEditModal && <FormModal isEdit={true} />}
      </div>
    </div>
  );
};

export default FlightManagement;