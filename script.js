const truths = [
    "What's your biggest fear?",
    "What's a secret you haven't told anyone?",
    "Have you ever lied to get out of trouble?",
];

const dares = [
    "Do 10 push-ups!",
    "Sing a song loudly!",
    "Send a funny text to a friend!",
];

let isFlipping = false; //maybe find better way

function pickCard() {
	if (isFlipping)
			return;
	isFlipping = true;

	const card = document.getElementById('card');
	const frontResult = document.getElementById('front-result');
    const backResult = document.getElementById('back-result');

	//dont do anything if card is flipped
	if (card.classList.contains('card-flipped')){
		card.classList.remove('card-flipped');
		setTimeout(() => {
			frontResult.innerText = "Draw a Card"
		}, 300);
	}
	else
	{
		setTimeout(() => {
			let randomChoice = Math.random();
			let chosenArray;
		
			if (randomChoice < 0.5)
					chosenArray = truths;
			else
				chosenArray = dares;
			let randomCard = chosenArray[Math.floor(Math.random() * chosenArray.length)];	
			
			//update the text
			frontResult.innerText = randomCard;
			backResult.innerText = randomCard;
		}, 300);
		card.classList.add('card-flipped');
	}
	
	setTimeout(() => {
		isFlipping = false;
	}, 300);

	// document.getElementById("result").innerText = randomCard;
}