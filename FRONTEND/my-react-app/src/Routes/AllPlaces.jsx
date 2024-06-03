import React from 'react';

import PlaceList from '../Components/PlaceList';

const Dummy_Places = [
  {
    id: '1',
    title: 'Taj Mahal',
    description: 'Elegant',
    imageURL: 'https://res.cloudinary.com/sagacity/image/upload/c_crop,h_2814,w_4241,x_0,y_0/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/shutterstock_400068991_qpukq2.jpg',
    address: 'Agra',
    location: 'Number One, Maan Singh Rd, Man Singh Road Area, New Delhi, Delhi 110011',
    creator: '1',
  },
  {
    id: '2',
    title: 'Taj Mahallllllllll',
    description: 'Elegant',
    imageURL: 'https://res.cloudinary.com/sagacity/image/upload/c_crop,h_2814,w_4241,x_0,y_0/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/shutterstock_400068991_qpukq2.jpg',
    address: 'Agra',
    location: 'Number One, Maan Singh Rd, Man Singh Road Area, New Delhi, Delhi 110011',
    creator: '2',
  }
]

const UserPlaces = () => {


  return (
    <PlaceList items={Dummy_Places} />
  )
}

export default UserPlaces;