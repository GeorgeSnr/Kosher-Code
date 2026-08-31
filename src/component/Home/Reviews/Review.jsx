import React from 'react';
import userImg from '../../../Assets/user.svg';
import UserAvatar from '../../Shared/UserAvatar/UserAvatar';
import './Reviews.css';
import Fade from 'react-reveal/Fade';

const Review = ({review}) => {
    const {name, address, description, img} = review;
    return (
        <Fade bottom duration={1000} distance='40px'>
            <div className="review">
                <div className="review-avatar-wrap">
                    <UserAvatar 
                        src={img || userImg} 
                        name={name}
                        size="xl"
                        ring={true}
                        ringType="glow"
                        className="review-avatar"
                    />
                </div>
                <h5 className="testimonialName">{name}</h5>
                <h6 className="testimonialAddress">{address}</h6>
                <p><i>{description}</i></p>
            </div>
        </Fade>
    );
};

export default Review;