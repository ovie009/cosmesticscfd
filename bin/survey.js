
	// users
	const users = [
		{
			"full_name": "John Smith",
			"email": "john.smith@example.com"
		},
		{
			"full_name": "Emily Johnson",
			"email": "emily.johnson@example.com"
		},
		{
			"full_name": "Michael Brown",
			"email": "michael.brown@example.com"
		},
		{
			"full_name": "Emma Davis",
			"email": "emma.davis@example.com"
		},
		{
			"full_name": "Daniel Wilson",
			"email": "daniel.wilson@example.com"
		},
		{
			"full_name": "Olivia Martinez",
			"email": "olivia.martinez@example.com"
		},
		{
			"full_name": "William Anderson",
			"email": "william.anderson@example.com"
		},
		{
			"full_name": "Sophia Taylor",
			"email": "sophia.taylor@example.com"
		},
		{
			"full_name": "Alexander Thomas",
			"email": "alexander.thomas@example.com"
		},
		{
			"full_name": "Isabella Jackson",
			"email": "isabella.jackson@example.com"
		}
	];

	const prouctList = [
		{"id": "5n5yLG7G6kPL0hwbGLMo", "name": "Acrofresh"},
		{"id": "fBU97MyhjxUTrJYoMJiI", "name": "African Baby Care"},
		{"id": "Parj8XKJYpKRsKyjPUiy", "name": "Arashi No Umi"},
		{"id": "kf9vkQFKkxgn7fi4znCo", "name": "Beauty Works 10-in-1 Spray"},
		{"id": "YApinBmg1L7q9JxurH4r", "name": "Beauty of Joeseon"},
		{"id": "vOKWweJwpxCnwNce4Zcx", "name": "Billie Eilish Eilish"},
		{"id": "vfWzU0fEfh3xNLbYJINF", "name": "Bubble Moisturizer"},
		{"id": "bLDn9ulMCR7ARDcINkj1", "name": "Chamomile Cleansing Balm"},
		{"id": "z9aydjsmRuGytwNRdpKL", "name": "Curve Case Light"},
		{"id": "oMntOfFhkhQkNdpKquUj", "name": "Dipbrow Pomade"},
		{"id": "hjzmB9jy722p4jDNobJA", "name": "Dove Deep Moisture Body Wash"},
		{"id": "BAPda2kJ8jbVTOi8hYwb", "name": "Eye Shadow Palette Vault"},
		{"id": "vE4gXyQ5IVSE93cPyIgH", "name": "Floral Street Wonderland Peony"},
		{"id": "Myp6hzcOrRhjwtBcUsDb", "name": "Gillete Women's Shave Gel"},
		{"id": "CMVlzdqhapqiFsu9Cyzu", "name": "Gleem Electric Toothbrush"},
		{"id": "5JY7Gcv47ZMpGbdQkXUW", "name": "Glow Hub Facial Serum"},
		{"id": "F59DQrOArQmV5hHnYeuj", "name": "Hairtamin"},
		{"id": "rumet00Mg7IIAEjTEGY3", "name": "Laneige Sleeping Mask"},
		{"id": "u9aw0BBF0DvgUUOJ3WwV", "name": "Listerine Anticavity Mouthwash"},
		{"id": "7ZhV3QEtXLW84vZfJpwR", "name": "Micro Sketch Brow Pencil"},
		{"id": "42yCZN8ycMNXVqNro600", "name": "Mielle Organics Rosemary Mint Growth Oil Trio"},
		{"id": "9qZM3pvpTpMAmb2MScFm", "name": "Miracle Smile Water Flosser"},
		{"id": "Up4Ma80wZDZAJOyJoZUh", "name": "Nude 42 Palette Duo"},
		{"id": "f1RgU4L1QmcqXC2Ctm1t", "name": "Olaplex Daily Essential Duo"},
		{"id": "CB1bvBdzTKnLTmefoD3h", "name": "Oral B Cool Mint Dental Floss"},
		{"id": "bhCFqYxenp3w1NTV6Nyj", "name": "Peter Thomas Roth"},
		{"id": "fxerngFRPbA3CJyIoqNx", "name": "Sol De Janeiro"},
		{"id": "f9zx0s3qCGee7Z7ktGV1", "name": "Sol Leave In Condiioner"},
		{"id": "e3CULC0lvBpGjrJvB0K8", "name": "Widly Me"}
	];

	const generateRandomAnswers = () => {
		let randomAnswers = [];
		
		surveyQuestions.forEach(question => {
			let randomIndex = Math.floor(Math.random() * question.options.length);
			let randomOption = question.options[randomIndex];
			
			let answer = {
				questionId: question.id,
				answer: {
					text: randomOption.text,
					value: randomOption.value
				}
			};
			
			randomAnswers.push(answer);
		});
		
		return randomAnswers;
	}

	useEffect(() => {
		// funtion to send data to db
		const submitSurvey = async () => {
			try {
				setIsLoading(true);
				// upload data to surveys collection
				const surveysRef = collection(database, "surveys");

				const randomUser = users[Math.floor(Math.random() * users.length)];

				const randomProductId = productsId[Math.floor(Math.random() * productsId.length)];

				await addDoc(surveysRef, {
					full_name: randomUser.full_name,
					email: randomUser.email,
					product_id: randomProductId,
					data: generateRandomAnswers(),
					created_at: serverTimestamp(),
					edited_at: serverTimestamp(),
				})

				console.log('data inserted successfully');
				// open success modal
				// openModal();
				
			} catch (error) {
				console.log("error uploading survey", error.message);
			} finally {
				// disable button loading state
				setIsLoading(false);
			}
		}

		// setTimeout(() => {
		// 	submitSurvey().catch(error => {
		// 		console.log("error submitting survey", error.message);
		// 	})
		// }, 3000);
	}, []);

	
	// products id
	const products = [
		{"id": "fBU97MyhjxUTrJYoMJiI", "name": "African Baby Care"},
		{"id": "Parj8XKJYpKRsKyjPUiy", "name": "Arashi No Umi"},
		{"id": "kf9vkQFKkxgn7fi4znCo", "name": "Beauty Works 10-in-1 Spray"},
		{"id": "YApinBmg1L7q9JxurH4r", "name": "Beauty of Joeseon"},
		{"id": "vOKWweJwpxCnwNce4Zcx", "name": "Billie Eilish Eilish"},
		{"id": "vfWzU0fEfh3xNLbYJINF", "name": "Bubble Moisturizer"},
		{"id": "bLDn9ulMCR7ARDcINkj1", "name": "Chamomile Cleansing Balm"},
		{"id": "z9aydjsmRuGytwNRdpKL", "name": "Curve Case Light"},
		{"id": "oMntOfFhkhQkNdpKquUj", "name": "Dipbrow Pomade"},
		{"id": "hjzmB9jy722p4jDNobJA", "name": "Dove Deep Moisture Body Wash"},
		{"id": "BAPda2kJ8jbVTOi8hYwb", "name": "Eye Shadow Palette Vault"},
		{"id": "vE4gXyQ5IVSE93cPyIgH", "name": "Floral Street Wonderland Peony"},
		{"id": "Myp6hzcOrRhjwtBcUsDb", "name": "Gillete Women's Shave Gel"},
		{"id": "CMVlzdqhapqiFsu9Cyzu", "name": "Gleem Electric Toothbrush"},
		{"id": "5JY7Gcv47ZMpGbdQkXUW", "name": "Glow Hub Facial Serum"},
		{"id": "F59DQrOArQmV5hHnYeuj", "name": "Hairtamin"},
		{"id": "rumet00Mg7IIAEjTEGY3", "name": "Laneige Sleeping Mask"},
		{"id": "u9aw0BBF0DvgUUOJ3WwV", "name": "Listerine Anticavity Mouthwash"},
		{"id": "7ZhV3QEtXLW84vZfJpwR", "name": "Micro Sketch Brow Pencil"},
		{"id": "42yCZN8ycMNXVqNro600", "name": "Mielle Organics Rosemary Mint Growth Oil Trio"},
		{"id": "9qZM3pvpTpMAmb2MScFm", "name": "Miracle Smile Water Flosser"},
		{"id": "Up4Ma80wZDZAJOyJoZUh", "name": "Nude 42 Palette Duo"},
		{"id": "f1RgU4L1QmcqXC2Ctm1t", "name": "Olaplex Daily Essential Duo"},
		{"id": "CB1bvBdzTKnLTmefoD3h", "name": "Oral B Cool Mint Dental Floss"},
		{"id": "bhCFqYxenp3w1NTV6Nyj", "name": "Peter Thomas Roth"},
		{"id": "fxerngFRPbA3CJyIoqNx", "name": "Sol De Janeiro"},
		{"id": "f9zx0s3qCGee7Z7ktGV1", "name": "Sol Leave In Condiioner"},
		{"id": "e3CULC0lvBpGjrJvB0K8", "name": "Widly Me"}
	];

	const [uploadCount, setUploadCount] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setUploadCount(prevCount => prevCount + 1);
		}, 5000);
	
		return () => {
			clearInterval(interval);
		};

	}, []);

	useEffect(() => {
		// funtion to send data to db
		const submitSurvey = async () => {
			try {
				setIsLoading(true);
				// upload data to surveys collection
				const surveysRef = collection(database, "surveys");

				const randomUser = users[Math.floor(Math.random() * users.length)];

				const randomProduct = products[Math.floor(Math.random() * products.length)];

				await addDoc(surveysRef, {
					full_name: randomUser.full_name,
					email: randomUser.email,
					product_id: randomProduct.id,
					product_name: randomProduct.name,
					data: generateRandomAnswers(),
					created_at: serverTimestamp(),
					edited_at: serverTimestamp(),
				})

				console.log('data inserted successfully');
				// open success modal
				// openModal();
				
			} catch (error) {
				console.log("error uploading survey", error.message);
			} finally {
				// disable button loading state
				setIsLoading(false);
			}
		}

		submitSurvey()

	}, [uploadCount]);

	console.log(uploadCount);