const bikes = [];

function showModal(content, callback) {
    const modal = document.getElementById("myModal");
    const modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = content;

    const closeButton = document.querySelector(".close");
    closeButton.onclick = () => {
        modal.style.display = "none";
    };

    modal.style.display = "block";

    if (callback) {
        const form = modalBody.querySelector("form");
        form.onsubmit = (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const result = {};
            for (let [key, value] of formData.entries()) {
                result[key] = value;
            }
            modal.style.display = "none";
            callback(result);
        };
    }
}

function getNumberOfBikes() {
    const numberOfBikesForm = `
            <form>
                <label for="numberOfBikes">Enter the number of bikes:</label>
                <input type="number" id="numberOfBikes" name="numberOfBikes" required>
                <button type="submit">Submit</button>
            </form>
        `;
    showModal(numberOfBikesForm, (data) => {
        const numberOfBikes = parseInt(data.numberOfBikes);

        if (!Number.isInteger(numberOfBikes) || numberOfBikes <= 0) {
            alert('Entered value is not a valid integer. Please try again.');
            getNumberOfBikes();
        } else {
            getBikeDetails(numberOfBikes, 0);
        }
    });
}

function getBikeDetails(numberOfBikes, currentBikeIndex) {
    if (currentBikeIndex < numberOfBikes) {
        const bikeDetailsForm = `
                <form>
                    <label for="bikeName">Enter the name of bike ${currentBikeIndex + 1}:</label>
                    <input type="text" id="bikeName" name="bikeName" required>
                    <label for="bikePrice">Enter the price of the bike (only integers are allowed):</label>
                    <input type="number" id="bikePrice" name="bikePrice" required>
                    <button type="submit">Submit</button>
                </form>
            `;
        showModal(bikeDetailsForm, (data) => {
            let bikePrice = parseFloat(data.bikePrice);

            if (!Number.isInteger(bikePrice) || bikePrice <= 0) {
                alert('Entered value is not a valid integer. Please try again.');
                getBikeDetails(numberOfBikes, currentBikeIndex);
            } else {
                bikes.push({ name: data.bikeName, price: bikePrice });
                getBikeDetails(numberOfBikes, currentBikeIndex + 1);
            }
        });
    } else {
        displayBikeList();
    }
}

function displayBikeList() {
    let bikeList = '<h2>Available Bikes</h2>';
    bikeList += '<ul>';
    bikes.forEach(bike => {
        bikeList += `<li>${bike.name} - $${bike.price}</li>`;
    });
    bikeList += '</ul><button onclick="getBikeName()">OK</button>';
    showModal(bikeList);
}

function getBikeName() {
    const bikeNameForm = `
            <form>
                <label for="bikeName">Enter the bike name:</label>
                <input type="text" id="bikeName" name="bikeName" required>
                <button type="submit">Submit</button>
            </form>
        `;
    showModal(bikeNameForm, (data) => {
        const selectedBike = bikes.find(bike => bike.name.toLowerCase() === data.bikeName.toLowerCase());

        if (selectedBike) {
            getInitialPay(selectedBike);
        } else {
            showModal('<p>Bike not found.</p><button onclick="window.location.reload()">Try Again</button>');
        }
    });
}

function getInitialPay(selectedBike) {
    const initialPayForm = `
            <form>
                <label for="initialPay">Enter the initial payment amount (only integers are allowed):</label>
                <input type="number" id="initialPay" name="initialPay" required>
                <button type="submit">Submit</button>
            </form>
        `;
    showModal(initialPayForm, (data) => {
        const initialPay = parseFloat(data.initialPay);

        if (!Number.isInteger(initialPay) || initialPay <= 0) {
            alert('Entered value is not a valid integer. Please try again.');
            getInitialPay(selectedBike);
        } else {
            const requiredPay = selectedBike.price * 0.1;
            if (initialPay >= requiredPay) {
                showModal('<p>You are eligible for buying the bike!</p><button onclick="window.location.reload()">OK</button>');
            } else {
                showModal('<p>You are not eligible for buying the bike.</p><button onclick="window.location.reload()">OK</button>');
            }
        }
    });
}

window.onclick = (event) => {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

getNumberOfBikes();