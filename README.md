
# HostelHive - Solution for Hostel Owners and Students

Hostel Hive is a comprehensive full-stack web platform designed to simplify hostel management for both owners and students. With a powerful stack of technologies, including Redux Toolkit, Tailwind, Razorpay, Twilio, Nodemailer, Cloudinary, Cron Jobs, MapBox, Chart.js, Formik, Yup, and Joi, it offers an enriched user experience.

Hostel owners can effortlessly add and manage multiple hostels, utilizing a map-based feature for precise property location. The platform includes user-friendly interfaces for hostel management, streamlining tasks such as handling leave requests, complaints, vacation letters, and rent payments.

For students, Hostel Hive provides a personalized interface for profile completion, letter submissions, and easy payment management. This centralized system ensures efficient hostel administration and reservations.


## Acknowledgements

I would like to express my gratitude for the following libraries and tools that have greatly contributed to the development of Hostel Hive.

 Open Source Libraries and Tools:
  - [Redux Toolkit](https://github.com/reduxjs/redux-toolkit)
  - [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)
  - [Razorpay](https://github.com/razorpay/razorpay-node)
  - [Yup](https://github.com/jquense/yup)
  - [Joi](https://github.com/sideway/joi)
  - [MapBox](https://github.com/mapbox/mapbox-gl-js)
  - [Formik](https://github.com/formium/formik)
 
Thank you to the creators and maintainers of these valuable libraries and tools for their essential contributions to the project.





 


## API Reference

### Landing Routes 

#### Get Hostel Information

```http
  GET /api/hostel-info
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `none` | `string` | for fetching the hostel Information |

#### Get Single Hostel Overview

```http
  GET /api/hostel-over-view/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | for finding the hostels using the specific Id |

#### Get Hostel Room Details

```http
POST /api/hostel-room-data/{hostelId}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `hostelId` | `string` | finding the rooms by using the hostel Id |
| `roomType` | `object` | finding the rooms by specific room types 

#### Student Signup

```http
POST /api/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `values` | `object` | User registration data |


#### Student OTP Verification

```http
POST /api/otp
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `StudentAuth` | `object` | OTP credentials |

#### Student Login

```http
POST /api/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `values` | `object` |User login data |

### Student Routes

#### Send Request Data

```http
POST /api/student/request-data/{id}/{hostelId}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |**Required**  Student ID |
| `hostelId` | `string` |**Required** Hostel ID |
| `values` | `object` |Request data |

#### Room Booking

```http
GET /api/student/room-booking
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `none` | `object` |Student room booking Details |

#### Fetch Payment Information

```http
GET /api/student/payment-data/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |**Required** Student ID |

#### Submit Payment Request

```http
POST /api/student/payment-Request
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `paymentRespone` | `object` |Payment information |

#### Payment Verification

```http
POST /api/student/payment-verification/{hostelId}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `hostelId` | `string` |**Required** Hostel ID |
| `orderId` | `string` |Order ID |
| `rentPayment` | `number` |	Rent Payment |

#### Submit Student Complaint

```http
POST /api/student/student-complaint/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |**Required** Student ID |
| `values` | `object` |**Required**Complaint data |

#### Fetch Student Complaint Data

```http
GET /api/student/student-complaint-data/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |**Required** Student ID |

#### Fetch Food Menu

```http
GET /api/student/fetch-food-menu/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |**Required** Hostel ID |

### Hostel Owner Routes

#### Hostel Admin Registration

```http
POST /api/hostel/signing
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `values` | `object` |Admin registration data


#### Verify OTP for Admin Registration

```http
POST /api/hostel/verifyOtp
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `data` | `object` |OTP verification data|


#### Hostel Admin Login

```http
POST /api/hostel/postLogin
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `values` | `object` |Admin login data|

### Super Admin Routes

#### Hostel Admin Login

```http
POST /api/admin/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `formData` | `object` |Admin login data|

#### Hostel Request Approval

```http
PATCH /api/admin/approve-hostel/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |**Required** Hostel ID|





































































## Conclusion

This API reference encompasses the routes for my MERN Stack hostel management system. It serves as a crucial guide for developers seeking to integrate, expand, and innovate within the framework. I appreciate your feedback and am open to collaboration for further enhancements.

 If you have any questions or need additional details, please don't hesitate to contact me at _dev.muhammedshifin.com_



