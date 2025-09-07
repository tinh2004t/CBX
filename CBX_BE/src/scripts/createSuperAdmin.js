const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const User = require('../models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

const createSuperAdmin = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database');
    console.log('Đã kết nối MongoDB');

    // Kiểm tra xem đã có SuperAdmin chưa
    const existingSuperAdmin = await User.findOne({ role: 'SuperAdmin' });
    if (existingSuperAdmin) {
      console.log('Đã có SuperAdmin trong hệ thống:', existingSuperAdmin.username);
      const overwrite = await question('Bạn có muốn tạo SuperAdmin mới không? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Hủy tạo SuperAdmin');
        process.exit(0);
      }
    }

    // Nhập thông tin SuperAdmin
    const username = await question('Nhập username cho SuperAdmin: ');
    if (!username || username.length < 3) {
      console.log('Username phải có ít nhất 3 ký tự');
      process.exit(1);
    }

    const password = await question('Nhập password cho SuperAdmin: ');
    if (!password || password.length < 4) {
      console.log('Password phải có ít nhất 4 ký tự');
      process.exit(1);
    }

    // Kiểm tra username đã tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username đã tồn tại!');
      process.exit(1);
    }

    // Tạo SuperAdmin
    const superAdmin = new User({
      username,
      passwordHash: password, // Sẽ được hash tự động
      role: 'SuperAdmin'
    });

    await superAdmin.save();
    
    console.log('✅ Tạo SuperAdmin thành công!');
    console.log('Username:', username);
    console.log('Role: SuperAdmin');
    
  } catch (error) {
    console.error('❌ Lỗi tạo SuperAdmin:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
    process.exit(0);
  }
};

createSuperAdmin();