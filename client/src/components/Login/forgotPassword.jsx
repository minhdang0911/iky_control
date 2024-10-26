import React, { useState, useEffect } from 'react';
import { apiResetPassword } from '../../api/user';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import './forgotPassword.css';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const FlipClock = ({ time }) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        <div className="countdown-timer">
            <div className="flip-clock">
                <div className={`flip-clock-inner ${time < 30 ? 'flip' : ''}`}>
                    <div className="flip-clock-front">{String(minutes).padStart(2, '0')}</div>
                    <div className="flip-clock-back">{String(minutes).padStart(2, '0')}</div>
                </div>
            </div>
            :
            <div className="flip-clock">
                <div className={`flip-clock-inner ${time < 30 ? 'flip' : ''}`}>
                    <div className="flip-clock-front">{String(seconds).padStart(2, '0')}</div>
                    <div className="flip-clock-back">{String(seconds).padStart(2, '0')}</div>
                </div>
            </div>
        </div>
    );
};

const ResetPasswordForm = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [timeLeftForgot, setTimeLeftForgot] = useState(300); // Khởi tạo 300 giây cho đồng hồ đếm ngược
    const navigate = useNavigate();

    useEffect(() => {
        const savedData = localStorage.getItem('timeLeft');

        if (savedData) {
            const { token: savedToken, timeLeft } = JSON.parse(savedData);
            if (savedToken === token) {
                setTimeLeftForgot(timeLeft);
            } else {
                setTimeLeftForgot(300);
                localStorage.setItem('timeLeft', JSON.stringify({ token, timeLeft: 300 }));
            }
        } else {
            setTimeLeftForgot(300);
            localStorage.setItem('timeLeft', JSON.stringify({ token, timeLeft: 300 }));
        }

        const timerId = setInterval(() => {
            setTimeLeftForgot((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timerId);
                    toast.error('Token đã hết hạn.');
                    localStorage.removeItem('timeLeft');
                    navigate('/forgot-password');
                    return 0;
                }

                const newTime = prevTime - 1;
                localStorage.setItem('timeLeft', JSON.stringify({ token, timeLeft: newTime }));
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [token, navigate]);

    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            toast.error('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        if (!isPasswordValid(newPassword)) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa, 1 số và 1 ký tự đặc biệt.');
            return;
        }

        try {
            const response = await apiResetPassword(token, { newPassword, confirmNewPassword });
            if (response.status === 200) {
                toast.success('Mật khẩu đã được đặt lại thành công!');
                localStorage.removeItem('timeLeft');
                navigate('/login');
            } else if (response.status === 400) {
                toast.error('Đường dẫn không hợp lệ');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <div className="reset-password-form">
            <h2>Đặt lại mật khẩu</h2>
            <FlipClock time={timeLeftForgot} />
            <form onSubmit={handleResetPasswordSubmit}>
                <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <div className="password-inputt">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="icons-forgot">
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                </div>
                <button type="submit" className="auth-button">
                    Đặt lại mật khẩu
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
