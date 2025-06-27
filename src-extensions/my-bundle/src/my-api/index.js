export default (router,{services,database},context) => {
	const { ItemsService } = services;


// 	router.get('/', (req, res) => {

// 		// const id = req.params.id;
// 		// res.send(`Hello, ${id}`);

// 		const { fields} = req.query;
// 		if (!fields) {
// 			return res.status(400).send('Missing required query parameter: fields');
// 		}

// const url = new URL(`https://directusbackend-production.up.railway.app/items/reviews`);
// url.searchParams.append('fields', fields);
// 		// Add query parameters
// 		// const params = {
// 		//     fields: `${filter}`,
		    
// 		// };
// 		// url.search = new URLSearchParams(params).toString();
		
// 		// Headers
// 		const headers = {
// 			// 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
// 			'Content-Type': 'application/json',
// 			'Accept': 'application/json',
// 		};
		
// 		// Make the API request
// 		const request =  fetch(url, {
			
// 			method: `GET`, // HTTP method
// 			headers: headers, // Headers
// 		})
		
// 		.then(response => {
// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}
// 			return response.json(); // Parse the JSON response
// 		})
// 		.then(data => {
// 			console.log('Success:', res.send(data)); // Handle the response data
// 		})
// 		.catch(error => {
// 			console.error('Error:', error); // Handle errors
// 		});
		


// 	});
	// router.get('/', async (req, res) => {
	// 	req.send("this is the errore");
	// })

	// router.get('/product-list-raw-dbaccess-test/', async (req, res) => {
	// 	//access the table products in old db way - Directus uses KNEX https://knexjs.org/
	// 	let products = await database(`products`);
	// 	res.send({data:products});
	// });

	// router.get('/product-list-item-service-api-test', async (req, res) => {
	// 	//access the products using ItemService
	// 	//this will trigger all flows and hooks attached to this collection

	// 	let productsService = new ItemsService('products',{schema:req.schema,accountability:req.accountability});
	// 	//filter documentation
	// 	//fields is array of fields to return can be * for all
	// 	//for foreign fields use supplier.* to get all fields from supplier of product
		
	// 	let products = await productsService.readByQuery({fields:["id","name"],filter:{}});
	// 	res.send({data:products});

	// });

// 		router.get('/polar',async (req,res)=>{

// 			const {name, age, hobby} = req.params;

// 			res.send(`hello ${name} your age is ${age} your hobby is ${hobby}`);

// // 			// const  {email} = req.params;
// // 			// res.send( `hello ${email}`);
// // 			// const {method} = req.params

// // 			// const method = req.params.method;


// 		});
router.get('/bad-request', (req, res) => {
	
req.send("your fine by me");

})
};
