import { addEventListenerByQuery } from "./Helpers/utilitesFun.js";

const pawnsPosHandler = (e, handler) => {
  const target = e.target;
  if (
    !(
      target.classList.contains("button-white") ||
      target.classList.contains("button-black")
    )
  )
    return;
  const dataset = target.dataset.color;
  handler && handler(dataset);
};
export function ButtonControlInit(handler) {
  const element = addEventListenerByQuery(
    "click",
    (e) => pawnsPosHandler(e, handler),
    ".container_buttons"
  );
}
