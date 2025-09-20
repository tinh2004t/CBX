import React, { useState } from 'react';
import authAPI from '../../api/auth';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.username || !formData.password) {
        throw new Error('Vui lòng nhập đầy đủ thông tin');
      }

      // Call login API
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password
      });

      // Handle remember me option
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      console.log('Đăng nhập thành công:', response);
      
      // Call onLogin callback
      if (onLogin) {
        onLogin(response);
      }
      
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Load remembered credentials on component mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    if (remembered) {
      setRememberMe(true);
      // You might want to load saved username here if you store it
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Đăng Nhập</h1>
          <p>Chào mừng bạn trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập username của bạn"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              disabled={loading}
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={handleRememberMeChange}
                disabled={loading}
              />
              <span className="checkmark"></span>
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Chưa có tài khoản? 
            <a href="#" className="register-link"> Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;