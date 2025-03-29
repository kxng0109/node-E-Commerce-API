const generateCartName = async(req, _res, next) =>{
	try{
		const {email, cartName} = req.user;
		if(!cartName){
			const cartName = email.split(/[^a-zA-Z0-9]+/).join("");
			req.user = {...req.user, cartName};
		}
		next();
	} catch(err){
		throw new Error(err);
	}
}

export default generateCartName;