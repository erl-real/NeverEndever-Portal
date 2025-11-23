const pointLight = document.querySelector("fePointLight");
const pointLightFlipped = document.getElementById("fePointLightFlipped");
const stickerContainer = document.querySelector(".sticker-container");
const draggable = document.querySelector(".draggable");

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

function getContainingBlockOffset(element) {
  let containingBlock = element.offsetParent || document.documentElement;
  const containingBlockRect = containingBlock.getBoundingClientRect();
  return {
    left: containingBlockRect.left,
    top: containingBlockRect.top
  };
}

function updateLightPosition(mouseX, mouseY) {
  const rect = stickerContainer.getBoundingClientRect();
  const relativeX = mouseX - rect.left;
  const relativeY = mouseY - rect.top;
  pointLight.setAttribute("x", relativeX);
  pointLight.setAttribute("y", relativeY);
  pointLightFlipped.setAttribute("x", relativeX);
  pointLightFlipped.setAttribute("y", rect.height - relativeY);
}

function startDrag(e) {
  isDragging = true;
  const rect = draggable.getBoundingClientRect();
  const containingBlockOffset = getContainingBlockOffset(draggable);

  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  draggable.style.left = rect.left - containingBlockOffset.left + "px";
  draggable.style.top = rect.top - containingBlockOffset.top + "px";
}

function updateDragPosition(e) {
  if (isDragging) {
    const containingBlockOffset = getContainingBlockOffset(draggable);
    draggable.style.left =
      e.clientX - dragOffsetX - containingBlockOffset.left + "px";
    draggable.style.top =
      e.clientY - dragOffsetY - containingBlockOffset.top + "px";
  }
}

function stopDrag() {
  isDragging = false;
}

draggable.addEventListener("mousedown", startDrag);
document.addEventListener("mouseup", stopDrag);
document.addEventListener("mousemove", (e) => {
  updateLightPosition(e.clientX, e.clientY);
  updateDragPosition(e);
});
