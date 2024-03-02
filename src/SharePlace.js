import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";
import { getAddressFromCoords, getCoordsFromAddress } from "./utils/Location";
class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector("form");
    const locateUserBtn = document.getElementById("locate-btn");
    this.shareBtn = document.getElementById("share-btn");

    locateUserBtn.addEventListener("click", this.locateUserHandler.bind(this));
    addressForm.addEventListener("submit", this.findAddressHandler.bind(this));
    this.shareBtn.addEventListener("click", this.sharePlaceHandler);
  }
  sharePlaceHandler() {
    const sharedLinkInputElement = document.getElementById("share-link");

    if (!navigator.clipboard) {
      sharedLinkInputElement.select();
      return;
    }

    navigator.clipboard
      .writeText(sharedLinkInputElement.value)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.log(err);
        sharedLinkInputElement.select();
      });
  }
  selectPlace(coordinates, address) {
    this.map ? this.map.render(coordinates) : (this.map = new Map(coordinates));
    this.shareBtn.disabled = false;
    const sharedLinkInputElement = document.getElementById("share-link");
    sharedLinkInputElement.value = `${
      location.origin
    }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
      coordinates.lng
    }`;
  }
  async locateUserHandler() {
    if (!navigator.geolocation) {
      alert(
        "Location feature is not availailable in your browser. Please use a more modern browser or manually enter a location"
      );
      return;
    }
    const modal = new Modal(
      "loading-modal-content",
      "Loading location - please wait"
    );
    modal.show();
    navigator.geolocation.getCurrentPosition(
      async (successResult) => {
        modal.hide();
        const coordinates = {
          lat: successResult.coords.latitude,
          lng: successResult.coords.longitude,
        };
        const address = await getAddressFromCoords(coordinates);

        this.selectPlace(coordinates, address);
        modal.hide();
      },
      (error) => {
        modal.hide();
        alert("Could not locate you. Please enter your address manually");
      }
    );
  }

  async findAddressHandler(event) {
    event.preventDefault();
    const address = event.target.querySelector("input").value;
    if (!address || address.trim().length === 0) {
      alert("No address found, please try again");
      return;
    }
    const modal = new Modal(
      "loading-modal-content",
      "Loading location - please wait"
    );
    modal.show();
    try {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates, address);
      modal.hide();
    } catch (err) {
      alert(err.message);
      modal.hide();
    }
  }
}

const placeFinder = new PlaceFinder();
