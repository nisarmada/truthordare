// ======================
// 1. SLIDESHOW FUNCTIONALITY
// ======================


let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
	if (n >= slides.length)
		currentSlide = currentSlide;
	else if (n < 0)
		currentSlide = 0;
	else
		currentSlide = n;
	slides.forEach(slide => {
		slide.classList.remove('active');
	});
	//show current slide
	slides[currentSlide].classList.add('active');
	//update dots
	dots.forEach(dot => {
		dot.classList.remove('active');
	});
	dots[currentSlide].classList.add('active');
}

//nextprevious buttons event listeners
document.querySelector('.next').addEventListener('click', () => {
	showSlide(currentSlide + 1);
});
document.querySelector('.prev').addEventListener('click', () => {
	showSlide(currentSlide - 1);
});

dots.forEach((dot, index) => {
	dot.addEventListener('click', () => {
		showSlide(index);
	});
});

// ======================
// 2. GAME INITIALIZATION
// ======================

//check if user has paid
function hasPaid() {
	return localStorage.getItem('hasPaid') == true;
}

const truths = [
    "What's your biggest fear?",
    "What's a secret you haven't told anyone?",
    "Have you ever lied to get out of trouble?",
    "What's the most embarrassing thing you've done?",
    "Have you ever had a crush on someone here?",
    "What's the last lie you told?",
    "If you could switch lives with anyone for a day, who would it be?",
    "What's the worst thing you've ever done to a friend?",
    "What's one thing you're really proud of?",
    "Have you ever been caught doing something you weren't supposed to?",
    "What's the most trouble you've ever gotten into at school?",
    "Have you ever cheated in a relationship?",
    "What's the craziest thing you've done on a dare?",
    "If you could change one thing about yourself, what would it be?",
    "What’s the best advice you’ve ever received?",
    "What’s something you’ve done that you regret?",
    "Have you ever ghosted someone?",
    "What’s your most embarrassing childhood memory?",
    "What’s the most awkward thing you’ve ever said in front of someone?",
    "Who was your first crush?",
];

const dares = [
    "Do 10 push-ups!",
    "Sing a song loudly!",
    "Send a funny text to a friend!",
    "Try to lick your elbow!",
    "Do your best impression of a celebrity!",
    "Walk around the room in circles for 2 minutes!",
    "Let someone draw on your face with a marker!",
    "Act like an animal of the group’s choosing for 2 minutes!",
    "Send a silly selfie to someone in your contacts!",
    "Speak in an accent of your choice for the next 10 minutes!",
    "Wear socks on your hands for the next round!",
    "Do 20 jumping jacks in a row!",
    "Try to juggle 3 objects for 30 seconds!",
    "Let someone write a word on your forehead with a pen!",
    "Let someone post something funny on your social media!",
    "Pretend to be a waiter/waitress and take orders from everyone!",
    "Imitate someone else in the room for the next 5 minutes!",
    "Do your best dance move right now!",
    "Do 20 squats without stopping!",
    "Take a silly photo and set it as your profile picture for an hour!",
];

//start game button
document.getElementById('start-game').addEventListener('click', () => {
	if (currentSlide !== 3) {
        event.preventDefault();
        return;
    }
	// console.log('Start game button clicked');
    
    const slideshowContainer = document.querySelector('.slideshow-container');
    const gameContainer = document.querySelector('.game-container');
    
    if (slideshowContainer && gameContainer) {
        console.log('Elements found');
        slideshowContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
    } else {
        console.error('Could not find slideshow or game container');
    }
	if (hasPaid()) {
		showGame();
	}
	else {
		showPayment();
	}
});

document.getElementById('already-paid')?.addEventListener('click', () => {
	//only for testing
	localStorage.setItem('hasPaid', true);
	showGame();
})

//Payment buttons
document.querySelectorAll('.payment-button').forEach(button => {
	button.addEventListener('click', (event) => {
		const price = event.target.closest('.price-option').dataset.price;
		initiatePayment(price);
	});
});

function showPayment() {
	document.querySelector('.slideshow-container').classList.add('hidden');
	document.querySelector('.payment-container').classList.remove('hidden');
}

function showGame() {
	document.querySelector('.slideshow-container').classList.add('hidden');
    document.querySelector('.payment-container').classList.add('hidden');
    document.querySelector('.game-container').classList.remove('hidden');
}

// Stripe payment integration
function initiatePayment(price) {
    // Convert to cents for Stripe
    const amount = Math.round(parseFloat(price) * 100);
    
    // Create Stripe checkout session
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            price: amount,
            product: "Truth or Dare Game Access"
        }),
    })
    .then(response => response.json())
    .then(session => {
        // Redirect to Stripe Checkout
        const stripe = Stripe('pk_test_51R7BwWRtOxWs9089odRiYwE0ibV9kAmoE12SXaIdeRKg57fEPOzUCHC2JCxzOKjjrk0zkRIaAZ9OAiYaHuDH1BhX00bJJwWC04');
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(result => {
        if (result.error) {
            alert(result.error.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Check for successful payment return
function checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    
    if (paymentSuccess === 'true') {
        localStorage.setItem('hasPaid', 'true');
        showGame();
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

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

// ======================
// 4. INITIAL SETUP
// ======================

// Show first slide when page loads
showSlide(0);
checkPaymentStatus();