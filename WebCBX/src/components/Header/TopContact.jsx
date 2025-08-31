import React, { useState } from 'react';

const TopContact = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
    <style>{`
        .topcontact {
            display: flex;
            justify-content: space-between;
            padding: 4px 10px;
            align-items: center;
            font-weight: 600;
            z-index: 1111;
            transition: all .5s ease-in-out;
        }

        .contacthotel {

            background: #0072bd;
            z-index: 111111;
            width: 100%;
            transition: all .5s ease-in-out;
        }

        .order {
            display: flex;
            color: #FFf;
            align-items: center;
            font-weight: 600;
            z-index: 111;
        }

        .topcontact a {
            color: #FFF !important;
            font-family: Arial, sans-serif;
            font-size: 16px;
            display: block;
        }

        .closetop {
            padding-left: 10px;
            color: #FFF;
            z-index: 111;
            background: transparent !important;
        }

        .topcontact .order a {
            padding: 3px 15px;
            border-radius: 5px;
            background: #f8c218;
            font-size: 14px;
            line-height: 1.6;
            font-weight: 600;
        }

        /*.contacthotel.fixedcontact {
    position: fixed;
    width: 100%;
    z-index: 1111;
    top: 0;
    left: 0;
}*/
        @media(max-width:767px) {

            .fixed-top {
                top: 0 !important;
            }

            .contacthotel {
                position: fixed;
                width: 100%;
                z-index: 1111;
                bottom: 0;
                left: 0;
                display: block !important;
            }

            .contacthotel.fixedcontact {
                position: fixed;
                width: 100%;
                z-index: 1111;
                top: 93%;
                left: 0;
            }

            .topcontact {
                display: flex;
                justify-content: space-between;
                padding: 5px 0px;
                align-items: center;
                font-weight: 600;
                z-index: 111;
                transition: all .5s ease-in-out;
                font-size: 13px;
            }

            .topcontact .order a {
                padding: 5px 5px;
                border-radius: 5px;
            }
        }
    `}</style>
    <div className="contacthotel">
      <div className="topcontact">
        <div className="order">
          <a href="tel:+84912550212">
            Hotline: +84 912 550 212
          </a>
        </div>
        <div className="order">
          <a href="#contact-form">
            Đặt tour ngay
          </a>
        </div>
        <button 
          className="closetop" 
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFF',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
    </div>
    </>
  );
};

export default TopContact;