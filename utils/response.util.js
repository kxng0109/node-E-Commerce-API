const sendSuccess = (res, statusCode, message, data) => {
	res.status(statusCode).json({ success: true, message, data: { ...data } });
};

export default sendSuccess;
