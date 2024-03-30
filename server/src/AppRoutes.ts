enum ROUTE {
	USER_REGISTRATION = '/user/registration',
	USER_LOGIN = '/user/login',
	USER_CHANGE_IMAGE = '/user/changeImg',
	USER_AUTH = '/user/verifyToken',

	CART_ADD_PRODUCT = '/cart/addProduct',
	CART_REMOVE_PRODUCT = '/cart/removeProduct',
	CART_GET_ALL = '/cart/',

	DEVICE_CREATE = '/device/create',
	DEVICE_GET_ALL = '/device/',
	DEVICE_GET_BY_ID = '/device/:id',

	RATING_CREATE = '/rating/create',
	RATING_GET_BY_USER = '/rating',

	CATEGORY_CREATE = '/category/create',
	CATEGORY_GET_ALL = '/category',

	BRAND_CREATE = '/brand/create',
	BRAND_GET_ALL = '/brand',
}

export default ROUTE
