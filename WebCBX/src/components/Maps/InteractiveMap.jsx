import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import MapLocation from './MapLocation';

const InteractiveMap = () => {
  const { t } = useLanguage();

  const locations = [
    {
      id: "1449",
      href: "/viet-nam/ha-noi",
      style: { top: "14.8%", left: "55%", width: "7.3%" },
      image: "/files/images/vietnam/hanoi(1).png",
      titleKey: "province_hanoi",
      introKey: "introduce_province_hanoi"
    },
    {
      id: "1452", 
      href: "/laos/vieng-chan",
      style: { top: "27%", left: "24%", width: "11%" },
      image: "/files/images/lao-cam/vienchan.png",
      titleKey: "province_vieng_chan",
      introKey: "introduce_province_vieng_chan"
    },
    {
      id: "1453",
      href: "/laos/luangprabang", 
      style: { top: "13%", left: "15%", width: "16%" },
      image: "/files/images/lao-cam/luongphabang.png",
      titleKey: "province_luang_prabang",
      introKey: "introduce_province_luang_prabang"
    },
    {
      id: "1456",
      href: "/viet-nam/ho-chi-minh",
      style: { top: "82%", left: "65%", width: "6.4%" },
      image: "/files/images/vietnam/HCM(1).png",
      titleKey: "province_ho_chi_minh",
      introKey: "introduce_province_ho_chi_minh"
    },
    {
      id: "1457",
      href: "/viet-nam/chau-doc",
      style: { top: "83.5%", left: "49%", width: "8.3%" },
      image: "/files/images/vietnam/angiang(1).png",
      titleKey: "province_chau_doc",
      introKey: "introduce_province_chau_doc"
    },
    {
      id: "1458",
      href: "/viet-nam/can-tho",
      style: { top: "87.7%", left: "53.5%", width: "7%" },
      image: "/files/images/vietnam/cantho(1).png",
      titleKey: "province_can_tho",
      introKey: "introduce_province_can_tho"
    },
    // Add more locations as needed...
  ];

  return (
    <section id="maps-detail" className="padding-bottom wow fadeInUp">
      <div id="maps">
        <div className="row justify-content-center margin-0">
          <div className="col">
            <h2 className="text-center">
              {t('kham_pha') || 'Khám phá'}
            </h2>
            <p className="text-center">
              {t('kham_pha1') || 'Khám phá vẻ đẹp của các vùng miền'}
            </p>
          </div>
        </div>
        
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-xs-12">
              <div className="bbb" style={{ position: 'relative' }}>
                <img 
                  className="img-bigmaps" 
                  style={{ width: '100%' }}
                  src="/Content/assets/images/vnlccactinh.png" 
                  alt="Interactive Map" 
                />
                
                {locations.map(location => (
                  <MapLocation 
                    key={location.id}
                    {...location}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="row justify-content-center margin-0 text-center padding-top">
        <div className="search2-container">
          <input 
            type="text" 
            className="search2-box" 
            placeholder={t('tim_kiem_tour') || 'Tìm kiếm tour, địa điểm...'} 
          />
          <button className="search2-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;