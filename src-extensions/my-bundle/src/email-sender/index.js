export default (router, {services}) => {
	const {MailService} = services;
	router.get('/', (req, res) => res.send('Hello, World!'));


	router.get('/test-email', async(req,res)=>{
		let emailservice = new MailService({schema: req.schema});
	
	let mailOptions = {
		to: "yasirwebio@gmail.com",
		subject: "for testing",
		html: "testing this out for now"
	}	
		let response = await emailservice.send(mailOptions);
		return res.send(response);

	})

	router.get('/send-template-email', async(req,res)=>{
		let emailservice = new MailService({schema: req.schema});

		let mailOptions = {
			to: "yasirwebio@gmail.com",
			subject: "directus-mail",
			template: {
				name: 'my-template',
				data:{
					user_name: "yasir"
				}
			}

		}
		let response =  await emailservice.send(mailOptions);
		return res.send(response);
	})
}

	


