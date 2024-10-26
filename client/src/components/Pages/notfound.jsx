import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <section style={{ padding: '40px 0', background: '#fff', fontFamily: 'Arvo, serif' }}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="col-sm-10 col-sm-offset-1 text-center">
                            <div
                                style={{
                                    backgroundImage:
                                        'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                                    height: '400px',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <h1 style={{ fontSize: '80px' }} className="text-center">
                                    404
                                </h1>
                            </div>
                            <div style={{ marginTop: '-50px' }}>
                                <h3 style={{ fontSize: '80px' }} className="h2">
                                    Có vẻ như bạn đang bị lạc
                                </h3>
                                <p>Trang bạn tìm thấy không khả dụng vui lòng quay lại</p>
                                <Link
                                    to="/home"
                                    style={{
                                        color: '#fff!important',
                                        padding: '10px 20px',
                                        background: '#39ac31',
                                        margin: '20px 0',
                                        display: 'inline-block',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Trở lại trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;
