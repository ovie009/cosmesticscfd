
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

	// products id
	const productsId =  [
		"Parj8XKJYpKRsKyjPUiy",
		"kf9vkQFKkxgn7fi4znCo",
		"YApinBmg1L7q9JxurH4r",
		"vOKWweJwpxCnwNce4Zcx",
		"vfWzU0fEfh3xNLbYJINF",
		"bLDn9ulMCR7ARDcINkj1",
		"z9aydjsmRuGytwNRdpKL",
		"oMntOfFhkhQkNdpKquUj",
		"hjzmB9jy722p4jDNobJA",
		"59LJEND5Af1WggdASPpw",
		"PcqlYgHgWZsrdh9EhXGZ",
		"BAPda2kJ8jbVTOi8hYwb",
		"bKsZcAsnuyOzNfdNmll7",
		"1vwqievT39VdnHEBoWgP",
		"vE4gXyQ5IVSE93cPyIgH",
		"Myp6hzcOrRhjwtBcUsDb",
		"CMVlzdqhapqiFsu9Cyzu",
		"5JY7Gcv47ZMpGbdQkXUW",
		"uNG7yks5UryxHsipuJc6",
		"72LjrYxNDDFFXg9LXuH8",
		"F59DQrOArQmV5hHnYeuj",
		"rumet00Mg7IIAEjTEGY3", 
		"u9aw0BBF0DvgUUOJ3WwV",
		"7ZhV3QEtXLW84vZfJpwR",
		"42yCZN8ycMNXVqNro600",
		"9qZM3pvpTpMAmb2MScFm",
		"Up4Ma80wZDZAJOyJoZUh",
		"f1RgU4L1QmcqXC2Ctm1t",
		"TGNz4YIFlfQrVYXo9xzM",
		"CB1bvBdzTKnLTmefoD3h",
		"bhCFqYxenp3w1NTV6Nyj",
		"MHsoO1GtMSvkNKrMOvqh",
		"0TfowIGtyHqC8HmhlGFI",
		"vcBSjWxAsLVqQo6e7KDd",
		"l8NP70uhhxSnc3i5ojij",
		"fxerngFRPbA3CJyIoqNx",
		"f9zx0s3qCGee7Z7ktGV1",
		"CCx1hm661McK3boyK5OJ",
		"6nxkuGCVcaM3mnCqoqzW",
		"e3CULC0lvBpGjrJvB0K8"
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