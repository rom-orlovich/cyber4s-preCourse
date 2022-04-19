"use strict;";
const btnAddToCart = document.querySelector(
  ".addCart .button.button_fullWidth"
);
console.log(btnAddToCart);
const body = document.querySelector("body");

const model = document.createElement("div");
model.setAttribute("id", "backDrop");
model.innerHTML = `

<div role="dialog" id="model"> 


</div>`;
model.addEventListener("click", (e) => {
  console.log(e.target.id);
  if (e.target?.id !== "backDrop") return;
  body.removeChild(model);
});
btnAddToCart.addEventListener("click", (e) => {
  if (
    !e.target &&
    e.target.nodeType === 1 &&
    e.target.classList.contain("addCart button button_fullWidth")
  )
    return;
  body["appendChild"](model);
});
