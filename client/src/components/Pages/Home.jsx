import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'owl.carousel/dist/assets/owl.carousel.min.css';
import './home.scss';
import logo from '../../assets/img/logocompany.png';
import product1 from '../../assets/img/product1.webp';
import product2 from '../../assets/img/product2.jpg';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Col, Row } from 'antd';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Layout, Menu, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
const { Header } = Layout;

const Home = () => {
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        document.title = 'Trang chủ';
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <>
            <Layout>
                <Header
                    className="header"
                    style={{
                        position: 'fixed',
                        zIndex: 1,
                        width: '101%',
                        background: '#fff',
                        height: '110px',
                        marginLeft: '-12px',
                    }}
                >
                    <div className="logo">
                        <Link to="/login">
                            <img src={logo} alt="Logo" style={{ width: '50%', height: '50%' }} loading="lazy" />
                        </Link>
                    </div>
                    {isMobile && ( // Hiển thị MenuOutlined chỉ khi ở giao diện di động
                        <div className="menu-mobile">
                            <MenuOutlined onClick={showDrawer} style={{ fontSize: '24px' }} />
                        </div>
                    )}
                    {!isMobile && (
                        <Menu theme="light" mode="horizontal" className="desktop-menu">
                            <Menu.Item key="home">
                                <Link to="/">Trang chủ</Link>
                            </Menu.Item>
                            <Menu.Item key="about">
                                <Link to="/">Giới thiệu</Link>
                            </Menu.Item>
                            <Menu.SubMenu key="shop" title="Cửa hàng">
                                <Menu.Item key="shop-list">
                                    <Link to="shop-listing.html">Danh sách cửa hàng</Link>
                                </Menu.Item>
                                <Menu.Item key="technicians">
                                    <Link to="shop-detail.html">Danh sách kĩ thuật viên</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                            <Menu.Item key="reviews">
                                <Link to="#section_4">Đánh giá</Link>
                            </Menu.Item>
                            <Menu.Item key="contact">
                                <Link to="#section_5">Liên hệ</Link>
                            </Menu.Item>
                        </Menu>
                    )}
                </Header>

                <Drawer title="Menu" placement="right" closable={true} onClose={onClose} visible={visible} key="right">
                    <Menu mode="inline">
                        <Menu.Item key="home">
                            <Link to="/">Trang chủ</Link>
                        </Menu.Item>
                        <Menu.Item key="about">
                            <Link to="/">Giới thiệu</Link>
                        </Menu.Item>
                        <Menu.SubMenu key="shop" title="Cửa hàng">
                            <Menu.Item key="shop-list">
                                <Link to="shop-listing.html">Danh sách cửa hàng</Link>
                            </Menu.Item>
                            <Menu.Item key="technicians">
                                <Link to="shop-detail.html">Danh sách kĩ thuật viên</Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item key="reviews">
                            <Link to="#section_4">Đánh giá</Link>
                        </Menu.Item>
                        <Menu.Item key="contact">
                            <Link to="#section_5">Liên hệ</Link>
                        </Menu.Item>
                    </Menu>
                </Drawer>
            </Layout>
            <main>
                <div className="header-banner-home">
                    <section
                        className="hero-section hero-slide d-flex justify-content-center align-items-center"
                        id="section_1"
                    >
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 col-12 text-center mx-auto">
                                    <div className="hero-section-text">
                                        <small className="section-small-title">
                                            Chào mừng đến với IKY <i className="hero-icon bi-house"></i>
                                        </small>

                                        <h1 className="hero-title text-white mt-2 mb-4">
                                            Đem đến những thiết bị tốt nhất
                                        </h1>

                                        <form className="custom-form hero-form" action="#" method="get" role="form">
                                            <div className="row">
                                                <div className="col-lg-5 col-md-6 col-12">
                                                    <div className="input-group align-items-center">
                                                        {/* <label for="product-name">Product</label>

                                                    <input
                                                        type="text"
                                                        name="product-name"
                                                        id="product-name"
                                                        className="form-control"
                                                        placeholder="Bathroom, Living Room..."
                                                        required
                                                    /> */}
                                                    </div>
                                                </div>

                                                {/* <div className="col-lg-5 col-md-6 col-12">
                                                <div className="input-group align-items-center">
                                                    <label for="last-name">Price</label>

                                                    <select
                                                        name="price-range"
                                                        className="form-select form-control"
                                                        id="price-range"
                                                        aria-label="Default select example"
                                                    >
                                                        <option value="500" selected>
                                                            $500 to $990
                                                        </option>
                                                        <option value="1000">$1,000 - 2,900</option>
                                                        <option value="3000">$3,000 - 5,000</option>
                                                        <option value="5000">$5,000 - 10,000</option>
                                                        <option value="11000">$11,000 - 25,000</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-2 col-md-6 col-12">
                                                <button type="submit" className="form-control">
                                                    Search
                                                </button>
                                            </div> */}
                                            </div>
                                        </form>

                                        <div className="hero-btn d-flex justify-content-center align-items-center">
                                            <a
                                                className="bi-arrow-down hero-btn-link smoothscroll"
                                                href="#section_2"
                                            ></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="about-section section-padding" id="section_2">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-5 col-12">
                                <small className="section-small-title">Câu chuyện</small>

                                <h2 className="mt-2 mb-4">
                                    <span className="text-muted">Giới thiệu về</span> IKY
                                </h2>

                                <h4 className="text-muted mb-3">Thành lập năm 2014</h4>

                                <p>
                                    Chúng tôi là một đội ngũ đam mê với sứ mệnh mang lại những giải pháp công nghệ và an
                                    ninh hiệu quả nhất cho khách hàng. Tại IKY, chúng tôi tập trung vào việc phát triển
                                    và sản xuất các thiết bị điện tử thông minh và thiết bị chống trộm xe máy với sự cam
                                    kết về chất lượng, tính tiện ích và sự đổi mới.
                                </p>
                            </div>

                            <div className="col-lg-3 col-md-5 col-5 mx-lg-auto">
                                <img
                                    src="images/sharing-design-ideas-with-family.jpg"
                                    className="about-image about-image-small img-fluid"
                                    alt=""
                                    loading="lazy"
                                />
                            </div>

                            <div className="col-lg-4 col-md-7 col-7">
                                <img
                                    src="images/living-room-interior-wall-mockup-warm-tones-with-leather-sofa-which-is-kitchen-3d-rendering.jpg"
                                    className="about-image img-fluid"
                                    alt=""
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="featured-section section-padding">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-12">
                                <div className="custom-block featured-custom-block">
                                    <h2 className="mt-2 mb-4">Giờ mở cửa</h2>

                                    <div className="d-flex">
                                        <i className="featured-icon bi-clock me-3"></i>

                                        <div>
                                            <p className="mb-2">
                                                Thứ 2 - Thứ 7<strong className="d-inline">8:00 AM 17:00 PM</strong>
                                            </p>

                                            <p>Sunday ~ Nghĩ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="shop-section section-padding" id="section_3">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-12">
                                <small className="section-small-title">Cửa hàng iky</small>

                                <h2 className="mt-2 mb-4">
                                    <span className="tooplate-red">Giới thiệu </span> sản phẩm
                                </h2>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="shop-thumb">
                                    <div className="shop-image-wrap">
                                        <Link to="/">
                                            <img
                                                src={product1}
                                                className="shop-image img-fluid"
                                                alt=""
                                                loading="lazy"
                                            />
                                        </Link>

                                        <div className="shop-icons-wrap">
                                            <div className="shop-icons d-flex flex-column align-items-center">
                                                <Link to="/" className="shop-icon bi-heart"></Link>

                                                <Link to="/" className="shop-icon bi-bookmark"></Link>
                                            </div>

                                            <p className="shop-pricing mb-0 mt-3"></p>
                                        </div>

                                        <div className="shop-btn-wrap">
                                            <Link
                                                to="/"
                                                className="shop-btn custom-btn btn d-flex align-items-center align-items-center"
                                            >
                                                Learn more
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="shop-body">
                                        <h4>Giải pháp điện thông minh</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-12">
                                <div className="shop-thumb">
                                    <div className="shop-image-wrap">
                                        <Link to href="/">
                                            <img
                                                src={product2}
                                                className="shop-image img-fluid"
                                                alt=""
                                                loading="lazy"
                                            />
                                        </Link>

                                        <div className="shop-icons-wrap">
                                            <div className="shop-icons d-flex flex-column align-items-center">
                                                <Link to="/" className="shop-icon bi-heart"></Link>

                                                <Link to="/" className="shop-icon bi-bookmark"></Link>
                                            </div>

                                            {/* <p className="shop-pricing mb-0 mt-3">
                                                <span className="badge custom-badge">$6,400</span>
                                            </p> */}
                                        </div>

                                        <div className="shop-btn-wrap">
                                            <Link
                                                to="/"
                                                className="shop-btn custom-btn btn d-flex align-items-center align-items-center"
                                            >
                                                Learn more
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="shop-body">
                                        <h4>Giải pháp điện xe máy</h4>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="col-lg-12 col-12">
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination justify-content-center">
                                        <li className="page-item">
                                            <a className="page-link" href="#" aria-label="Previous">
                                                <span aria-hidden="true">&laquo;</span>
                                            </a>
                                        </li>

                                        <li className="page-item active" aria-current="page">
                                            <a className="page-link" href="#">
                                                1
                                            </a>
                                        </li>

                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                2
                                            </a>
                                        </li>

                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                3
                                            </a>
                                        </li>

                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                4
                                            </a>
                                        </li>

                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                5
                                            </a>
                                        </li>

                                        <li className="page-item">
                                            <a className="page-link" href="#" aria-label="Next">
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div> */}
                        </div>
                    </div>
                </section>

                {/* review */}
                {/* <section className="reviews-section section-padding pb-0" id="section_4">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-12">
                                <small className="section-small-title">Happy customers.</small>

                                <h2 className="mt-2 mb-4">Reviews</h2>

                                <div className="owl-carousel reviews-carousel">
                                    <div className="reviews-thumb">
                                        <div className="reviews-body">
                                            <h4>Moso Interior is the most suitable website layout.</h4>
                                        </div>

                                        <div className="reviews-bottom reviews-bottom-up d-flex align-items-center">
                                            <img
                                                src="images/avatar/pretty-blonde-woman-wearing-white-t-shirt.jpg"
                                                className="avatar-image img-fluid"
                                                alt=""
                                            />

                                            <div className="d-flex align-items-center justify-content-between flex-wrap w-100 ms-3">
                                                <p className="text-white mb-0">
                                                    <strong>Sandy</strong>, <small>CEO</small>
                                                </p>

                                                <div className="reviews-icons">
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="reviews-thumb">
                                        <div className="reviews-body">
                                            <h4>Explore more HTML Templates to download for your website.</h4>
                                        </div>

                                        <div className="reviews-bottom reviews-bottom-up d-flex align-items-center">
                                            <img
                                                src="images/avatar/studio-portrait-emotional-happy-funny-smiling-boyfriend-man-with-heavy-beard-stands-with-arms-crossed-dressed-red-t-shirt-isolated-blue.jpg"
                                                className="avatar-image img-fluid"
                                                alt=""
                                            />

                                            <div className="d-flex align-items-center justify-content-between flex-wrap w-100 ms-3">
                                                <p className="text-white mb-0">
                                                    <strong>Jack</strong>, <small>Partner</small>
                                                </p>

                                                <div className="reviews-icons">
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star"></i>
                                                    <i className="bi-star"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="reviews-thumb">
                                        <div className="reviews-body">
                                            <h4>Please recommend Tooplate website to your friends.</h4>
                                        </div>

                                        <div className="reviews-bottom reviews-bottom-up d-flex align-items-center">
                                            <img
                                                src="images/avatar/portrait-beautiful-young-woman-standing-grey-wall.jpg"
                                                className="avatar-image img-fluid"
                                                alt=""
                                            />

                                            <div className="d-flex align-items-center justify-content-between flex-wrap w-100 ms-3">
                                                <p className="text-white mb-0">
                                                    <strong>Helen</strong>, <small>Client</small>
                                                </p>

                                                <div className="reviews-icons">
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="reviews-thumb">
                                        <div className="reviews-body">
                                            <h4>This Bootstrap 5 layout is free to use for your website.</h4>
                                        </div>

                                        <div className="reviews-bottom reviews-bottom-up d-flex align-items-center">
                                            <img
                                                src="images/avatar/portrait-young-redhead-bearded-male-wears-white-t-shirt-keeps-his-eyes-closed-smiling-feels-happy-yellow.jpg"
                                                className="avatar-image img-fluid"
                                                alt=""
                                            />

                                            <div className="d-flex align-items-center justify-content-between flex-wrap w-100 ms-3">
                                                <p className="text-white mb-0">
                                                    <strong>Bill</strong>, <small>Designer</small>
                                                </p>

                                                <div className="reviews-icons">
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star"></i>
                                                    <i className="bi-star"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="reviews-thumb">
                                        <div className="reviews-body">
                                            <h4>Thank you for visiting Tooplate to download free templates.</h4>
                                        </div>

                                        <div className="reviews-bottom reviews-bottom-up d-flex align-items-center">
                                            <img
                                                src="images/avatar/portrait-young-beautiful-woman-gesticulating.jpg"
                                                className="avatar-image img-fluid"
                                                alt=""
                                            />

                                            <div className="d-flex align-items-center justify-content-between flex-wrap w-100 ms-3">
                                                <p className="text-white mb-0">
                                                    <strong>Susan</strong>, <small>Boss</small>
                                                </p>

                                                <div className="reviews-icons">
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                    <i className="bi-star-fill"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 col-12">
                                    <p className="d-flex justify-content-center align-items-center mt-lg-5">
                                        Write some reviews on{' '}
                                        <a href="#" className="custom-btn btn ms-3">
                                            <i className="bi-facebook me-2"></i>facebook
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                <div id="section_5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path
                            fill="#f9f9f9"
                            fillOpacity="1"
                            d="M0,96L40,117.3C80,139,160,181,240,186.7C320,192,400,160,480,149.3C560,139,640,149,720,176C800,203,880,245,960,250.7C1040,256,1120,224,1200,229.3C1280,235,1360,277,1400,298.7L1440,320L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
                        ></path>
                    </svg>
                    <Row justify="center" align="middle" className="container">
                        <Col span={24}>
                            <small className="section-small-title">Đặt câu hỏi cho chúng tôi</small>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form layout="vertical" className="custom-form contact-form">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Họ"
                                            name="firstName"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                                        >
                                            <Input placeholder="Họ" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Tên"
                                            name="lastName"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                        >
                                            <Input placeholder="Tên" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ type: 'email', required: true, message: 'Vui lòng nhập email hợp lệ!' }]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <Form.Item label="Tin nhắn" name="message">
                                    <Input.TextArea rows={6} placeholder="Tôi cần hỗ trợ?" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Gửi
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>

                        <Col xs={24} md={12} className="mt-5 mt-md-0">
                            <div className="custom-block">
                                <h3 className="text-white mb-2">Công ty IKY</h3>
                                <p className="text-white mb-2">
                                    <PhoneOutlined className="contact-icon me-1" />
                                    <a href="tel:0902806999" className="text-white">
                                        0902 806 999
                                    </a>
                                </p>
                                <p className="text-white mb-2">
                                    <MailOutlined className="contact-icon me-1" />
                                    <a href="mailto:iky.cskh@gmail.com" className="text-white">
                                        iky.cskh@gmail.com
                                    </a>
                                </p>
                                <iframe
                                    className="google-map mt-2"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.685011261677!2d106.60689267586862!3d10.758741359517987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c371d880a19%3A0x5e918ea653425888!2zMTMgxJAuIELDrG5oIFRy4buLIMSQw7RuZywgQsOsbmggVHLhu4sgxJDDtG5nLCBCw6xuaCBUw6JuLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1729562349249!5m2!1svi!2s"
                                    height="220"
                                    width="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </Col>
                    </Row>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path
                            fill="#36363e"
                            fillOpacity="1"
                            d="M0,96L40,117.3C80,139,160,181,240,186.7C320,192,400,160,480,149.3C560,139,640,149,720,176C800,203,880,245,960,250.7C1040,256,1120,224,1200,229.3C1280,235,1360,277,1400,298.7L1440,320L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </main>

            <footer className="site-footer section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-5 col-12 mb-3">
                            <h3>
                                <Link to="/" className="custom-link mb-1">
                                    Công ty IKY
                                </Link>
                            </h3>

                            <p className="text-white">
                                Thành lập 2014 mang đến các giải pháp về điện thông minh và điện xe máy
                            </p>
                        </div>

                        <div className="col-lg-3 col-md-3 col-12 ms-lg-auto mb-3">
                            <h3 className="text-white mb-3">Store</h3>

                            <p className="text-white mt-2">
                                <i className="bi-geo-alt"></i>
                                13 Đường 23A, P. Bình Trị Đông B, Q. Bình Tân, Tp. Hồ Chí Minh.
                            </p>
                        </div>

                        <div className="col-lg-3 col-md-4 col-12 mb-3">
                            <h3 className="text-white mb-3">Thông tin liên hệ</h3>

                            <p className="text-white mb-1">
                                <i className="bi-telephone me-1"></i>

                                <a href="tel: 090-080-0760" className="text-white">
                                    0902 806 999
                                </a>
                            </p>

                            <p className="text-white mb-0">
                                <i className="bi-envelope me-1"></i>

                                <a href="mailto:info@company.com" className="text-white">
                                    iky.cskh@gmail.com
                                </a>
                            </p>
                        </div>

                        <div className="col-lg-6 col-md-7 copyright-text-wrap col-12 d-flex flex-wrap align-items-center mt-4 ms-auto">
                            <p className="copyright-text mb-0 me-4">
                                Copyright © 2024 Công Ty Cổ Phần Công Nghệ Tiện Ích Thông Minh
                            </p>

                            <ul className="social-icon">
                                <li className="social-icon-item">
                                    <Link to="/" className="social-icon-link social-icon-twitter bi-twitter"></Link>
                                </li>

                                <li className="social-icon-item">
                                    <Link to="/" className="social-icon-link social-icon-facebook bi-facebook"></Link>
                                </li>

                                <li className="social-icon-item">
                                    <Link to="/" className="social-icon-link social-icon-instagram bi-instagram"></Link>
                                </li>

                                <li className="social-icon-item">
                                    <Link to="/" className="social-icon-link social-icon-pinterest bi-pinterest"></Link>
                                </li>

                                <li className="social-icon-item">
                                    <Link to="/" className="social-icon-link social-icon-whatsapp bi-whatsapp"></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Home;
