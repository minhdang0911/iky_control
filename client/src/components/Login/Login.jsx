//code đang ky sms bi loi ko nhan tin nhan viet nam

// import React, { useState, useEffect } from 'react';
// import { apiLogin, apiRegister, apiForgotPassword, apiVerifyPhoneNumber } from '../../api/user';
// import { apiGetStore } from '../../api/store';
// import { toast } from 'react-toastify';
// import './login.scss';
// import { Puff } from 'react-loader-spinner';

// const AuthForm = () => {
//     const [isLogin, setIsLogin] = useState(true);
//     const [isForgotPassword, setIsForgotPassword] = useState(false);
//     const [isVerifying, setIsVerifying] = useState(false);
//     const [verificationCode, setVerificationCode] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [address, setAddress] = useState('');
//     const [storeId, setStoreId] = useState('');
//     const [stores, setStores] = useState([]);
//     const [hidePassword, setHidePassword] = useState(true);
//     const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchStores = async () => {
//             try {
//                 const response = await apiGetStore();
//                 setStores(response.data);
//             } catch (error) {
//                 console.error('Error fetching stores:', error);
//             }
//         };

//         fetchStores();
//     }, []);

//     const formatPhoneNumber = (number) => {
//         if (number.startsWith('0')) {
//             return `+84${number.slice(1)}`;
//         }
//         if (number.startsWith('+84')) {
//             return number;
//         }
//         return `+84${number}`;
//     };

//     const handleAuthSubmit = async (e) => {
//         e.preventDefault();

//         if (isForgotPassword) {
//             handleForgotPasswordSubmit(e);
//             return;
//         }

//         if (isVerifying) {
//             if (!verificationCode) {
//                 toast.error('Vui lòng nhập mã xác thực.');
//                 return;
//             }

//             const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
//             const response = await apiVerifyPhoneNumber(formattedPhoneNumber, verificationCode);
//             if (response && response.status === 200) {
//                 toast.success('Xác thực số điện thoại thành công!');
//                 setIsVerifying(false);
//                 resetForm();
//                 return;
//             } else {
//                 toast.error('Mã xác thực không đúng hoặc số điện thoại không tồn tại.');
//             }
//         }

//         const payload = isLogin
//             ? { email, password, storeId, phoneNumber: formatPhoneNumber(phoneNumber) }
//             : { firstName, lastName, email, password, phoneNumber: formatPhoneNumber(phoneNumber), address };

//         const response = await (isLogin ? apiLogin(payload) : apiRegister(payload));

//         if (response && response.status) {
//             if (response.status === 201) {
//                 if (!isLogin) {
//                     await apiVerifyPhoneNumber(formatPhoneNumber(phoneNumber));
//                     toast.success('Đăng ký thành công! Vui lòng kiểm tra số điện thoại của bạn để xác thực.');
//                     setIsVerifying(true);
//                     resetForm();
//                 } else {
//                     localStorage.setItem('token', response.token);
//                     toast.success('Đăng nhập thành công!');
//                     window.location.href = '/UI-STAFF';
//                 }
//             } else {
//                 toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
//             }
//         } else {
//             toast.error('Email hoặc mật khẩu không đúng.');
//         }
//     };

//     const handleForgotPasswordSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const response = await apiForgotPassword(email);
//             if (response.message === 'Email đặt lại mật khẩu đã được gửi.') {
//                 toast.success('Đường dẫn đặt lại mật khẩu đã được gửi tới email của bạn!');
//                 setEmail(''); // Xóa email sau khi gửi thành công
//             }
//         } catch (error) {
//             toast.error('Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setFirstName('');
//         setLastName('');
//         setEmail('');
//         setPassword('');
//         setConfirmPassword('');
//         setPhoneNumber('');
//         setAddress('');
//         setStoreId('');
//         setVerificationCode('');
//     };

//     return (
//         <div className="auth-form-container">
//             <form onSubmit={handleAuthSubmit} className="auth-form">
//                 {isVerifying ? (
//                     <>
//                         <h2>Xác Thực Số Điện Thoại</h2>
//                         <div className="form-group">
//                             <label>Mã Xác Thực</label>
//                             <input
//                                 type="text"
//                                 value={verificationCode}
//                                 onChange={(e) => setVerificationCode(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <button type="submit" className="auth-button" disabled={loading}>
//                             {loading ? <Puff color="#00BFFF" height={20} width={20} /> : 'Xác Thực'}
//                         </button>
//                         <div className="toggle-auth" onClick={() => setIsVerifying(false)}>
//                             Quay lại Đăng Nhập
//                         </div>
//                     </>
//                 ) : (
//                     <>
//                         <h2>{isLogin ? 'Đăng Nhập' : 'Đăng Ký Người Dùng'}</h2>
//                         {!isLogin && (
//                             <>
//                                 <div className="form-group">
//                                     <label>Họ</label>
//                                     <input
//                                         type="text"
//                                         value={firstName}
//                                         onChange={(e) => setFirstName(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Tên</label>
//                                     <input
//                                         type="text"
//                                         value={lastName}
//                                         onChange={(e) => setLastName(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Số điện thoại</label>
//                                     <input
//                                         type="text"
//                                         value={phoneNumber}
//                                         onChange={(e) => setPhoneNumber(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Địa chỉ</label>
//                                     <input
//                                         type="text"
//                                         value={address}
//                                         onChange={(e) => setAddress(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </>
//                         )}

//                         <div className="form-group">
//                             <label>Email</label>
//                             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                         </div>

//                         <div className="form-group">
//                             <label>Mật khẩu</label>
//                             <div className="password-container">
//                                 <input
//                                     type={hidePassword ? 'password' : 'text'}
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         {!isLogin && (
//                             <div className="form-group">
//                                 <label>Xác nhận Mật khẩu</label>
//                                 <div className="password-container">
//                                     <input
//                                         type={hideConfirmPassword ? 'password' : 'text'}
//                                         value={confirmPassword}
//                                         onChange={(e) => setConfirmPassword(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                         )}

//                         {isLogin && (
//                             <div className="form-group">
//                                 <label>Cửa hàng</label>
//                                 <select value={storeId} onChange={(e) => setStoreId(e.target.value)} required>
//                                     <option value="">Chọn cửa hàng</option>
//                                     {stores.map((store) => {
//                                         const formattedAddress = store.address.split(',').slice(0, 2).join(', ');
//                                         return (
//                                             <option key={store._id} value={store._id}>
//                                                 {store.name} - {formattedAddress}
//                                             </option>
//                                         );
//                                     })}
//                                 </select>
//                             </div>
//                         )}

//                         <button type="submit" className="auth-button" disabled={loading}>
//                             {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
//                         </button>

//                         <div className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
//                             {isLogin ? 'Bạn chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
//                         </div>
//                         {isLogin && (
//                             <div className="toggle-auth" onClick={() => setIsForgotPassword(true)}>
//                                 Quên mật khẩu?
//                             </div>
//                         )}
//                     </>
//                 )}
//             </form>
//             {isForgotPassword && (
//                 <div className="forgot-password">
//                     <h2>Quên Mật Khẩu</h2>
//                     <p>Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.</p>
//                     <form onSubmit={handleForgotPasswordSubmit}>
//                         <div className="form-group">
//                             <label>Email</label>
//                             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                         </div>
//                         <button type="submit" className="auth-button" disabled={loading}>
//                             {loading ? <Puff color="#00BFFF" height={20} width={20} /> : 'Gửi Đường Dẫn Đặt Lại'}
//                         </button>
//                         <div className="toggle-auth" onClick={() => setIsForgotPassword(false)}>
//                             Quay lại Đăng Nhập
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AuthForm;

import React, { useState, useEffect } from 'react';
import {
    apiLogin,
    apiRegister,
    apiForgotPassword,
    apiVerifyCode,
    apiChangedPasswordEmail,
    apiChangePassword,
} from '../../api/user';
import { apiGetAllStore, apiGetStore } from '../../api/store';
import { toast } from 'react-toastify';
import './login.scss';
import { FaEyeSlash } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { Puff } from 'react-loader-spinner'; // Import spinner từ react-loader-spinner
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [storeId, setStoreId] = useState('');
    const [stores, setStores] = useState([]);
    const [hidePassword, setHidePassword] = useState(true);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
    const [loading, setLoading] = useState(false); // State cho loading
    const [verificationCodeChangePassword, setVerificationCodeChangePassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isVerificationSent, setIsVerificationSent] = useState(true);
    const [isChangedPasssword, setIsChangedPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState(''); // Lưu email đã đăng ký
    const [registeredPassword, setRegisteredPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await apiGetAllStore();
                setStores(response.data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };

        fetchStores();
    }, []);
    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        if (isForgotPassword) {
            handleForgotPasswordSubmit(e);
            return;
        }

        if (isVerifying) {
            await handleVerifyCode(e, registeredEmail, registeredPassword); // Truyền email và password
            return;
        }

        // Kiểm tra mật khẩu rỗng
        if (!password) {
            toast.error('Mật khẩu không được để trống.');
            return;
        }

        // Kiểm tra điều kiện mật khẩu
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt.');
            return;
        }

        // Kiểm tra mật khẩu và mật khẩu xác nhận khớp nhau
        if (isRegister && password !== confirmPassword) {
            toast.error('Mật khẩu và mật khẩu xác nhận không khớp.');
            return;
        }

        const payload = isRegister
            ? { firstName, lastName, email, password, phoneNumber, address }
            : { email, password, storeId };

        try {
            const response = await (isRegister ? apiRegister(payload) : apiLogin(payload));

            if (response && response.status) {
                if (isRegister && response.status === 200) {
                    setIsVerifying(true);
                    resetForm();
                    setLoading(true);

                    // Lưu email và password đã đăng ký
                    setRegisteredEmail(email);
                    setRegisteredPassword(password);

                    toast.success('Mã xác thực đã được gửi');
                } else if ((response.status = '201' && !isRegister)) {
                    localStorage.setItem('token', response.token);
                    toast.success('Đăng nhập thành công!');
                    navigate('/control');
                } else if (response.status === 400) {
                    toast.error(response.mes || 'Email đã được đăng ký.');
                } else if (response.status === 401) {
                    toast.error(response.mes || 'Số điện thoại đã được đăng ký.');
                } else {
                    toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
                }
            } else {
                toast.error('Email hoặc mật khẩu không đúng.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
            console.error('Error during authentication:', error);
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        try {
            const response = await apiForgotPassword(email);
            if ((response.message = 'Email đặt lại mật khẩu đã được gửi.')) {
                toast.success('Đường dẫn đặt lại mật khẩu đã được gửi tới email của bạn!');
                setEmail('');
            }
        } catch (error) {
            toast.error('Email này chưa được đăng ký');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            email: registeredEmail,
            verificationCode: verificationCode,
            password: registeredPassword,
        };

        try {
            const response = await apiVerifyCode(payload);
            console.log('Response:', response);

            if ((response.status = '201')) {
                toast.success('Xác thực thành công! Bạn có thể đăng nhập.');
                resetForm();
                setIsLogin(true);
                setIsVerifying(false);
                setIsRegister(false);
            } else {
                toast.error('Xác thực không thành công, vui lòng kiểm tra mã xác thực.');
            }
        } catch (error) {
            toast.error('Mã xác thực không đúng hoặc đã hết hạn.');
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerification = async () => {
        setLoading(true);
        try {
            const response = await apiChangedPasswordEmail(email);
            if (response.success) {
                toast.success('Mã xác thực đã được gửi tới email của bạn!');
                setIsVerificationSent(true);
                setIsChangedPassword(true);
                setIsLogin(false);
                setIsRegister(false);
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Email chưa được đăng ký');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            const response = await apiChangePassword({
                email,
                oldPassword,
                newPassword,
                verificationCode,
            });

            // Kiểm tra nếu response.status là 400, sử dụng phép so sánh đúng (===)
            if (response.status === 400) {
                setIsLogin(false);
                toast.error('Bạn đã nhập sai mã hoặc mật khẩu cũ');
                return;
            }

            // Kiểm tra thành công, sửa điều kiện kiểm tra thành công dựa trên status code (200)
            if (response.status === 200) {
                toast.success('Đổi mật khẩu thành công!');
                resetForm();
                setIsLogin(true);
                setIsChangedPassword(false);
            } else {
                toast.error('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi đổi mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
        setAddress('');
        setStoreId('');
        setVerificationCode('');
        setVerificationCodeChangePassword('');
        setOldPassword('');
        setNewPassword('');
    };

    const HandleChanged = () => {
        setIsVerificationSent(false);
        setIsLogin(false);
        setIsRegister(false);
        setEmail('');
    };

    const handleBack = () => {
        setIsVerificationSent(true);
        setIsChangedPassword(false);
        setIsLogin(true);
    };

    const handleInput = () => {
        setIsRegister(!isRegister);
        setEmail('');
        setPassword('');
    };

    const handleRemoveInputForgot = () => {
        setIsForgotPassword(true);
        setEmail('');
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleAuthSubmit} className="auth-form">
                {isForgotPassword ? (
                    <>
                        <h2>Quên Mật Khẩu</h2>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? <Puff color="#00BFFF" height={20} width={20} /> : 'Gửi yêu cầu'}
                        </button>
                        <div className="toggle-auth" onClick={() => setIsForgotPassword(false)}>
                            Quay lại Đăng Nhập
                        </div>
                    </>
                ) : isVerifying ? (
                    <>
                        <h2>Xác Thực Email</h2>
                        <div className="form-group">
                            <label>Nhập mã xác thực</label>
                            <input
                                type="text"
                                value={verificationCode}
                                required
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>
                        <button className="auth-button" onClick={handleVerifyCode}>
                            Xác Thực
                        </button>
                    </>
                ) : (
                    <>
                        {isVerificationSent && !isChangedPasssword && (
                            <h2>{isRegister ? 'Đăng Ký Người Dùng' : 'Đăng Nhập'}</h2>
                        )}
                        {isRegister && (
                            <>
                                <div className="form-group">
                                    <label>Họ</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tên</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {isLogin && (
                            <>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Mật khẩu</label>
                                    <div className="password-container">
                                        <input
                                            type={hidePassword ? 'password' : 'text'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {isVerificationSent && isRegister && (
                            <div className="form-group">
                                <label>Xác nhận Mật khẩu</label>
                                <div className="password-container">
                                    <input
                                        type={hideConfirmPassword ? 'password' : 'text'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {isLogin && !isRegister && (
                            <div className="form-group">
                                <label>Cửa hàng</label>
                                <select value={storeId} onChange={(e) => setStoreId(e.target.value)} required>
                                    <option value="">Chọn cửa hàng</option>
                                    {stores.map((store) => {
                                        const formattedAddress = store.address.split(',').slice(0, 2).join(', ');
                                        return (
                                            <option key={store._id} value={store._id}>
                                                {store.name} - {formattedAddress}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}

                        {isVerificationSent && !isChangedPasssword && (
                            <button type="submit" className="auth-button" disabled={loading}>
                                {isRegister ? (
                                    loading ? (
                                        <Puff color="#00BFFF" height={20} width={20} />
                                    ) : (
                                        'Đăng ký'
                                    )
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>
                        )}

                        {isLogin && (
                            <div className="toggle-auth" onClick={handleInput}>
                                {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
                            </div>
                        )}

                        {isLogin && !isRegister && (
                            <div
                                className="forgot-password"
                                onClick={handleRemoveInputForgot}
                                style={{ cursor: 'pointer' }}
                            >
                                Quên mật khẩu?
                            </div>
                        )}

                        {isLogin && !isRegister && (
                            <div className="forgot-password" onClick={HandleChanged} style={{ cursor: 'pointer' }}>
                                Đổi mật khẩu?
                            </div>
                        )}
                    </>
                )}

                {!isVerificationSent && !isLogin && !isRegister && (
                    <>
                        <h2>Đổi Mật Khẩu</h2>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button
                            type="button"
                            className="auth-button"
                            onClick={handleSendVerification}
                            disabled={loading}
                        >
                            {loading ? <Puff color="#00BFFF" height={20} width={20} /> : 'Gửi mã xác thực'}
                        </button>
                        <div className="toggle-auth" onClick={handleBack}>
                            Quay lại Đăng Nhập
                        </div>
                    </>
                )}
                {isChangedPasssword && (
                    <>
                        <h2>Nhập Mã Xác Thực và Mật Khẩu</h2>
                        <div className="form-group">
                            <label>Mã Xác Thực</label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu cũ</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="button" className="auth-button" onClick={handleChangePassword} disabled={loading}>
                            {loading ? <Puff color="#00BFFF" height={20} width={20} /> : 'Đổi Mật Khẩu'}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};
export default AuthForm;

//api thuc te
// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { Puff } from 'react-loader-spinner';
// import './login.scss';
// import { IoEyeSharp } from 'react-icons/io5';
// import { FaEyeSlash } from 'react-icons/fa';

// const AuthForm = () => {
//     const [isLogin, setIsLogin] = useState(true);
//     const [username, setUsername] = useState(''); // Thay đổi tên biến từ email thành username
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [hidePassword, setHidePassword] = useState(true);

//     const handleAuthSubmit = async (e) => {
//         e.preventDefault();

//         if (!username || !password) {
//             toast.error('Tên người dùng và mật khẩu không được để trống.');
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await fetch(
//                 `/api/users/token?grant_type=password&username=${username}&password=${password}`,
//                 {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 },
//             );

//             console.log('Response status:', response);

//             if (!response.ok) {
//                 const errorMsg = await response.text();
//                 console.error('Error response:', errorMsg);
//                 toast.error('Có lỗi xảy ra, vui lòng thử lại.');
//                 return;
//             }

//             const data = await response.json();
//             console.log('Response data:', data); // Kiểm tra dữ liệu phản hồi

//             // Kiểm tra kết quả và lưu accessToken
//             if (data.result === 1 && data.msg) {
//                 localStorage.setItem('Access token', data.msg.accessToken); // Lưu accessToken vào localStorage
//                 toast.success('Đăng nhập thành công!');
//                 window.location.href = '/control'; // Chuyển hướng sau khi đăng nhập
//             } else {
//                 toast.error(data.msg || 'Đăng nhập không thành công.');
//             }
//         } catch (error) {
//             toast.error('Có lỗi xảy ra, vui lòng thử lại.');
//             console.error('Error during authentication:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="auth-form-container">
//             <form onSubmit={handleAuthSubmit} className="auth-form">
//                 <h2>Đăng Nhập</h2>
//                 <div className="form-group">
//                     <label>Tên người dùng</label>
//                     <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//                 </div>
//                 <div className="form-group">
//                     <label>Mật khẩu</label>
//                     <div className="password-container">
//                         <input
//                             type={hidePassword ? 'password' : 'text'}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <span onClick={() => setHidePassword(!hidePassword)}>
//                             {hidePassword ? <IoEyeSharp /> : <FaEyeSlash />}
//                         </span>
//                     </div>
//                 </div>
//                 <button type="submit" className="auth-button" disabled={loading}>
//                     {loading ? <Puff color="#00BFFF" height={20} width={20} /> : 'Đăng Nhập'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AuthForm;
