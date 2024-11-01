import React, { useEffect, useState } from 'react';
import './CarList.scss';
import { IoMdClose } from 'react-icons/io';

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [receivedCustomers, setReceivedCustomers] = useState([]);
    const [returnCar, setReturnCar] = useState([]);
    const [showContainer, setShowContainer] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    useEffect(() => {
        document.title = 'Bảng hiển thị thông tin';
        fetch('/data.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setCars(data.cars);
                setReceivedCustomers(data.receivedCustomers);
                setReturnCar(data.return);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = formatDate(now);
            const formattedTime = formatTime(now);
            setCurrentDate(formattedDate);
            setCurrentTime(formattedTime);
        };

        updateDateTime();

        const intervalId = setInterval(updateDateTime, 60000);

        return () => clearInterval(intervalId);
    }, []);

    if (!showContainer) return null;

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div id="container">
            <div className="notification">
                <p>Bảng hiển thị thông tin</p>
                <IoMdClose className="close-icon" onClick={() => setShowContainer(false)} />
            </div>

            <div className="header">
                <div className="header-content-left">Kính chào quý khách</div>
                <div className="header-content-right">
                    <p id="current-date" className="date-time">
                        {currentDate}
                    </p>
                    <p id="current-time" className="date-time">
                        <span className="time">{currentTime}</span>
                    </p>
                </div>
            </div>
            <div className="active">
                <p className="table-active">DANH SÁCH BÀN NÂNG ĐANG HOẠT ĐỘNG</p>
            </div>
            <div id="table">
                <div id="table-head" className="table-row">
                    <span>BIỂN SỐ XE</span>
                    <span>KHÁCH HÀNG</span>
                    <span>TRẠNG THÁI</span>
                    <span>THỜI GIAN SỬA</span>
                    <span>THỜI GIAN CÒN LẠI</span>
                    <span>KĨ THUẬT VIÊN</span>
                </div>
                {cars.map((car, index) => (
                    <div className="body-row table-row" key={index}>
                        <span className="LICENSE-PLATE">{car.licensePlate}</span>
                        <span className="Customer">{car.customer}</span>
                        <span className="Status">{car.status}</span>
                        <span className="Customer">{car.timeSpent}</span>
                        <span className="Status">{car.timeLeft}</span>
                        <span className="Customer">{car.technician}</span>
                    </div>
                ))}
            </div>
            <div className="table-bottom">
                <div className="list-received-customer">
                    <div className="list-received-customer-content">DANH SÁCH KH ĐÃ TIẾP NHẬN</div>

                    <div className="table1">
                        <div className="table-head table-row">
                            <span>KHÁCH HÀNG</span>
                            <span>BIỂN SỐ XE</span>
                            <span>THỜI GIAN</span>
                        </div>
                        {receivedCustomers.map((customer, index) => (
                            <div className="body-row table-row" key={index}>
                                <span className="Customer">{customer.customer}</span>
                                <span className="LICENSE-PLATE">{customer.licensePlate}</span>
                                <span className="Customer">{customer.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="list-car-return">
                    <div className="list-received-customer-content">DANH SÁCH KH ĐÃ TRẢ XE</div>
                    <div className="table2">
                        <div className="table-head table-row">
                            <span>KHÁCH HÀNG</span>
                            <span>BIỂN SỐ XE</span>
                            <span>THỜI GIAN</span>
                        </div>
                        {returnCar.map((items, index) => (
                            <div className="body-row table-row" key={index}>
                                <span className="Customer">{items.customer}</span>
                                <span className="LICENSE-PLATE">{items.licensePlate}</span>
                                <span className="Customer">{items.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bye">
                <p className="content">KÍNH CHÀO QUÝ KHÁCH</p>
            </div>
        </div>
    );
};

export default CarList;
