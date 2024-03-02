export class Modal {
  constructor(contentId, fallbackText) {
    this.contentTemplateEl = document.getElementById(contentId);
    this.modalTemplateEl = document.getElementById("modal-template");
    this.fallbackText = "fallback text";
  }

  show() {
    if ("content" in document.createElement("template")) {
      const modalElements = document.importNode(
        // use content of a <template> and create a node based on it
        this.modalTemplateEl.content,
        true
      );
      this.modalElement = modalElements.querySelector(".modal");
      this.backdropElement = modalElements.querySelector(".backdrop");
      const contentElement = document.importNode(
        this.contentTemplateEl.content,
        true
      );
      this.modalElement.appendChild(contentElement);
      document.body.insertAdjacentElement("afterbegin", this.modalElement);
      document.body.insertAdjacentElement("afterbegin", this.backdropElement);
    } else {
      //fallback if IE ( bc it wont render a template )
      alert(this.fallbackText);
    }
  }
  hide() {
    if (this.modalElement) {
      document.body.removeChild(this.modalElement);
      document.body.removeChild(this.backdropElement);
      this.modalElement = null;
      this.backdropElement = null;
    }
  }
}
