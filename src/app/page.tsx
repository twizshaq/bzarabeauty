"use client"

import { useState, useRef, CSSProperties, useEffect } from "react";
import { FaRegCopyright } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegFileImage } from "react-icons/fa6";
import { TbFileTypeJpg } from "react-icons/tb";
import { TbFileTypePng } from "react-icons/tb";
import { BiColor, BiFontSize } from "react-icons/bi";
import { GiComb } from "react-icons/gi";
import { PiHairDryer } from "react-icons/pi";
import Image from "next/image";
import img1 from "@/app/assests/img1.webp"
import img2 from "@/app/assests/img2.png"
import img3 from "@/app/assests/img3.png"
import img4 from "@/app/assests/img4.png"
import { NextRequest, NextResponse } from 'next/server';

export default function Bookings() {

    const [showServices, setShowServices] = useState(false);
    const [selectedService, setSelectedService] = useState("Services");
    const [customService, setCustomService] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [comments, setComments] = useState("");

    const formData = new FormData();
      formData.append("name", name);
      formData.append("contactNumber", contactNumber);
      formData.append("location", locationInput);
      formData.append("service", selectedService);
      formData.append("comments", comments);

      async function createEvent() {
        const res = await fetch('/api/create-event', {
          method: 'POST',
          body: formData,
        });
          const data = await res.json();
          console.log(data);}

  // Handler for when a time is clicked
    const handleTimeClick = (index: number) => {
      setSelectedTimeIndex(index);
    };

  // Function to toggle the state
    const toggleServices = () => {
    setShowServices(!showServices);
    };

    // Function to handle selecting a service
    const handleSelectService = (service: string) => {
    setSelectedService(service);
    setShowServices(false); // Close the service list after selecting
    };

    // Function to handle adding a custom service
    const handleAddCustomService = () => {
    if (customService.trim()) {
        setSelectedService(customService);
        setCustomService(""); // Clear the input field
        setShowServices(false); // Close the service list
    }
    };

        // month and weekday array
    const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

        const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
    };

    const handlePreviousMonth = () => {
        setCurrentDate((prevDate) => {
        const prevMonth = prevDate.getMonth() - 1;
        if (prevMonth < 0) {
            return new Date(prevDate.getFullYear() - 1, 11, 1);
        }
        return new Date(prevDate.getFullYear(), prevMonth, 1);
        });
    };

    const handleNextMonth = () => {
        setCurrentDate((prevDate) => {
        const nextMonth = prevDate.getMonth() + 1;
        if (nextMonth > 11) {
            return new Date(prevDate.getFullYear() + 1, 0, 1);
        }
        return new Date(prevDate.getFullYear(), nextMonth, 1);
        });
    };

    // Helper to add suffix to a date number
    const addDateSuffix = (day: number) => {
      if (day > 3 && day < 21) return day + "th";
      switch (day % 10) {
        case 1: return day + "st";
        case 2: return day + "nd";
        case 3: return day + "rd";
        default: return day + "th";
      }
    };

    const generateDays = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(month, year);

  const firstDay = new Date(year, month, 1);
  const adjustedWeekday = (firstDay.getDay() + 6) % 7;

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

  const totalCells = 42;
  const daysArray = [];

  // Define isSelected helper
  const isSelected = (day: number, monthNum: number, yearNum: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === yearNum &&
      selectedDate.getMonth() === monthNum &&
      selectedDate.getDate() === day
    );
  };

  const handleDayClick = (day: number, monthToSet: number, yearToSet: number) => {
    const newSelectedDate = new Date(yearToSet, monthToSet, day);
    setSelectedDate(newSelectedDate);
  };

  // Previous month days
  for (let i = 0; i < adjustedWeekday; i++) {
    const day = daysInPrevMonth - adjustedWeekday + i + 1;
    const selected = isSelected(day, prevMonth, prevYear);
    daysArray.push(
      <button
        key={`prev-${day}`}
        style={{
          opacity: 0.3,
          backgroundColor: selected ? 'rgb(255, 136, 203)' : 'rgba(0,0,0,0.3)'
        }}
        onClick={() => handleDayClick(day, prevMonth, prevYear)}
      >
        {day}
      </button>
    );
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const selected = isSelected(d, month, year);
    daysArray.push(
      <button
        key={d}
        style={{
          backgroundColor: selected ? 'rgb(255, 136, 203)' : 'rgba(0,0,0,0.3)'
        }}
        onClick={() => handleDayClick(d, month, year)}
      >
        {d}
      </button>
    );
  }

  // Next month days
  const remainingCells = totalCells - daysArray.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let i = 1; i <= remainingCells; i++) {
    const selected = isSelected(i, nextMonth, nextYear);
    daysArray.push(
      <button
        key={`next-${i}`}
        style={{
          opacity: 0.5,
          backgroundColor: selected ? 'rgb(255, 136, 203)' : 'rgba(0,0,0,0.3)'
        }}
        onClick={() => handleDayClick(i, nextMonth, nextYear)}
      >
        {i}
      </button>
    );
  }

  return daysArray;
};

    const handleUploadClick = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Limit to 3 images
      const limitedFiles = filesArray.slice(0, 3);
      setSelectedImages(limitedFiles);
    }
  };

  const getImageStyle = (index: number, total: number): CSSProperties => {
    // Base style
    let style: CSSProperties = {
      position: 'absolute',
      width: '120px',
      height: '120px',
      borderRadius: '20px',
      objectFit: 'cover',
      border: '2px solid white',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: index + 1,
    };

    if (total === 1) {
      // 1 image: centered, no rotation, no margin adjustment
    } else if (total === 2) {
      // 2 images:
      // first image: margin-left:100px; rotate(10deg)
      // second image: margin-left:-100px; rotate(-10deg)
      if (index === 0) {
        style.marginLeft = '50px';
        style.transform += ' rotate(10deg)';
      } else {
        style.marginLeft = '-50px';
        style.transform += ' rotate(-10deg)';
      }
    } else if (total === 3) {
      // 3 images:
      // first image: margin-left:130px; rotate(10deg)
      // second image: margin-left:-130px; rotate(-10deg)
      // third image: centered, no rotation, on top
      if (index === 0) {
        style.marginLeft = '70px';
        // style.marginTop = '5px';
        style.transform += ' rotate(10deg)';
      } else if (index === 1) {
        style.marginLeft = '-70px';
        // style.marginTop = '5px'; 
        style.transform += ' rotate(-10deg)';
      } else if (index === 2) {
        // Already centered, no rotation, highest z-index
        style.filter = 'drop-shadow(0px 0px 7px rgba(0, 0, 0, .8))';
        style.zIndex = 3;
      }
    }

    return style;
  };


// Format the time-header:
    // If selectedDate is null, show a default text; otherwise show e.g. "Mon Nov. 9th"
    let timeHeaderText = "No Date Selected"; // default/fallback - Changed this line
    if (selectedDate) {
      const dayOfWeek = weekDayNames[selectedDate.getDay()]; // "Sun"=0 ... "Sat"=6
      const monthNameShort = monthNames[selectedDate.getMonth()].slice(0,3); // "Jan", "Feb", ...
      const dayWithSuffix = addDateSuffix(selectedDate.getDate());
      timeHeaderText = `${dayOfWeek} ${monthNameShort}. ${dayWithSuffix}`;
    }

     // Format the time-header to show the current date if no date is selected
    useEffect(() => {
      if (!selectedDate) {
          const today = new Date();
          const dayOfWeek = weekDayNames[today.getDay()];
          const monthNameShort = monthNames[today.getMonth()].slice(0,3);
          const dayWithSuffix = addDateSuffix(today.getDate());
          timeHeaderText = `${dayOfWeek} ${monthNameShort}. ${dayWithSuffix}`;
        }
    }, [selectedDate]);

      const handleBookClick = async () => {
        if (!selectedDate || selectedTimeIndex === null) {
          alert("Please select a date and time.");
          return;
        }

      // Convert selectedTimeIndex to actual time
      // If index 0 = 8:00 AM, index increments by 30 minutes
      const startHour = 8 + Math.floor(selectedTimeIndex / 2);
      const startMinute = (selectedTimeIndex % 2 === 0) ? 0 : 30;

      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHour, startMinute, 0);

      // Let's assume the appointment lasts 1 hour:
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours(), startDateTime.getMinutes() + 60);

      // We might need to handle images. Possibly upload them to a storage (like AWS S3 or a Next.js server route)
      // For simplicity, let's send them as base64 or just names if you have a plan to handle them.
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("contactNumber", contactNumber);
      formData.append("location", locationInput);
      formData.append("service", selectedService);
      formData.append("comments", comments);
      formData.append("start", startDateTime.toISOString());
      formData.append("end", endDateTime.toISOString());

      // Append images if needed
      selectedImages.forEach((imgFile, index) => {
        formData.append(`image-${index}`, imgFile);
      });

      const response = await fetch("/api/create-event", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle error
        console.error("Failed to create event");
        alert("There was an error booking your appointment. Please try again.");
        return;
      }

      alert("Your appointment has been booked and added to the calendar!");
    };

    return (
        <div className="mainBookings">
                <div className="opts-main">
                    <div className="book-header">
                        <p>Book an</p><p>Appointment</p>
                        {/* <span className="comb-icon"><GiComb /></span> */}
                        {/* <span className="hairdryer-icon"><PiHairDryer /></span> */}
                    </div>
                    <div className="info-ctn">
                        <div className="name-num">
                            <input className="name-inpt" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                            <input className="number-inpt" type="text" placeholder="Contact" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}/>
                        </div>
                        <textarea className="location-inpt" name="" id="" placeholder="Location" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} style={{lineHeight:'18px'}}></textarea>
                        <div className={`service-list-ctn ${showServices ? "visible" : "hidden"}`}
                        style={{ display: showServices ? "flex" : "none" }}>
                            <input className="custom-service-inpt" type="text" placeholder="Custom Service" value={customService} onChange={(e) => setCustomService(e.target.value)}/>
                            <button className="add-style-btn" onClick={handleAddCustomService}>Add</button>
                            <div className="service-list">
                                <ul>
                                    {[
                                        "Boho Braids",
                                        "Boho Locs",
                                        "Fulani Braids",
                                        "Knotless Braids",
                                        "Rope twist",
                                        "Island twist",
                                        "Soft Locs",
                                        ].map((service) => (
                                        <li
                                            key={service}
                                            onClick={() => handleSelectService(service)} // Update the button text
                                            style={{ cursor: "pointer" }}>
                                            {service}
                                        </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                        <button className="services-btn" onClick={toggleServices}>
                        {selectedService}</button>
                        <textarea className="description-box" name="" id="" placeholder="Comments (optional)" value={comments} onChange={(e) => setComments(e.target.value)} style={{lineHeight:'20px'}}></textarea>
                    </div>
                    <div className="refs-ctn">
                      {selectedImages.length === 0 && (
                        <div className="ref-icons-ctn">
                            <div className="ref-icons">
                                <span style={{rotate:'-20deg'}}><TbFileTypePng /></span>
                                <span><FaRegFileImage /></span>
                                <span style={{rotate:'20deg'}}><TbFileTypeJpg /></span>
                            </div>
                            <p style={{fontSize:'1.3rem', fontWeight:'700'}}>Upload Example Images</p>
                            <p style={{ color: 'var(--accentcolor1)', fontSize:'1.1rem'}}>(Optional)</p>
                            </div>
                      )}
                        <button className="upload-btn" onClick={handleUploadClick}>Upload</button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                        />
                        <div className="image-ctn" style={{ 
                        position: 'relative', 
                        display:'flex', 
                        justifyContent:'center', 
                        alignItems:'center', 
                        marginBottom:'70px',
                        width:'350px',
                        height:'180px'
                      }}>
                        {selectedImages.map((file, index) => (
                          <img 
                            key={index} 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            style={getImageStyle(index, selectedImages.length)} 
                          />
                        ))}
                      </div>
                    </div>
                </div>
            <div className="schedule-main">
                    <div className="dates">
                        <div className="cal-date-header">
                            <div className="date-header">
                            {monthNames[currentDate.getMonth()]} <span>{currentDate.getFullYear()}</span>
                            </div>
                            <div className="header-btns">
                            <button className="header-bck-btn" onClick={handlePreviousMonth}>
                                <IoIosArrowBack />
                            </button>
                            <button className="header-fwrd-btn" onClick={handleNextMonth}>
                                <IoIosArrowForward />
                            </button>
                            </div>
                        </div>
                        {/* Weekday headers */}
                        <div className="week">
                            <p>Mon</p>
                            <p>Tue</p>
                            <p>Wed</p>
                            <p>Thu</p>
                            <p>Fri</p>
                            <p>Sat</p>
                            <p>Sun</p>
                        </div>

                        {/* Dynamically generate days */}
                        <div className="days-ctn">
                            {generateDays()}
                        </div>
                    </div>
                    <div className="times">
                        <div className="cal-time-header">
                            <div className="time-header">{timeHeaderText}</div>
                        </div>
                        <div className="fade-box"></div>
                        <div className="times-ctn">
                            {Array.from({ length: 18 }, (_, index) => {
                            const hour = 8 + Math.floor(index / 2);
                            const minute = index % 2 === 0 ? "00" : "30";
                            const period = hour < 12 ? "AM" : "PM";
                            const displayHour = hour > 12 ? hour - 12 : hour;
                            const isSelected = selectedTimeIndex === index;
                            return <button
                                      key={index}
                                      onClick={() => handleTimeClick(index)}
                                      style={{
                                        backgroundColor: isSelected ? 'rgb(255, 136, 203)' : 'rgba(0,0,0,0.3)',
                                      }}
                                    >
                                      {`${displayHour}:${minute} ${period}`}
                                    </button>;
                        })}
                        </div>
                        <div className="fade-box2"></div>
                    </div>
            </div>
        <button className="book-apt-btn" onClick={handleBookClick}>Book</button>
    </div>
    );
}