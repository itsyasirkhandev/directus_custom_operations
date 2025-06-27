export default (router) => {
	router.get('/', (req, res) => {
		
		return res.status(400).send({err: "something is wrong"});
	
	});


	};
