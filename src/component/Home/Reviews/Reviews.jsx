import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import Review from './Review';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import SwiperCore, { Autoplay, Pagination } from 'swiper/core';
import Spinner from '../../Shared/Spinner/Spinner';
import { getStoredReviews, fetchReviewsAsync, subscribeToReviews } from '../../../services/storageService';

const Reviews = () => {
    SwiperCore.use([Pagination, Autoplay]);
    const [reviews, setReviews] = useState(() => getStoredReviews());

    useEffect(() => {
        // Initial fetch from Firestore
        fetchReviewsAsync()
            .then(data => {
                if (data && data.length > 0) {
                    setReviews(data);
                }
            })
            .catch(() => {
                setReviews(getStoredReviews());
            });

        // Real-time Firestore sync listener
        const unsubscribe = subscribeToReviews((cloudReviews) => {
            if (cloudReviews && cloudReviews.length > 0) {
                setReviews(cloudReviews);
            }
        });

        return () => {
            if (typeof unsubscribe === 'function') unsubscribe();
        };
    }, []);

    return (
        <section id="testimonial">
            <h4 className="miniTitle text-center">TESTIMONIALS</h4>
            <div className="text-center mb-4">
                <h3 className="sectionTitle">WHAT OUR CLIENTS SAY</h3>
            </div>
            <Col md={11} className="mx-auto">
                <Swiper 
                    pagination={{ clickable: true }}
                    slidesPerView={3}
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 3,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    spaceBetween={10}
                    >
                    
                    {
                        reviews.length === 0 ? 
                            <div className="text-center">
                                <Spinner/>
                            </div>: 
                            reviews.map((review, id) => {
                                return(
                                    <SwiperSlide key={id}>
                                        <Review review={review} key={review._id || review._key || id}/>
                                    </SwiperSlide>
                                )
                        })
                    }
                </Swiper>
            </Col>
        </section>
    );
};

export default Reviews;