# Foodmate Api Spec

## 驗證

### 登入

route: /v1/login

method: post

#### Request

{
  "phoneNumber": string,
  "password": string 
}

#### Response

{
  success: boolean,
  data: {
    uid: number,
    rate: number,
    email: string,
    phone_number" string,
    gender": string,
    job_title: string,
    soul_food: string,
    info: string,
    photo_url: string,
    created_at: date string,
    updated_at: date string,
    is_notification: boolean,
    is_camera: string,
    is_album: boolean
  }
}

## 使用者

### register user

route: /v1/users

method: post

### Header

Null

#### Request

{
  "rate": number,
  "email": string,
  "password": string,
  "phone_number": string,
  "display_name": string,
  "gender": string,
  "job_title": string,
  "soul_food": "string,
  "info": string,
  "photo_url": string,
  "is_notification": boolean,
  "is_camera": boolean,
  "is_album": boolean,
  "disabled": boolean
}

#### Response

{
  success: boolean,
  data: {
    uid: number
  }
}

## 取回自己的資訊

route: /v1/users

method: get

### Header

Authorization: string

#### Request

Null

#### Response

{
  success: boolean,
  data: {
    uid: number,
    "rate": number,
    "email": string,
    "password": string,
    "phone_number": string,
    "display_name": string,
    "gender": string,
    "job_title": string,
    "soul_food": "string,
    "info": string,
    "photo_url": string,
    "is_notification": boolean,
    "is_camera": boolean,
    "is_album": boolean,
    "disabled": boolean
  }
}

## 編輯自己的資訊

route: /v1/users

method: put

### Header

Authorization: string

#### Request

{
  "rate": number,
  "email": string,
  "password": string,
  "phone_number": string,
  "display_name": string,
  "gender": string,
  "job_title": string,
  "soul_food": "string,
  "info": string,
  "photo_url": string,
  "is_notification": boolean,
  "is_camera": boolean,
  "is_album": boolean,
  "disabled": boolean
}

#### Response

{
  success: boolean,
  data: {
    uid: number,
    "rate": number,
    "email": string,
    "password": string,
    "phone_number": string,
    "display_name": string,
    "gender": string,
    "job_title": string,
    "soul_food": "string,
    "info": string,
    "photo_url": string,
    "is_notification": boolean,
    "is_camera": boolean,
    "is_album": boolean,
    "disabled": boolean
  }
}

## 活動

### create Event

route: /v1/events

method: post

### Header

Authorization: token

#### Request

{
  logo: string,
  name: string,
  event_date: date string,
  validate_date: date string,
  tags: array(string),
  owner_id: number,
  owner_name: string,
  max_member: number,
  member_count: number,
  payment_method: string,
  budget: number,
  google_json: json string,
  address: string,
  description: string
}

#### Response

{
  success: boolean,
  data: {
    event_id: number
  }
}

## 活動列表

route: /v1/events

method: get

### Header

Authorization: token

### Request (query string)

{
  start_date: date string,
  end_date: date string,
}

### Response


{
  success: boolean,
  data: {
    events: [
      {
        event_id: number,
        logo: string,
        name: string,
        created_at: date string,
        tags: array,
        owner_id: number,
        owner_name: string
      }
    ]
  }
}

## 活動詳情

route: /v1/events/${event_id}

method: get

### Header

Authorization: token

### Request (query string)

{}

### Response

{
  success: boolean,
  data: {
    event_id: number,
    logo: string,
    name: string,
    event_date: date string,
    validate_date: date string,
    tags: array(string),
    owner_id: number,
    owner_name: string,
    max_member: number,
    member_count: number,
    payment_method: string,
    budget: number,
    google_json: json string,
    address: string,
    description: string
  }
}

## 編輯活動詳情

route: /v1/events/${event_id}

method: put

### Header

Authorization: token

### Request (query string)

{
    event_id: number,
    logo: string,
    name: string,
    event_date: date string,
    validate_date: date string,
    tags: array(string),
    owner_id: number,
    owner_name: string,
    max_member: number,
    member_count: number,
    payment_method: string,
    budget: number,
    google_json: json,
    address: string,
    description: string
}

### Response

{
  success: boolean,
  data: {
    event_id: number,
    logo: string,
    name: string,
    event_date: date string,
    validate_date: date string,
    tags: array(string),
    owner_id: number,
    owner_name: string,
    max_member: number,
    member_count: number,
    payment_method: string,
    budget: number,
    google_json: json string,
    address: string,
    description: string
  }
}

## 刪除活動

route: /v1/events/${event_id}

method: delete

### Header

Authorization: token

### Request (query string)

{}

### Response

{
  success: boolean
}


##  參加活動

route: /v1/events/${event_id}/members

method: post

### Header

Authorization: token

### Request

{
  comment: string
}

### Response

{
  success: true
}

## 新增黑名單

route: /v1/block/users

method: post

### Header

Authorization: string

#### Request

{
  uid: number
}

#### Response

{
  success: boolean
}

## 刪除黑名單

route: /v1/block/users

method: delete

### Header

Authorization: string

#### Request

{
  uid: number
}

#### Response

{
  success: boolean
}

## 黑名單列表


route: /v1/block/users

method: get

### Header

Authorization: string

#### Request

{}

#### Response

{
  success: boolean,
  data: [
    {
      uid: number,
      "rate": number,
      "email": string,
      "password": string,
      "phone_number": string,
      "display_name": string,
      "gender": string,
      "job_title": string,
      "soul_food": "string,
      "info": string,
      "photo_url": string,
      "is_notification": boolean,
      "is_camera": boolean,
      "is_album": boolean,
      "disabled": boolean
    }
  ]
}

##